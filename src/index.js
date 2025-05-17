import { Resend } from 'resend';

// --- Configuration ---
const allowedOrigins = ['https://yawarosman.com'];
const brandColor = 'linear-gradient(to right, #3B82F6, #8B5CF6)'; // Blue-500 to Purple-500 gradient
const siteName = 'Yawar Osman'; // Your site/app name
// --- End Configuration ---


function handleCors(request, headers) {
  const origin = request.headers.get('Origin');
  // Allow all origins if '*' is present, otherwise check against the specific list
  if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
    headers.set('Access-Control-Allow-Origin', origin || '*'); // Reflect origin or use '*'
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    // Optional: Allow credentials if needed in the future
    // headers.set('Access-Control-Allow-Credentials', 'true');
  }
}


// --- Email HTML Templates ---

function getOwnerNotificationHtml(name, email, subject, message) {
  // Basic inline styles for better email client compatibility
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        .gradient-text {
          background: ${brandColor};
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        .gradient-border {
          border-left: 3px solid #3B82F6;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <!-- Content -->
              <tr>
                <td style="padding: 30px 40px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <h1 class="gradient-text" style="font-size: 24px; margin-top: 0; margin-bottom: 20px;">New Contact Form Submission</h1>
                  <p style="margin-bottom: 15px;">You've received a new message via the contact form:</p>
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                  <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
                  <p style="margin-bottom: 10px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3B82F6; text-decoration: none;">${email}</a></p>
                  <p style="margin-bottom: 10px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin-bottom: 5px;"><strong>Message:</strong></p>
                  <p class="gradient-border" style="margin-top: 0; margin-bottom: 20px; padding: 15px; border-radius: 4px;">
                    ${message.replace(/\n/g, '<br>')}
                  </p>
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #f0f0f5; font-size: 12px; color: #888888;">
                  This email was generated automatically from the ${siteName} contact form.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function getSenderConfirmationHtml(name, email, subject, message) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We've Received Your Message - ${siteName}</title>
      <style>
        .gradient-text {
          background: ${brandColor};
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        .gradient-border {
          border-left: 3px solid #3B82F6;
          background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <!-- Content -->
              <tr>
                <td style="padding: 30px 40px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <h1 class="gradient-text" style="font-size: 24px; margin-top: 0; margin-bottom: 20px;">Thanks for contacting me, ${name}!</h1>
                  <p style="margin-bottom: 15px;">I've successfully received your message and appreciate you reaching out.</p>
                  <p style="margin-bottom: 25px;">I will review your submission and get back to you as soon as possible if a response is needed.</p>

                  <h2 style="color: #444444; font-size: 18px; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eeeeee; padding-bottom: 5px;">Your Submission Summary:</h2>
                  <p style="margin-bottom: 10px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin-bottom: 5px;"><strong>Your Message:</strong></p>
                  <p class="gradient-border" style="margin-top: 0; margin-bottom: 25px; padding: 15px; border-radius: 4px;">
                    ${message.replace(/\n/g, '<br>')}
                  </p>

                  <p style="margin-bottom: 10px;">Best regards,</p>
                  <p class="gradient-text" style="margin-top: 0; font-weight: bold;">${siteName}</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 20px 40px; background-color: #f0f0f5; font-size: 12px; color: #888888;">
                  You received this email because you submitted the contact form on ${siteName}.
                  <br>
                  <!-- Optional: Add link back to your site -->
                  <!-- <a href="https://yawarosman.com" style="color: #666666; text-decoration: underline;">Visit YawarOsman.com</a> -->
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// --- Cloudflare Worker Fetch Handler ---

export default {
  async fetch(request, env, ctx) {
    // env contains your secrets (RESEND_API_KEY, OWNER_EMAIL)

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');
    // Apply CORS headers BEFORE any early returns
    handleCors(request, responseHeaders);

    // Handle CORS preflight requests FIRST
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: responseHeaders });
    }

    // Only allow POST requests after handling OPTIONS
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method Not Allowed' }), {
        status: 405,
        headers: responseHeaders, // Include CORS headers in error response
      });
    }

    try {
      // Initialize Resend *after* validating method and handling OPTIONS
      const resend = new Resend(env.RESEND_API_KEY);
      const ownerEmail = env.OWNER_EMAIL || 'yawarosmankhdir@gmail.com'; // Use secret or fallback
      const senderDomain = 'messages.yawarosman.com'; // Your verified Resend sending domain

      // 1. Parse the request body
      let body;
      try {
           body = await request.json();
      } catch (e) {
            console.error("Failed to parse JSON body:", e);
            return new Response(JSON.stringify({ success: false, message: 'Invalid request body. Please send JSON.' }), {
               status: 400, // Bad Request
               headers: responseHeaders,
            });
      }

      const { name, email, subject, message } = body;

      // 2. Basic Validation
      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ success: false, message: 'Missing required fields (name, email, subject, message).' }), {
          status: 400,
          headers: responseHeaders,
        });
      }
      // Optional: Add email format validation here if desired

      // 3. Prepare and Send Email to You (the Owner)
      const ownerHtmlContent = getOwnerNotificationHtml(name, email, subject, message);
      const sendToOwner = resend.emails.send({
        from: `${siteName} Contact Form <noreply@${senderDomain}>`, // Descriptive From name
        to: [ownerEmail],
        subject: `[${siteName}] New Contact Form: ${subject}`, // Clearer subject
        html: ownerHtmlContent,
      });

      // 4. Prepare and Send Confirmation Email to the Sender
      const senderHtmlContent = getSenderConfirmationHtml(name, email, subject, message);
      const sendToSender = resend.emails.send({
        from: `${siteName} <noreply@${senderDomain}>`, // Consistent From name
        to: [email], // Send to the email provided in the form
        subject: `I've Received Your Message - ${siteName}`, // Clear confirmation subject
        html: senderHtmlContent,
      });

      // 5. Wait for both emails using Promise.allSettled
      const [ownerResult, senderResult] = await Promise.allSettled([sendToOwner, sendToSender]);

      let errors = [];
      if (ownerResult.status === 'rejected') {
        console.error("Error sending owner email:", ownerResult.reason);
        errors.push("Failed to send notification email.");
        // Optionally extract more specific error from ownerResult.reason if needed
      }
      if (senderResult.status === 'rejected') {
        console.error("Error sending confirmation email:", senderResult.reason);
        // Don't usually report this failure to the user, just log it.
        // errors.push("Failed to send confirmation email.");
      }

      // 6. Determine Overall Success & Return Response
      // Consider the submission successful for the user if the owner email was sent (or attempted without fatal error)
      if (ownerResult.status === 'rejected') {
         // If owner email failed, it's a server-side failure
         return new Response(JSON.stringify({ success: false, message: 'Server error: Could not process submission.' }), {
             status: 500,
             headers: responseHeaders,
          });
      }

      // If owner email succeeded (or wasn't rejected), return success to user, even if confirmation failed.
      return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), {
        status: 200,
        headers: responseHeaders,
      });

    } catch (error) {
      // Catch unexpected errors during processing (e.g., Resend init, etc.)
      console.error('General error processing request:', error);
      return new Response(JSON.stringify({ success: false, message: 'An unexpected error occurred.' }), {
        status: 500, // Internal Server Error
        headers: responseHeaders,
      });
    }
  },
};