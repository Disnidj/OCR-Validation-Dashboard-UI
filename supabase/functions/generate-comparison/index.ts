import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ComparisonRequest {
  recipientEmail: string;
  ccEmails: string[];
  bccEmails: string[];
  message: string;
  successQuotations: Array<{ portalName: string; fileName: string; fileUrl: string }>;
  failureQuotations: Array<{ portalName: string; fileData: string }>;
}

interface EmailAttachment {
  filename: string;
  content: string;
  type: string;
}

interface EmailData {
  to: string;
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

interface EnvironmentVariables {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
}

// Environment variables - replace with your actual values or use process.env in Node.js
const getEnvironmentVariables = (): EnvironmentVariables => {
  return {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  };
};

const handleRequest = async (req: Request): Promise<Response> => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const env = getEnvironmentVariables();
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
    const sendgridApiKey = env.SENDGRID_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: ComparisonRequest = await req.json();

    const { recipientEmail, ccEmails, bccEmails, message, successQuotations, failureQuotations } =
      payload;

    if (!recipientEmail) {
      return new Response(JSON.stringify({ error: "Recipient email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (successQuotations.length === 0 && failureQuotations.length === 0) {
      return new Response(JSON.stringify({ error: "At least one quotation is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const comparisonSummary = generateComparisonSummary(
      successQuotations,
      failureQuotations
    );

    const emailContent = generateEmailContent(message, comparisonSummary);

    if (sendgridApiKey) {
      // For success quotations, we need to fetch the file from URL
      const successAttachments = await Promise.all(
        successQuotations.map(async (q) => {
          const fileResponse = await fetch(q.fileUrl);
          const fileBuffer = await fileResponse.arrayBuffer();
          const uint8Array = new Uint8Array(fileBuffer);
          const base64Content = arrayBufferToBase64(uint8Array);
          return {
            filename: q.fileName,
            content: base64Content,
            type: "application/pdf",
          };
        })
      );

      // Failure quotations already have base64 data
      const failureAttachments = failureQuotations.map((q) => ({
        filename: `${q.portalName}.pdf`,
        content: q.fileData,
        type: "application/pdf",
      }));

      await sendEmail({
        to: recipientEmail,
        cc: ccEmails,
        bcc: bccEmails,
        subject: "Quotation Comparison Report",
        html: emailContent,
        attachments: [...successAttachments, ...failureAttachments],
      }, sendgridApiKey);
    } else {
      console.log("Sending email to:", recipientEmail);
      console.log("Email content:", emailContent);
    }

    const { error: insertError } = await supabase
      .from("comparison_requests")
      .insert([
        {
          recipient_email: recipientEmail,
          cc_emails: ccEmails,
          bcc_emails: bccEmails,
          message: message,
          quotation_ids: [],
          status: sendgridApiKey ? "completed" : "pending",
          sent_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Comparison generated and email sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

// Export the handler for use in serverless environments
export default handleRequest;

// For Deno Deploy / Supabase Edge Functions
// @ts-ignore - Deno global not available in TypeScript
if (typeof Deno !== "undefined") {
  // @ts-ignore
  Deno.serve(handleRequest);
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(uint8Array: Uint8Array): string {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCodePoint(uint8Array[i]);
  }
  // Use btoa for browser/Deno compatibility
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  // Fallback for Node.js
  return Buffer.from(uint8Array).toString('base64');
}

function generateComparisonSummary(
  successQuotations: Array<{ portalName: string; fileName: string; fileUrl: string }>,
  failureQuotations: Array<{ portalName: string; fileData: string }>
): string {
  let summary = "";

  if (successQuotations.length > 0) {
    summary += "<h3>Success Scenarios:</h3><ul>";
    successQuotations.forEach((q) => {
      summary += `<li>${q.portalName}</li>`;
    });
    summary += "</ul>";
  }

  if (failureQuotations.length > 0) {
    summary += "<h3>Failed Scenarios:</h3><ul>";
    failureQuotations.forEach((q) => {
      summary += `<li>${q.portalName}</li>`;
    });
    summary += "</ul>";
  }

  return summary;
}

function generateEmailContent(message: string, comparisonSummary: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .message { margin: 20px 0; padding: 15px; background-color: #dbeafe; border-left: 4px solid #2563eb; }
          h3 { color: #1f2937; margin-top: 15px; }
          ul { list-style-type: none; padding-left: 0; }
          li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          li:before { content: "✓ "; color: #10b981; font-weight: bold; margin-right: 8px; }
          .footer { font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quotation Comparison Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            ${comparisonSummary}
          </div>
          
          ${message ? `<div class="message"><strong>Additional Message:</strong><p>${message}</p></div>` : ""}
          
          <p>Please find the detailed quotation documents attached to this email.</p>
          
          <div class="footer">
            <p>This is an automated message from the OCR Validation Dashboard.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function sendEmail(
  emailData: EmailData,
  apiKey: string
): Promise<void> {
  const personalizations = [
    {
      to: [{ email: emailData.to }],
      cc: emailData.cc.map((email) => ({ email })),
      bcc: emailData.bcc.map((email) => ({ email })),
    },
  ];

  const sendgridPayload = {
    personalizations,
    from: { email: "noreply@ocr-dashboard.com" },
    subject: emailData.subject,
    content: [{ type: "text/html", value: emailData.html }],
    attachments: (emailData.attachments || []).map((att) => ({
      filename: att.filename,
      content: att.content,
      type: att.type,
    })),
  };

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(sendgridPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
}
