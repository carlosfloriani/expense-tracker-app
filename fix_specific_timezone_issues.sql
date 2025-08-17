-- Script específico para corrigir problemas de timezone no Supabase
-- Execute este script diretamente no SQL Editor do Supabase

-- 1. Primeiro, vamos identificar registros que podem ter problemas
-- (datas que estão um dia atrás do esperado)
SELECT 
  id,
  date,
  DATE(date) as data_extraida,
  amount,
  person,
  type
FROM public.expenses 
WHERE EXTRACT(HOUR FROM date) < 12  -- Datas que estão no início do dia (possível problema de timezone)
ORDER BY date DESC;

-- 2. Corrigir datas que estão com problemas de timezone
-- Se uma data está sendo interpretada como UTC quando deveria ser local,
-- vamos ajustar para o meio do dia local

UPDATE public.expenses 
SET date = date + INTERVAL '12 hours'
WHERE EXTRACT(HOUR FROM date) < 6;  -- Apenas datas muito cedo (problema de timezone)

-- 3. Garantir que todas as datas estejam no meio do dia (12:00)
UPDATE public.expenses 
SET date = (
  DATE(date) || 'T12:00:00.000Z'
)::timestamp with time zone;

-- 4. Verificar o resultado final
SELECT 
  id,
  date,
  DATE(date) as data_extraida,
  amount,
  person,
  type
FROM public.expenses 
ORDER BY date DESC 
LIMIT 10;

-- 5. Estatísticas por data para verificar se está correto
SELECT 
  DATE(date) as data,
  COUNT(*) as total_registros,
  STRING_AGG(person || ' (' || type || ')', ', ') as detalhes
FROM public.expenses 
GROUP BY DATE(date)
ORDER BY data DESC;
