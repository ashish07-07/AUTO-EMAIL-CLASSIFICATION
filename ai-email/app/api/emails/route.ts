import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/config/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import {
  formatEmail,
  getBody,
  separateHTMLandText,
  stripHTMLAndCSS,
} from "./emailFormaters";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);
  if (session && session.user && session.user.accessToken) {
    const accessToken = session.user.accessToken;
    console.log(session);

    const oAuth2client = new google.auth.OAuth2();
    oAuth2client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oAuth2client });

    try {
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "",
        maxResults: 25,
      });

      const messages = response.data.messages || [];

      const emailDetails = await Promise.all(
        messages.map(async (message) => {
          if (message.id) {
            try {
              const msg = await gmail.users.messages.get({
                userId: "me",
                id: message.id,
              });

              const headers = msg.data.payload?.headers;
              const subjectheader = headers?.find(
                (header) => header.name === "Subject"
              );
              const fromHeader = headers?.find(
                (header) => header.name === "From"
              );
              const subject = subjectheader
                ? subjectheader.value
                : "No Subject";
              let from = "Unknown Sender";

              if (fromHeader?.value) {
                const match = fromHeader.value.match(/<(.+?)>/);
                if (match) {
                  from = match[1];
                }
              }

              const body = getBody(msg.data.payload);
              const { text, html } = separateHTMLandText(body);
              const formatedText = formatEmail(text);
              const sanitizedText = stripHTMLAndCSS(formatedText);

              return {
                id: message.id,
                subject,
                from,
                body: { text: sanitizedText, html },
              };
            } catch (e) {
              console.error("error fetching the email");

              return NextResponse.json({
                msg: "error fetching the message",
              });
            }
          }
        })
      );

      return NextResponse.json(
        {
          emailDetails,
        },
        {
          status: 200,
        }
      );
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        {
          error: "Failed to fetch messages",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      {
        error: "No session",
      },
      {
        status: 401,
      }
    );
  }
}
