#!/usr/bin/env bash
# Validação da integração real em produção — roda contra o site publicado
# de verdade (Vercel) e o Supabase real, sem precisar do sandbox do Claude
# Code (que não tem acesso de rede geral). Só precisa de `curl` e `jq`.
#
# Uso:
#   TEST_USER_EMAIL='seu-usuario-de-teste@dominio.com' \
#   TEST_USER_PASSWORD='...' \
#   bash scripts/production-validation.sh
#
# Opcional (o script tenta descobrir sozinho a partir do bundle público do
# site, mas você pode fornecer direto se preferir — nenhum dos dois é
# secreto, são os mesmos valores client-safe já embutidos no frontend):
#   SUPABASE_URL=https://xxxx.supabase.co
#   SUPABASE_ANON_KEY=sb_publishable_... (ou o JWT legado)
#
# O script NUNCA imprime TEST_USER_PASSWORD, e apaga a reunião de teste que
# ele mesmo cria no final (limpeza).

set -uo pipefail

PROD_URL="${PROD_URL:-https://abza-sales-playbook.vercel.app}"
PASS=0
FAIL=0

ok()   { PASS=$((PASS+1)); echo "OK   $1"; }
bad()  { FAIL=$((FAIL+1)); echo "FAIL $1 -- $2"; }

command -v curl >/dev/null || { echo "curl não encontrado."; exit 1; }
command -v jq   >/dev/null || { echo "jq não encontrado (instale: apt install jq / brew install jq)."; exit 1; }

if [[ -z "${TEST_USER_EMAIL:-}" || -z "${TEST_USER_PASSWORD:-}" ]]; then
  echo "Defina TEST_USER_EMAIL e TEST_USER_PASSWORD como variáveis de ambiente antes de rodar."
  exit 1
fi

echo "== 0) Descobrindo SUPABASE_URL / SUPABASE_ANON_KEY a partir do bundle público (se não fornecidos) =="
if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_ANON_KEY:-}" ]]; then
  HTML=$(curl -sS --max-time 15 "$PROD_URL/")
  JS_PATH=$(echo "$HTML" | grep -oE '/assets/index-[A-Za-z0-9]+\.js' | head -1)
  if [[ -z "$JS_PATH" ]]; then
    echo "Não consegui achar o bundle JS automaticamente. Forneça SUPABASE_URL e SUPABASE_ANON_KEY manualmente (não são secretos — pegue no DevTools > Network do site, ou em Project Settings > API do Supabase)."
    exit 1
  fi
  JS=$(curl -sS --max-time 20 "$PROD_URL$JS_PATH")
  SUPABASE_URL="${SUPABASE_URL:-$(echo "$JS" | grep -oE 'https://[a-z0-9]+\.supabase\.co' | head -1)}"
  SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-$(echo "$JS" | grep -oE 'sb_publishable_[A-Za-z0-9_-]+' | head -1)}"
  if [[ -z "$SUPABASE_ANON_KEY" ]]; then
    SUPABASE_ANON_KEY=$(echo "$JS" | grep -oE 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' | head -1)
  fi
fi

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_ANON_KEY:-}" ]]; then
  echo "Não consegui descobrir SUPABASE_URL/SUPABASE_ANON_KEY automaticamente. Forneça-os como variáveis de ambiente e rode de novo."
  exit 1
fi
echo "SUPABASE_URL descoberta: $SUPABASE_URL"
echo "SUPABASE_ANON_KEY descoberta: ${SUPABASE_ANON_KEY:0:12}... (truncada no log, não é secreta)"
echo

echo "== 1) /api/copilot sem Authorization -> esperado 401 =="
R=$(curl -sS -o /tmp/_r1.json -w "%{http_code}" --max-time 20 -X POST "$PROD_URL/api/copilot" -H "Content-Type: application/json" -d '{"meeting":{}}')
CODE=$(echo "$R" | tail -c 3)
BODY=$(cat /tmp/_r1.json)
[[ "$CODE" == "401" ]] && ok "sem token -> 401 (item 7)" || bad "sem token" "esperado 401, veio $CODE ($BODY)"
echo "$BODY" | grep -qi "sk-\|service_role\|at .*(.*:.*:.*)" && bad "resposta sem token pode conter dado sensível" "$BODY"

