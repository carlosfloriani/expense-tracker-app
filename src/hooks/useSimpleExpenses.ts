import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Person = "Ana" | "Lucas";
export type ExpenseType = "Ifood" | "Restaurante";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  person: Person;
  type: ExpenseType;
};

// Dados mock iniciais
const mockExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-12-15",
    amount: 45.50,
    person: "Ana",
    type: "Ifood"
  },
  {
    id: "2",
    date: "2024-12-14",
    amount: 78.90,
    person: "Lucas",
    type: "Restaurante"
  },
  {
    id: "3",
    date: "2024-12-13",
    amount: 32.00,
    person: "Ana",
    type: "Ifood"
  },
  {
    id: "4",
    date: "2024-12-12",
    amount: 120.00,
    person: "Lucas",
    type: "Restaurante"
  },
  {
    id: "5",
    date: "2024-12-11",
    amount: 28.50,
    person: "Ana",
    type: "Ifood"
  }
];

export const useSimpleExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Carregar dados do localStorage ou usar mock inicial
      const savedExpenses = localStorage.getItem('mock_expenses');
      const initialExpenses = savedExpenses ? JSON.parse(savedExpenses) : mockExpenses;
      
      setExpenses(initialExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Erro ao carregar gastos",
        description: "Não foi possível carregar os gastos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense: Expense = {
        id: Date.now().toString(), // Gerar ID único
        date: expense.date,
        amount: expense.amount,
        person: expense.person,
        type: expense.type
      };

      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
      
      // Salvar no localStorage
      localStorage.setItem('mock_expenses', JSON.stringify(updatedExpenses));
      
      toast({
        title: "Gasto adicionado",
        description: `${expense.type} • ${expense.person} • ${expense.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Erro ao adicionar gasto",
        description: "Não foi possível salvar o gasto.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      
      // Salvar no localStorage
      localStorage.setItem('mock_expenses', JSON.stringify(updatedExpenses));
      
      toast({
        title: "Gasto removido",
        description: "O gasto foi excluído com sucesso.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Erro ao excluir gasto",
        description: "Não foi possível excluir o gasto.",
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