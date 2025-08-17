-- Script para corrigir datas com problemas de timezone no Supabase
-- Execute este script diretamente no SQL Editor do Supabase

-- Primeiro, vamos ver as datas atuais para entender o problema
SELECT 
  id,
  date,
  amount,
  person,
  type,
  created_at
FROM public.expenses 
ORDER BY date DESC 
LIMIT 10;

-- Agora vamos corrigir as datas que podem estar com problemas de timezone
-- O problema é que algumas datas podem estar sendo interpretadas como UTC
-- quando deveriam ser locais

-- Vamos atualizar as datas para garantir que estejam no meio do dia local
UPDATE public.expenses 
SET date = (
  -- Extrair ano, mês e dia da data atual
  EXTRACT(YEAR FROM date) || '-' ||
  LPAD(EXTRACT(MONTH FROM date)::text, 2, '0') || '-' ||
  LPAD(EXTRACT(DAY FROM date)::text, 2, '0') || 'T12:00:00.000Z'
)::timestamp with time zone
WHERE date IS NOT NULL;

-- Verificar o resultado após a correção
SELECT 
  id,
  date,
  amount,
  person,
  type,
  created_at
FROM public.expenses 
ORDER BY date DESC 
LIMIT 10;

-- Opcional: Se quiser ver todas as datas únicas para verificar
SELECT DISTINCT 
  DATE(date) as data_sem_time,
  COUNT(*) as total_registros
FROM public.expenses 
GROUP BY DATE(date)
ORDER BY data_sem_time DESC;
