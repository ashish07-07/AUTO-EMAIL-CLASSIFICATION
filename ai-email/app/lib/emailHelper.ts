// lib/emailHelper.ts
export function createEmail(
  to: string,
  from: string,
  subject: string,
  body: string
): string {
  const str = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "",
    body,
  ].join("\n");

  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
