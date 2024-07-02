import { GoogleGenerativeAI } from "@google/generative-ai";
import { CATEGORIZED_EMAILS, EMAIL } from "@/app/type";
import { CATEGORIZED_EMAILS2 } from "@/app/type";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function classifyEmails(
  emails: EMAIL[]
): Promise<CATEGORIZED_EMAILS2> {
  const categorizedEmails: CATEGORIZED_EMAILS2 = [];

  await Promise.all(
    emails.map(async (email: EMAIL) => {
      if (!email.subject || !email.body) {
        console.error("Email is missing subject or body:", email);
        return;
      }

      const bodyText = email.body?.text || "No body text";
      const bodyHtml = email.body?.html || "No body html";

      const prompt = `
        Judging from the subject line and the body of this email, classify this email:
        \n\nSubject: ${email.subject}
        \n\nBody: ${bodyText}
        \n\nGive answer labeled as:
        \n\n - "important: Emails that are personal or work-related and require immediate attention."
        \n\n - "promotion: Emails related to sales, discounts, and marketing campaigns."
        \n\n - "social: Emails from social networks, friends, and family."
        \n\n - "marketing: Emails related to marketing, newsletters, and notifications."
        \n\n - "spam: Unwanted or unsolicited emails."
        \n\n - "general: If none of the above are matched, use General."
        \n\nGive one word (important, promotion, social, marketing, spam, or general) answer from these options only and ignore the dash lines in the body.
      `;

      try {
        const result = await model.generateContent(prompt);
        const response = result?.response;
        const text = await response?.text();
        const decision = text?.trim() || "general";

        categorizedEmails.push({
          id: email.id,
          subject: email.subject,
          from: email.from,
          classification: decision,
          body: email.body,
        });
      } catch (error) {
        console.error("Error classifying email:", error);
        categorizedEmails.push({
          id: email.id || "No ID",
          subject: email.subject || "No subject",
          from: email.from || "No sender",
          classification: "general",
          body: email.body || { text: "No body text", html: "" },
        });
      }
    })
  );

  return categorizedEmails;
}