echo
echo "== 2) /api/copilot com Bearer forjado -> esperado 401 =="
R=$(curl -sS -o /tmp/_r2.json -w "%{http_code}" --max-time 20 -X POST "$PROD_URL/api/copilot" -H "Content-Type: application/json" -H "Authorization: Bearer token-forjado-invalido" -d '{"meeting":{}}')
CODE=$(echo "$R" | tail -c 3)
[[ "$CODE" == "401" ]] && ok "token inválido -> 401 (item 7)" || bad "token inválido" "esperado 401, veio $CODE ($(cat /tmp/_r2.json))"

echo
echo "== 3) método GET em /api/copilot -> esperado 405 =="
CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 20 "$PROD_URL/api/copilot")
[[ "$CODE" == "405" ]] && ok "GET -> 405" || bad "GET" "esperado 405, veio $CODE"

echo
echo "== 4) Login real (Supabase Auth) com a conta de teste =="
LOGIN_RES=$(curl -sS --max-time 20 -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_USER_EMAIL\",\"password\":\"$TEST_USER_PASSWORD\"}")
ACCESS_TOKEN=$(echo "$LOGIN_RES" | jq -r '.access_token // empty')
USER_ID=$(echo "$LOGIN_RES" | jq -r '.user.id // empty')
if [[ -n "$ACCESS_TOKEN" ]]; then
  ok "login real emitiu access_token (item 1 — autenticação real)"
else
  bad "login" "$(echo "$LOGIN_RES" | jq -c '{error, error_description, msg}' 2>/dev/null)"
  echo "Sem token de acesso, não dá para continuar os testes autenticados. Abortando aqui."
  exit 1
fi

echo
echo "== 5) /api/copilot com token válido + payload malformado -> esperado 400 =="
R=$(curl -sS -o /tmp/_r5.json -w "%{http_code}" --max-time 20 -X POST "$PROD_URL/api/copilot" -H "Content-Type: application/json" -H "Authorization: Bearer $ACCESS_TOKEN" -d '{}')
CODE=$(echo "$R" | tail -c 3)
[[ "$CODE" == "400" ]] && ok "token válido + payload inválido -> 400" || bad "payload inválido" "esperado 400, veio $CODE ($(cat /tmp/_r5.json))"

echo
echo "== 6) /api/copilot com token válido + reunião mínima válida -> chamada REAL à OpenAI =="
MTG_ID="mtg_claude_validation_$(date +%s)"
# Objetos completos (nunca `{}`) — o Context Builder do Copilot
# (src/knowledge/copilotPromptContext.ts) acessa campos como
# scope.selectedItemIds/customItems e qualification.* diretamente, sem
# defesa contra objeto vazio (o app sempre garante isso via
# emptyQualification()/emptyDiagnosis()/emptyScope()/emptyPricing()/
# emptyClosing() em src/data/meeting.ts) — replicamos os mesmos defaults aqui.
MEETING_PAYLOAD=$(jq -n --arg id "$MTG_ID" '{
  meeting: {
    id: $id, productId: "marketing-estrategico", currentStageIndex: 2,
    setup: {client:"Cliente Teste Validação", company:"Empresa Teste", productId:"marketing-estrategico", owner:"Validação Claude", date:"2026-09-07", participants:"", origin:"", note:""},
    answers: {},
    qualification: {decisionMaker:"", otherParticipants:"", deadline:"", urgency:"", budgetRange:"", competitors:"", otherVendors:"", decisionCriteria:"", pastExperience:"", constraints:"", realChance:""},
    diagnosis: {centralProblem:"Depende de indicação para gerar novos clientes.", impact:"Perdeu oportunidades por falta de previsibilidade de pipeline.", objective:"", mainOpportunity:"", urgency:"", fitWithAbza:"", risks:"", undiscovered:"", clientConfirmed:false, confirmationNotes:""},
    scope: {selectedItemIds:[], customItems:[], notes:""},
    pricing: {amount:"", paymentTerms:"", deadline:"", note:""},
    closing: {lossReason:"", pendingObjection:"", responsiblePerson:"", requiredAction:"", nextStep:"", nextStepDate:"", nextStepOwner:""},
    objections: [], techniquesViewed: [], insights: [], copilotHistory: [],
    startedAt: (now | todate), updatedAt: (now | todate)
  }
}')
R=$(curl -sS -o /tmp/_r6.json -w "%{http_code}" --max-time 40 -X POST "$PROD_URL/api/copilot" -H "Content-Type: application/json" -H "Authorization: Bearer $ACCESS_TOKEN" -d "$MEETING_PAYLOAD")
CODE=$(echo "$R" | tail -c 3)
SUGGESTION_SUMMARY=$(jq -r '.suggestion.summary // empty' /tmp/_r6.json 2>/dev/null)
MODEL_USED=$(jq -r '.model // empty' /tmp/_r6.json 2>/dev/null)
if [[ "$CODE" == "200" && -n "$SUGGESTION_SUMMARY" ]]; then
  ok "token válido + reunião válida -> 200 com sugestão REAL da OpenAI (item 8 e 9)"
  echo "     modelo usado: $MODEL_USED"
  echo "     resumo gerado pela IA: $SUGGESTION_SUMMARY"
