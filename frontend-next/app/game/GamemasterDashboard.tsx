import { Zap, TrendingDown, Play, Pause, RotateCcw, FastForward } from "lucide-react";

interface GamemasterPanelProps {
  playerId: string;
  sendMessage: (msg: Record<string, unknown>) => void;
}

const ActionButton = ({
  onClick,
  icon: Icon,
  label,
  variant = "default",
}: {
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  variant?: "default" | "danger" | "primary";
}) => {
  const styles = {
    default: "bg-panel hover:bg-panel/80 text-foreground border border-border",
    danger: "bg-destructive/10 hover:bg-destructive/20 text-destructive neon-border",
    primary: "bg-primary/10 hover:bg-primary/20 text-primary neon-border",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono transition-all duration-200 ${styles[variant]}`}
    >
      <Icon size={16} />
      <span className="tracking-wide">{label}</span>
    </button>
  );
};

const GamemasterPanel = ({ playerId, sendMessage }: GamemasterPanelProps) => {
  const triggerBonus = () =>
    sendMessage({ type: "gamemaster", fn: "bonusPoints", args: [playerId, 50] });
  const triggerCrash = () =>
    sendMessage({ type: "gamemaster", fn: "marketCrash", args: [] });
  const startTimer = () =>
    sendMessage({ type: "timer", action: "start", duration: 600 });
  const pauseTimer = () =>
    sendMessage({ type: "timer", action: "pause" });
  const resumeTimer = () =>
    sendMessage({ type: "timer", action: "resume" });
  const resetTimer = () =>
    sendMessage({ type: "timer", action: "reset" });

  return (
    <div className="grid-cols-full">
      <div className="rounded-lg bg-panel p-5 neon-border">
        <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow mb-4">
          Gamemaster Controls
        </h3>

        <div className="space-y-4">
          {/* Actions */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted mb-2">Actions</p>
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={triggerBonus} icon={Zap} label="Give 50 Points" variant="primary" />
              <ActionButton onClick={triggerCrash} icon={TrendingDown} label="Market Crash" variant="danger" />
            </div>
          </div>

          {/* Timer */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted mb-2">Timer</p>
            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={startTimer} icon={Play} label="Start" />
              <ActionButton onClick={pauseTimer} icon={Pause} label="Pause" />
              <ActionButton onClick={resumeTimer} icon={FastForward} label="Resume" />
              <ActionButton onClick={resetTimer} icon={RotateCcw} label="Reset" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamemasterPanel;
