import { useState } from "react";
import CyberCard from "../components/ui/CyberCard";
import { Zap } from "lucide-react";

interface PanelProps {
  playerId: string;
  sendMessage: (msg: Record<string, unknown>) => void;
}

const Spread = ({ playerId, sendMessage }: PanelProps) => {
  const [spread, setSpread] = useState<number | "">(""); // empty input initially
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // only allow integers >= 0
    if (val === "") {
      setSpread("");
      setError(null);
      return;
    }

    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) {
      setError("Please enter a valid non-negative integer");
    } else {
      setError(null);
      setSpread(num);
    }
  };

  const handleSetSpread = () => {
    if (spread === "" || error) return;

    sendMessage({
      type: "action",
      action: "spread",
      spread: spread
    });

    // Optionally reset input after sending
    setSpread("");
  };

  return (
    <CyberCard title="Set Minimum Spread">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-wider text-muted">
          Enter Minimum Spread
        </label>
        <div className="grid grid-cols-2 gap-4 justify-center">
            <input
            type="number"
            value={spread}
            onChange={handleChange}
            min={0}
            className="bg-panel border border-border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-glow text-foreground"
            placeholder="0"
            />
            {error && <p className="text-[10px] text-destructive">{error}</p>}

            <button
            onClick={handleSetSpread}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-mono text-primary bg-primary/10 hover:bg-primary/20 neon-border mt-1 transition-all duration-200"
            >
            <Zap size={16} />
            Set Spread
            </button>
        </div>
      </div>
    </CyberCard>
  );
};

export default Spread;
