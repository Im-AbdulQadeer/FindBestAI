// Cloudflare Pages Function: /functions/subscribe.js
// Route: POST /subscribe
// Securely calls MailerLite API — API key stays server-side, never exposed to browser.

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Parse body
  let email;
  try {
    const body = await request.json();
    email = (body.email || '').trim().toLowerCase();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers: corsHeaders });
  }

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400, headers: corsHeaders });
  }

  // API key & Group ID from Cloudflare environment variables (never hardcoded)
  const MAILERLITE_API_KEY  = env.MAILERLITE_API_KEY;
  const MAILERLITE_GROUP_ID = env.MAILERLITE_GROUP_ID; // optional

  if (!MAILERLITE_API_KEY) {
    console.error('MAILERLITE_API_KEY environment variable not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders });
  }

  try {
    const payload = {
      email,
      resubscribe: false,
      autoresponders: true  // triggers welcome automation in MailerLite
    };

    const apiUrl = MAILERLITE_GROUP_ID
      ? `https://api.mailerlite.com/api/v2/groups/${MAILERLITE_GROUP_ID}/subscribers`
      : 'https://api.mailerlite.com/api/v2/subscribers';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
    }

    // Handle already subscribed gracefully
    const errMsg = (data.error?.message || data.message || '').toLowerCase();
    if (errMsg.includes('already') || response.status === 409) {
      return new Response(JSON.stringify({ success: true, already: true }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: data.error?.message || 'Subscription failed' }), { status: 400, headers: corsHeaders });

  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { status: 500, headers: corsHeaders });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
