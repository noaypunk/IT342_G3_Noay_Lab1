import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// These are needed to handle Cross-Origin Resource Sharing (CORS) 
// so your React app can call this function.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Setup the Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Get data from the request body (sent by your Admin UI)
    const { depositId, action } = await req.json() // action: 'APPROVE' or 'REJECT'

    // 3. Fetch the specific deposit request from the table
    const { data: deposit, error: fetchError } = await supabaseAdmin
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single()

    if (fetchError || !deposit) {
      throw new Error("Deposit record not found.")
    }

    if (deposit.status !== 'PENDING') {
      throw new Error("This deposit has already been processed.")
    }

    if (action === 'APPROVE') {
      // 4. Trigger the balance update in the users table
      // We use 'rpc' to call the SQL function we created earlier
      const { error: userError } = await supabaseAdmin.rpc('increment_balance', { 
        user_email: deposit.email, 
        amount_to_add: deposit.amount 
      })

      if (userError) throw userError

      // 5. Update the deposit status to APPROVED
      const { error: updateError } = await supabaseAdmin
        .from('deposits')
        .update({ status: 'APPROVED' })
        .eq('id', depositId)

      if (updateError) throw updateError

      return new Response(
        JSON.stringify({ message: "Deposit approved and balance updated!" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } 

    if (action === 'REJECT') {
      // Just mark it as REJECTED without touching the balance
      await supabaseAdmin.from('deposits').update({ status: 'REJECTED' }).eq('id', depositId)
      return new Response(
        JSON.stringify({ message: "Deposit request rejected." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    throw new Error("Invalid action provided.")

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})