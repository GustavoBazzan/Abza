import type { Stage } from '../../data/meeting';

export function IntroStage({ stage }: { stage: Stage }) {
  return (
    <>
      {stage.nextMove && (
        <div className="call-block soft">
          <p className="diagnosis-return-script">{stage.nextMove}</p>
        </div>
      )}
    </>
  );
}
