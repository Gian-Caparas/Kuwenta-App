const PHILSMS_API_URL = "https://dashboard.philsms.com/api/v3/sms/send"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Native Deno runtime handling (No imports required)
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiToken = Deno.env.get("PHILSMS_API_TOKEN")
    const senderId = Deno.env.get("PHILSMS_SENDER_ID") || "PhilSMS"

    if (!apiToken) {
      throw new Error("Missing PHILSMS_API_TOKEN environment variable")
    }

    const { recipient, message } = await req.json()

    if (!recipient || !message) {
      return new Response(
        JSON.stringify({ error: "Missing recipient or message fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const phone = String(recipient).replace(/[\s-]/g, "")
    const normalizedRecipient = phone.startsWith("09")
      ? `63${phone.substring(1)}`
      : phone.startsWith("+639")
        ? phone.substring(1)
        : phone

    if (!/^639\d{9}$/.test(normalizedRecipient)) {
      return new Response(
        JSON.stringify({ error: "Recipient must be a valid Philippine mobile number." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const philsmsResponse = await fetch(PHILSMS_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        recipient: normalizedRecipient,
        sender_id: senderId,
        type: "plain",
        message: message
      })
    })

    const responseText = await philsmsResponse.text()
    let result

    try {
      result = JSON.parse(responseText)
    } catch {
      result = { message: responseText || "PhilSMS returned an empty response." }
    }

    if (!philsmsResponse.ok) {
      return new Response(
        JSON.stringify({
          error: result.message || result.error || "PhilSMS request failed.",
          upstream_status: philsmsResponse.status,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (result.status && result.status !== "success") {
      return new Response(
        JSON.stringify({
          error: result.message || "PhilSMS did not accept the SMS.",
          upstream_status: philsmsResponse.status,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify(result),
      { status: philsmsResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
