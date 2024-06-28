import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/config/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

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

    const emailDetails= await Promise.all(
      messages.map(async (message)=>
      {
              if (message.id)
                {
                      try 
                      {
                            const msg=await gmail.users.messages.get({

                              userId:"me",
                              id:message.id

                            });

                            const headers= msg.data.payload?.headers;
                            const subjectheader= headers?.find(header=>header.name==='Subject');
                            const fromHeader=headers?.find(header=>header.name==='From');
                            const subject=subjectheader?subjectheader.value:'No Subject';
                            let from = 'Unknown Sender';

                            if (fromHeader)
                              {
                                  const match = fromHeader.value?.match(/<(.+?)>1)
                              }


                      }
                }
      })

    )

      return NextResponse.json(
        {
          messages,
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
