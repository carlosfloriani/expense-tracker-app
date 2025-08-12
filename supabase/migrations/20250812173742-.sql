-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount DECIMAL(4,2) NOT NULL,
  person TEXT NOT NULL CHECK (person IN ('Carlos', 'Gabreilly')),
  type TEXT NOT NULL CHECK (type IN ('Ifood', 'Restaurante')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since no auth yet)
CREATE POLICY "Public access to expenses" 
ON public.expenses 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_person ON public.expenses(person);
CREATE INDEX idx_expenses_type ON public.expenses(type);