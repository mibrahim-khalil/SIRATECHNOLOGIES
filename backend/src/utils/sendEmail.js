/**
 * Placeholder email utility.
 * For now, it just logs to terminal.
 * Later, integrate Nodemailer / SendGrid / Resend here.
 */
async function sendEmail({ to, subject, text, html }) {
  console.log("\n📧 --------- EMAIL (Terminal Mode) ---------");
  console.log("To:      ", to);
  console.log("Subject: ", subject);
  if (text) console.log("Text:    ", text);
  if (html) console.log("HTML:    ", html);
  console.log("-------------------------------------------\n");

  return { success: true, mode: "terminal" };
}

module.exports = sendEmail;