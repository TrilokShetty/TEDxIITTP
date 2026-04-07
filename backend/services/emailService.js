import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the template from /home/trilokshetty/TED/tedxiittp/brevo_email_template.html
const TEMPLATE_PATH = path.join(__dirname, "../../brevo_email_template.html");
let emailTemplateHtml = "";

try {
  emailTemplateHtml = fs.readFileSync(TEMPLATE_PATH, "utf-8");
} catch (err) {
  console.warn("⚠️ Could not load brevo_email_template.html file. Emails will be empty.");
}

/**
 * Sends a confirmation email via Brevo's v3 SMTP Email API
 * @param {Object} payment - The payment object from the DB containing email, name, passLabel, etc.
 */
export const sendConfirmationEmail = async (payment) => {
  const { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = process.env;
  
  if (!BREVO_API_KEY) {
    console.log("⚠️ Skipping email sending: BREVO_API_KEY is not set in .env.");
    return;
  }

  // Use environment variables or fallback defaults
  const senderEmail = BREVO_SENDER_EMAIL || "ted@iittp.ac.in";
  const senderName = BREVO_SENDER_NAME || "TEDxIITTP";

  try {
    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: payment.email, name: payment.name }],
      subject: "Your TEDxIITTP Pass Booking Confirmation",
      htmlContent: emailTemplateHtml,
      params: {
        name: payment.name,
        pass_type: payment.passLabel || payment.passId,
        payment_id: payment.paymentId || payment.orderId,
        number_of_passes: payment.numberOfPasses,
      }
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API Status ${response.status}: ${errorText}`);
    }

    console.log(`✉️  Confirmation email triggered to ${payment.email}`);
  } catch (err) {
    console.error("❌ sendConfirmationEmail error:", err.message);
    // Rethrow to caller if necessary
    throw err;
  }
};
