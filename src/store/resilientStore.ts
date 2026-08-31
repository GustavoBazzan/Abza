import type { Meeting } from '../data/meeting';
import type { MeetingStore } from './types';

// Rede de segurança para quando o backend principal é o Supabase: uma
// gravação que falha (rede, RLS, projeto fora do ar) nunca é silenciosamente
// tratada como sucesso, e o dado nunca é perdido — fica em cache local só
// neste dispositivo até sincronizar. O localStorage aqui é só uma proteção
// contra perda de dado, nunca a fonte de verdade nem um jeito de mascarar
// erro da nuvem: ver CloudSaveFailedError abaixo, que o chamador é obrigado
// a tratar (nunca reportar "Salvo" quando na verdade caiu aqui).
const BACKUP_KEY = 'abza-meetings-cloud-backup-v1';

function readBackup(): Meeting[] {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Meeting[]) : [];
  } catch {
    return [];
  }
}

function writeBackup(meetings: Meeting[]) {
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(meetings));
  } catch {
    /* localStorage indisponível (modo privado / cota) — nada mais a fazer aqui */
  }
}

function upsertBackup(meeting: Meeting) {
  const all = readBackup();
  const idx = all.findIndex((m) => m.id === meeting.id);
  if (idx >= 0) all[idx] = meeting;
  else all.push(meeting);
  writeBackup(all);
}

function removeBackup(id: string) {
  writeBackup(readBackup().filter((m) => m.id !== id));
}

/** Erro específico para "a gravação na nuvem falhou, mas o dado está
 *  preservado localmente neste dispositivo" — o chamador precisa tratar
 *  isso como um estado visível (nunca reportar como salvo/sincronizado). */
export class CloudSaveFailedError extends Error {
  constructor() {
    super('Não foi possível salvar na nuvem agora — dados preservados só neste dispositivo.');
    this.name = 'CloudSaveFailedError';
  }
}

/** Envolve um MeetingStore com backend Supabase: toda gravação que falhar
 *  é cacheada aqui e o erro é propagado (nunca engolido) para quem chamou
 *  poder mostrar um estado de "não sincronizado". Toda leitura que não
 *  encontrar nada na nuvem cai de volta pro cache local, para o caso de uma
 *  reunião cujo save inicial ainda não sincronizou. Uma vez sincronizado, o
 *  backup correspondente é removido — ele nunca é a fonte de verdade. Só
 *  faz sentido para o backend Supabase; o backend localStorage já É a
 *  verdade local, não precisa de rede de segurança. */
export function withCloudBackup(primary: MeetingStore): MeetingStore {
  return {
    backend: primary.backend,

    async listMeetings() {
      return primary.listMeetings();
    },

    async getMeeting(id) {
      const remote = await primary.getMeeting(id);
      if (remote) return remote;
      return readBackup().find((m) => m.id === id) ?? null;
    },

    async saveMeeting(meeting) {
      try {
        await primary.saveMeeting(meeting);
        removeBackup(meeting.id);
      } catch (err) {
        upsertBackup(meeting);
        console.error(
          '[store] gravação na nuvem falhou — mantido só localmente neste dispositivo até sincronizar',
          err instanceof Error ? err.message : '(erro desconhecido)',
        );
        throw new CloudSaveFailedError();
      }
    },

    async deleteMeeting(id) {
      await primary.deleteMeeting(id);
      removeBackup(id);
    },
  };
}
