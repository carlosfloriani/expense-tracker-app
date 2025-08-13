import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  amount: number;
  setAmount: (v: number) => void;
  person: "Carlos" | "Gabreilly";
  setPerson: (p: "Carlos" | "Gabreilly") => void;
  type: "Ifood" | "Restaurante";
  setType: (t: "Ifood" | "Restaurante") => void;
  dateStr: string;
  setDateStr: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ExpenseForm({
  amount,
  setAmount,
  person,
  setPerson,
  type,
  setType,
  dateStr,
  setDateStr,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Linha 1: Pessoa e Data */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Quem Gastou</label>
          <ToggleGroup
            type="single"
            value={person}
            onValueChange={(v) => v && setPerson(v as Props["person"])}
            className="grid grid-cols-2 gap-2 w-full"
          >
            {["Carlos", "Gabreilly"].map((p) => (
              <ToggleGroupItem
                key={p}
                value={p}
                aria-label={`Pessoa ${p}`}
                className={`rounded-xl py-3 text-sm font-medium transition-all ${
                  p === "Carlos" 
                    ? "data-[state=on]:bg-personCarlos data-[state=on]:text-personCarlos-foreground" 
                    : "data-[state=on]:bg-personGaby data-[state=on]:text-personGaby-foreground"
                } data-[state=off]:bg-muted data-[state=off]:text-muted-foreground`}
              >
                {p}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Data</label>
          <Input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="h-12 rounded-xl border-muted text-center font-medium [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:hue-rotate-[270deg] [&::-webkit-calendar-picker-indicator]:saturate-150"
          />
        </div>
      </div>

      {/* Linha 2: Quantidade */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">Quantidade</label>
        <ToggleGroup
          type="single"
          value={String(amount)}
          onValueChange={(v) => v && setAmount(parseFloat(v))}
          className="grid grid-cols-4 gap-2 w-full"
        >
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <ToggleGroupItem
              key={v}
              value={String(v)}
              aria-label={`Valor ${v}`}
              className="rounded-xl py-3 text-sm font-medium data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=off]:bg-muted data-[state=off]:text-muted-foreground"
            >
              {v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Linha 3: Tipo e Botão */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Tipo</label>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as Props["type"])}
            className="grid grid-cols-2 gap-2 w-full"
          >
            {["Ifood", "Restaurante"].map((t) => (
              <ToggleGroupItem
                key={t}
                value={t}
                aria-label={`Tipo ${t}`}
                className={`rounded-xl py-3 text-sm font-medium transition-all ${
                  t === "Ifood" 
                    ? "data-[state=on]:bg-ifood data-[state=on]:text-ifood-foreground" 
                    : "data-[state=on]:bg-restaurante data-[state=on]:text-restaurante-foreground"
                } data-[state=off]:bg-muted data-[state=off]:text-muted-foreground`}
              >
                {t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        <Button type="submit" className="rounded-xl px-8 py-3 h-12 font-medium">
          Adicionar
        </Button>
      </div>
    </form>
  );
}