import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Person = "Carlos" | "Gabreilly";
export type ExpenseType = "Ifood" | "Restaurante";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  person: Person;
  type: ExpenseType;
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses: Expense[] = data.map(expense => ({
        id: expense.id,
        date: expense.date,
        amount: parseFloat(expense.amount.toString()),
        person: expense.person as "Carlos" | "Gabreilly",
        type: expense.type as "Ifood" | "Restaurante"
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Erro ao carregar gastos",
        description: "Não foi possível carregar os gastos do banco de dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          date: expense.date,
          amount: expense.amount,
          person: expense.person,
          type: expense.type
        }])
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        date: data.date,
        amount: parseFloat(data.amount.toString()),
        person: data.person as "Carlos" | "Gabreilly",
        type: data.type as "Ifood" | "Restaurante"
      };

      setExpenses(prev => [newExpense, ...prev]);
      
      toast({
        title: "Gasto adicionado",
        description: `${expense.type} • ${expense.person} • ${expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Erro ao adicionar gasto",
        description: "Não foi possível salvar o gasto no banco de dados.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      
      toast({
        title: "Gasto removido",
        description: "O gasto foi excluído com sucesso.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Erro ao excluir gasto",
        description: "Não foi possível excluir o gasto do banco de dados.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    refetch: fetchExpenses
  };
};