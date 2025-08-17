import React from "react";

interface CounterBarProps {
  label: string;
  count: number;
  limit: number;
}

const CounterBar: React.FC<CounterBarProps> = ({ label, count, limit }) => {
  const pct = Math.min(100, Math.round((count / limit) * 100));

  const tone = pct < 60 ? "success" : pct < 90 ? "warning" : "destructive";
  const barClass =
    tone === "success"
      ? "bg-success"
      : tone === "warning"
      ? "bg-warning"
      : "bg-destructive";

  return (
    <div className="space-y-2" aria-label={`${label} ${count} de ${limit}`}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span>
        <span>
          {count.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/{limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuenow={count}
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default CounterBar;