else
  bad "chamada real à OpenAI" "esperado 200 com suggestion, veio $CODE ($(cat /tmp/_r6.json))"
fi

echo
echo "== 7) Persistência real: grava a mesma reunião + resposta + insight direto no Postgres via REST (mesmas colunas que o app usa) =="
NOW_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
curl -sS -o /tmp/_r7a.json -w "\nHTTP %{http_code}\n" --max-time 20 -X POST "$SUPABASE_URL/rest/v1/meetings" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  -d "$(jq -n --arg id "$MTG_ID" --arg now "$NOW_ISO" '{id:$id, product_id:"marketing-estrategico", status:"em-andamento", setup:{}, qualification:{}, diagnosis:{}, scope:{}, pricing:{}, closing:{}, current_stage_index:2, techniques_viewed:[], started_at:$now, updated_at:$now}')" >/tmp/_r7a_full.log
cat /tmp/_r7a.json >>/tmp/_r7a_full.log

curl -sS -o /tmp/_r7b.json -w "\nHTTP %{http_code}\n" --max-time 20 -X POST "$SUPABASE_URL/rest/v1/meeting_answers" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" -H "Prefer: resolution=merge-duplicates" \
  -d "$(jq -n --arg mid "$MTG_ID" --arg now "$NOW_ISO" '[{meeting_id:$mid, question_id:"validacao-claude", value:"Resposta de validação de produção.", source:"manual", updated_at:$now}]')"

if [[ -n "$SUGGESTION_SUMMARY" ]]; then
  curl -sS -o /tmp/_r7c.json -w "\nHTTP %{http_code}\n" --max-time 20 -X POST "$SUPABASE_URL/rest/v1/meeting_copilot_insights" \
    -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
    -d "$(jq -n --arg mid "$MTG_ID" --arg now "$NOW_ISO" --argjson sug "$(jq '.suggestion' /tmp/_r6.json)" --arg model "$MODEL_USED" '{
      id: ("ins_validacao_" + ($now | gsub("[^0-9]";""))), meeting_id: $mid, stage_id: "diagnosis", question_id: null,
      trigger: "manual", source: "ai", model: $model,
      summary: $sug.summary, main_insight: $sug.mainInsight, next_question: $sug.nextQuestion, why: $sug.why,
      missing_information: $sug.missingInformation, detected_objection: $sug.detectedObjection, recommended_technique: $sug.recommendedTechnique,
      risk_level: $sug.riskLevel, recommended_move: $sug.recommendedMove, alert: $sug.alert, do_not_do: $sug.doNotDo, created_at: $now
    }')"
fi

