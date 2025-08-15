import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 60 * 60 * 1000; // 1 hour

// Get client IP
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

// Check rate limit
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record) {
    rateLimitStore.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }
  
  // Reset window if enough time has passed
  if (now - record.lastAttempt > WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }
  
  // Check if locked out
  if (record.count >= MAX_ATTEMPTS) {
    const timeSinceLockout = now - record.lastAttempt;
    if (timeSinceLockout < LOCKOUT_MS) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil((LOCKOUT_MS - timeSinceLockout) / 1000) 
      };
    } else {
      // Reset after lockout period
      rateLimitStore.set(ip, { count: 1, lastAttempt: now });
      return { allowed: true };
    }
  }
  
  // Increment attempt count
  record.count++;
  record.lastAttempt = now;
  return { allowed: true };
}

// Constant-time string comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);
  const startTime = Date.now();

  try {
    console.log(`Password verification request from IP: ${clientIP}`);
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Too many attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          } 
        }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== 'string') {
      console.log(`Invalid password format from IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Password is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the stored password from app_config (using service key to bypass RLS)
    const { data, error } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_password')
      .maybeSingle();

    if (error) {
      console.error(`Error fetching password for IP ${clientIP}:`, error);
      return new Response(
        JSON.stringify({ success: false, error: 'Configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!data) {
      console.error(`No password configuration found for IP ${clientIP}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Configuration not found' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add artificial delay to prevent timing attacks (minimum 100ms)
    const minDelay = 100;
    const elapsed = Date.now() - startTime;
    if (elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }
    
    const isValid = constantTimeCompare(password, data.value || '');
    
    console.log(`Password verification for IP ${clientIP}: ${isValid ? 'success' : 'failed'}`);

    return new Response(
      JSON.stringify({ success: isValid }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(`Password verification error for IP ${clientIP}:`, error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});