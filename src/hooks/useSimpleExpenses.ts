import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Person = "Carlos" | "Gabrielly";
export type ExpenseType = "Ifood" | "Restaurante";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  person: Person;
  type: ExpenseType;
};

export const useSimpleExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses: Expense[] = data.map(expense => {
        // Parse the ISO date and convert to local date string
        const date = new Date(expense.date);
        const localDate = date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
        
        return {
          id: expense.id,
          date: localDate,
          amount: parseFloat(expense.amount.toString()),
          person: expense.person as Person,
          type: expense.type as ExpenseType
        };
      });

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
      console.log('Adding expense with date:', expense.date);
      
      // Convert YYYY-MM-DD to ISO string with local timezone
      const [year, month, day] = expense.date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0, 0);
      const isoDate = localDate.toISOString();
      
      console.log('Formatted date:', isoDate);
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          date: isoDate,
          amount: expense.amount,
          person: expense.person,
          type: expense.type
        }])
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        date: new Date(data.date).toLocaleDateString('en-CA'),
        amount: parseFloat(data.amount.toString()),
        person: data.person as Person,
        type: data.type as ExpenseType
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

  // Setup realtime subscription
  useEffect(() => {
    fetchExpenses();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log('Realtime change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newExpense = payload.new as any;
            const formattedExpense: Expense = {
              id: newExpense.id,
              date: new Date(newExpense.date).toLocaleDateString('en-CA'),
              amount: parseFloat(newExpense.amount.toString()),
              person: newExpense.person as Person,
              type: newExpense.type as ExpenseType
            };
            // Avoid duplicate entries by checking if expense already exists
            setExpenses(prev => {
              const exists = prev.some(exp => exp.id === formattedExpense.id);
              if (exists) return prev;
              return [formattedExpense, ...prev];
            });
          } else if (payload.eventType === 'DELETE') {
            setExpenses(prev => prev.filter(expense => expense.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            const updatedExpense = payload.new as any;
            const formattedExpense: Expense = {
              id: updatedExpense.id,
              date: new Date(updatedExpense.date).toLocaleDateString('en-CA'),
              amount: parseFloat(updatedExpense.amount.toString()),
              person: updatedExpense.person as Person,
              type: updatedExpense.type as ExpenseType
            };
            setExpenses(prev => prev.map(expense => 
              expense.id === formattedExpense.id ? formattedExpense : expense
            ));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    refetch: fetchExpenses
  };
};