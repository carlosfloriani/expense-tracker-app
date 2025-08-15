-- Fix security warnings: search path for functions
-- Update function to set secure search path

CREATE OR REPLACE FUNCTION validate_expense_data()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Validate amount is positive
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  -- Validate person is valid
  IF NEW.person NOT IN ('Carlos', 'Gabrielly') THEN
    RAISE EXCEPTION 'Person must be Carlos or Gabrielly';
  END IF;
  
  -- Validate type is valid
  IF NEW.type NOT IN ('Ifood', 'Restaurante') THEN
    RAISE EXCEPTION 'Type must be Ifood or Restaurante';
  END IF;
  
  -- Validate date is not in the future
  IF NEW.date > NOW() + INTERVAL '1 day' THEN
    RAISE EXCEPTION 'Date cannot be more than 1 day in the future';
  END IF;
  
  RETURN NEW;
END;
$$;