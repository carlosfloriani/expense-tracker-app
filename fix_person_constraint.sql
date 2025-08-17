-- Script para corrigir a constraint da coluna person
-- Execute este script diretamente no SQL Editor do Supabase

-- Drop the existing constraint
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_person_check;

-- Add the correct constraint
ALTER TABLE public.expenses ADD CONSTRAINT expenses_person_check 
CHECK (person IN ('Carlos', 'Gabrielly'));

-- Update any existing data that might have the old spelling
UPDATE public.expenses 
SET person = 'Gabrielly' 
WHERE person = 'Gabreilly';
