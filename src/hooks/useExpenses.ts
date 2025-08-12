import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Person = "Carlos" | "Gabreilly";
export type ExpenseType = "Ifood" | "Restaurante";

export interface Expense {
  id: string;
  date: string; // ISO
  amount: number;
  person: Person;
  type: ExpenseType;
}

export function useExpenses(currentMonth: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expenses for current month
  useEffect(() => {
    loadExpenses();
  }, [currentMonth]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const startOfMonth = `${currentMonth}-01T00:00:00.000Z`;
      const [year, month] = currentMonth.split("-").map(Number);
      const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
      const endOfMonth = `${nextMonth}-01T00:00:00.000Z`;

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .gte("date", startOfMonth)
        .lt("date", endOfMonth)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error loading expenses:", error);
        toast({
          title: "Erro ao carregar gastos",
          description: "Não foi possível carregar os gastos do mês.",
          variant: "destructive",
        });
        return;
      }

      setExpenses((data || []) as Expense[]);
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast({
        title: "Erro ao carregar gastos",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expense])
        .select()
        .single();

      if (error) {
        console.error("Error adding expense:", error);
        toast({
          title: "Erro ao adicionar gasto",
          description: "Não foi possível salvar o gasto.",
          variant: "destructive",
        });
        return false;
      }

      setExpenses(prev => [data as Expense, ...prev]);
      toast({
        title: "Gasto adicionado",
        description: `${expense.type} • ${expense.person} • ${expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      });
      return true;
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Erro ao adicionar gasto",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting expense:", error);
        toast({
          title: "Erro ao excluir gasto",
          description: "Não foi possível excluir o gasto.",
          variant: "destructive",
        });
        return false;
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: "Gasto removido",
        description: "O gasto foi excluído com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Erro ao excluir gasto",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    refreshExpenses: loadExpenses,
  };
}