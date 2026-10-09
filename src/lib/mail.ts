export async function sendMail(input: { subject: string; text: string; replyTo?: string }) {
  const to = process.env.MAIL_TO ?? "contact@remparia.com";
  const from = process.env.MAIL_FROM ?? "Remparia GED <noreply@remparia.com>";
  const resendApiKey = process.env.RESEND_API_KEY ?? "";

  if (resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Envoi email Resend échoué (${response.status}): ${detail}`);
    }
    return { provider: "resend" as const };
  }

  const smtpHost = process.env.SMTP_HOST ?? "";
  if (!smtpHost) {
    throw new Error(
      "Email non configuré. Définissez RESEND_API_KEY (recommandé sur Vercel) ou SMTP_HOST / SMTP_USER / SMTP_PASS.",
    );
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });

  await transporter.sendMail({
    from,
    to,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  });

  return { provider: "smtp" as const };
}
