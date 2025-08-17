-- Script final para corrigir problemas de timezone no Supabase
-- Execute este script diretamente no SQL Editor do Supabase

-- 1. Verificar o estado atual das datas
SELECT 
  id,
  date,
  DATE(date) as data_extraida,
  EXTRACT(HOUR FROM date) as hora,
  amount,
  person,
  type
FROM public.expenses 
ORDER BY date DESC 
LIMIT 10;

-- 2. Corrigir todas as datas para garantir que estejam no meio do dia (12:00)
-- Isso resolve problemas de timezone onde datas podem estar sendo interpretadas como UTC
UPDATE public.expenses 
SET date = (
  DATE(date) || 'T12:00:00.000Z'
)::timestamp with time zone;

-- 3. Verificar o resultado após a correção
SELECT 
  id,
  date,
  DATE(date) as data_extraida,
  EXTRACT(HOUR FROM date) as hora,
  amount,
  person,
  type
FROM public.expenses 
ORDER BY date DESC 
LIMIT 10;

-- 4. Estatísticas por data para verificar se está correto
SELECT 
  DATE(date) as data,
  COUNT(*) as total_registros,
  SUM(amount) as valor_total,
  STRING_AGG(person || ' (' || type || ' - ' || amount || ')', ', ') as detalhes
FROM public.expenses 
GROUP BY DATE(date)
ORDER BY data DESC;

-- 5. Verificar se há algum registro com data inválida
SELECT 
  id,
  date,
  amount,
  person,
  type
FROM public.expenses 
WHERE date IS NULL OR date < '2020-01-01' OR date > '2030-12-31'
ORDER BY date;