echo
echo "== 8) Recuperação após reload: lê tudo de volta do Postgres (mesmas queries do app) =="
MEETING_BACK=$(curl -sS --max-time 20 "$SUPABASE_URL/rest/v1/meetings?id=eq.$MTG_ID&select=*" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN")
ANSWERS_BACK=$(curl -sS --max-time 20 "$SUPABASE_URL/rest/v1/meeting_answers?meeting_id=eq.$MTG_ID&select=*" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN")
INSIGHTS_BACK=$(curl -sS --max-time 20 "$SUPABASE_URL/rest/v1/meeting_copilot_insights?meeting_id=eq.$MTG_ID&select=*" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN")

[[ "$(echo "$MEETING_BACK" | jq 'length')" == "1" ]] && ok "reunião recuperada após 'reload' (item 2/5)" || bad "reunião não recuperada" "$MEETING_BACK"
[[ "$(echo "$ANSWERS_BACK" | jq 'length')" -ge 1 ]] && ok "meeting_answers recuperada (item 3/5)" || bad "meeting_answers não recuperada" "$ANSWERS_BACK"
if [[ -n "$SUGGESTION_SUMMARY" ]]; then
  [[ "$(echo "$INSIGHTS_BACK" | jq 'length')" == "1" ]] && ok "meeting_copilot_insights persistida e recuperada (item 10/11)" || bad "meeting_copilot_insights não recuperada" "$INSIGHTS_BACK"
fi

echo
echo "== 9) Usuário anônimo (sem token, só apikey) tentando ler o Postgres -> esperado bloqueado pela RLS =="
ANON_READ=$(curl -sS -w "\nHTTP %{http_code}" --max-time 20 "$SUPABASE_URL/rest/v1/meetings?id=eq.$MTG_ID&select=*" -H "apikey: $SUPABASE_ANON_KEY")
ANON_CODE=$(echo "$ANON_READ" | tail -c 3)
ANON_BODY=$(echo "$ANON_READ" | sed '$d')
ANON_ROWS=$(echo "$ANON_BODY" | jq 'length' 2>/dev/null || echo "?")
if [[ "$ANON_CODE" == "200" && "$ANON_ROWS" == "0" ]] || [[ "$ANON_CODE" != "200" ]]; then
  ok "usuário anônimo não lê a reunião (RLS bloqueando de verdade)"
else
  bad "RLS pode estar permitindo leitura anônima" "HTTP $ANON_CODE, linhas: $ANON_ROWS"
fi

echo
echo "== 10) Logout real + repetir a MESMA chamada ao /api/copilot com o token já 'deslogado' =="
curl -sS -o /dev/null --max-time 20 -X POST "$SUPABASE_URL/auth/v1/logout" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
R=$(curl -sS -o /tmp/_r10.json -w "%{http_code}" --max-time 20 -X POST "$PROD_URL/api/copilot" -H "Content-Type: application/json" -H "Authorization: Bearer $ACCESS_TOKEN" -d "$MEETING_PAYLOAD")
CODE=$(echo "$R" | tail -c 3)
echo "     resultado após logout, reusando o mesmo access_token: HTTP $CODE"
echo "     (nota: um access_token JWT pode continuar tecnicamente válido até expirar mesmo após logout — isso é esperado do padrão OAuth/JWT stateless, não é uma falha desta implementação; o que importa na prática é que o app nunca reenvia esse token depois do logout, o que já foi validado no código)"

echo
echo "== Limpeza: apagando a reunião de teste criada ($MTG_ID) =="
curl -sS -o /dev/null --max-time 20 -X DELETE "$SUPABASE_URL/rest/v1/meeting_copilot_insights?meeting_id=eq.$MTG_ID" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
curl -sS -o /dev/null --max-time 20 -X DELETE "$SUPABASE_URL/rest/v1/meeting_answers?meeting_id=eq.$MTG_ID" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
curl -sS -o /dev/null --max-time 20 -X DELETE "$SUPABASE_URL/rest/v1/meetings?id=eq.$MTG_ID" -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN"
echo "Limpeza concluída (se algum DELETE falhar por RLS/permissão, apague manualmente a reunião $MTG_ID depois)."

echo
echo "== RESULTADO: $PASS passou, $FAIL falhou =="
rm -f /tmp/_r*.json /tmp/_r7a_full.log
exit $([[ $FAIL -eq 0 ]] && echo 0 || echo 1)
