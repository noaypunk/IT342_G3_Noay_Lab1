import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { depositId, action } = await req.json()

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
      const { error: userError } = await supabaseAdmin.rpc('increment_balance', { 
        user_email: deposit.email, 
        amount_to_add: deposit.amount 
      })

      if (userError) throw userError

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