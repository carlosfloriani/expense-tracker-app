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
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">quem gastou</label>
        <ToggleGroup
          type="single"
          value={person}
          onValueChange={(v) => v && setPerson(v as Props["person"])}
          className="flex gap-2"
        >
          {["Carlos", "Gabreilly"].map((p) => (
            <ToggleGroupItem
              key={p}
              value={p}
              aria-label={`Pessoa ${p}`}
              className="rounded-full px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {p}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">dia</label>
        <Input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="h-10 w-[150px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">quantidade</label>
        <ToggleGroup
          type="single"
          value={String(amount)}
          onValueChange={(v) => v && setAmount(parseFloat(v))}
          className="flex gap-2"
        >
          {[0.25, 0.5, 0.75, 1].map((v) => (
            <ToggleGroupItem
              key={v}
              value={String(v)}
              aria-label={`Valor ${v}`}
              className="rounded-full px-4 py-2 text-sm data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            >
              {v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">tipo</label>
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={(v) => v && setType(v as Props["type"])}
          className="flex gap-2"
        >
          {["Ifood", "Restaurante"].map((t) => (
            <ToggleGroupItem
              key={t}
              value={t}
              aria-label={`Tipo ${t}`}
              className="rounded-full px-4 py-2 text-sm data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
            >
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="ml-auto">
        <Button type="submit" className="rounded-full">
          enviar
        </Button>
      </div>
    </form>
  );
}
