// lib/worker.ts
import { Worker } from "bullmq";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/config/auth";
import { redisOptions } from "./redisOptions";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { createEmail } from "./emailHelper";
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { sessionToken, emails } = job.data;

    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user || !session.user.accessToken) {
      console.error("No session or access token found");
      throw new Error("Unauthorized");
    }

    const accessToken = session.user.accessToken;
    const oAuth2client = new google.auth.OAuth2();
    oAuth2client.setCredentials({ access_token: accessToken });
    const gmail = google.gmail({ version: "v1", auth: oAuth2client });

    const marketingEmails = emails.filter(
      (e: any) => e.classification === "marketing"
    );

    for (const email of marketingEmails) {
      const prompt = `Write a polite and professional reply to this marketing email:\n\nSubject: ${email.subject}\n\nBody: ${email.body.text}`;

      try {
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
            requestBody: { raw },
          });
          console.log(`Replied to email from: ${email.from}`);
        }
      } catch (error) {
        console.error("Error generating or sending reply:", error);
      }
    }
  },
  { connection: redisOptions }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
