

import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NEXT_AUTH } from "@/app/config/auth";
import { CATEGORIZED_EMAILS2 } from "@/app/type";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session || !session.user || !session.user.accessToken) {
    console.error("No session or access token found");
    return NextResponse.json(
      {
        msg: "no token ",
      },
      {
        status: 401,
      }
    );
  }

  const accessToken = session.user.accessToken;
  const oAuth2client = new google.auth.OAuth2();
  oAuth2client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oAuth2client });

  const emails: CATEGORIZED_EMAILS2 = await req.json();

 
  const marketingEmails = emails.filter(
    (e) => e.classification === "marketing"
  );

  for (const email of marketingEmails) {
    console.log(
      `Replying to email from: ${email.from} with subject: ${email.subject}`
    );

   
    const prompt = `
      Write a polite and professional reply to this marketing email:
      \n\nSubject: ${email.subject}
      \n\nBody: ${email.body.text}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = result?.response;
      const replyText = await response?.text();

      if (replyText) {
        // Send the reply using Gmail API
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

        console.log(`Replied to email from: ${email.from}`);
      }
    } catch (error) {
      console.error("Error generating or sending reply:", error);
      return NextResponse.json(
        {
          error: "error generating",
        },
        {
          status: 401,
        }
      );
    }
  }

  return NextResponse.json(
    {
      msg: "replied to all the emails regarding marketting",
    },
    {
      status: 200,
    }
  );
}


function createEmail(
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
