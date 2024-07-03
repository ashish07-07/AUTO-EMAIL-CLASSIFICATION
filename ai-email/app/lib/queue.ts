import { Queue, Worker } from "bullmq";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { createEmail } from "@/lib/utils";
import { createEmail } from "./utils";
// Make sure to import the createEmail function
import { CATEGORIZED_EMAILS2 } from "@/app/type";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "",
};

const emailQueue = new Queue("emailQueue", { connection });

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { email, accessToken } = job.data;

    if (!email.from || !email.subject || !email.body.text) {
      throw new Error("Email is missing required fields");
    }

    const oAuth2client = new google.auth.OAuth2();
    oAuth2client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oAuth2client });

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Write a polite and professional reply to this marketing email:
    \n\nSubject: ${email.subject}
    \n\nBody: ${email.body.text}
  `;

    const result = await model.generateContent(prompt);
    const response = result?.response;
    const replyText = await response?.text();

    if (replyText) {
      const raw = createEmail(
        email.from,
        "me",
        `Re: ${email.subject}`,
        replyText
      );

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw,
        },
      });
    }
  },
  { connection }
);

export { emailQueue, worker };
