import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/config/auth";
import { CATEGORIZED_EMAILS2 } from "@/app/type";

import { emailQueue } from "@/app/lib/queue";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(NEXT_AUTH);
  if (!session || !session.user || !session.user.accessToken) {
    console.error("No session or access token found");
    return NextResponse.json(
      {
        msg: "No token ",
      },
      {
        status: 401,
      }
    );
  }

  const accessToken = session.user.accessToken;
  const emails: CATEGORIZED_EMAILS2 = await req.json();

  const marketingEmails = emails.filter(
    (e) => e.classification === "marketing"
  );

  for (const email of marketingEmails) {
    try {
      await emailQueue.add("processEmail", {
        email,
        accessToken,
      });
      console.log(
        `Queued email from: ${email.from} with subject: ${email.subject}`
      );
    } catch (error) {
      console.error("Error queuing email:", error);
      return NextResponse.json(
        {
          error: "Error queuing email",
        },
        {
          status: 500,
        }
      );
    }
  }

  return NextResponse.json(
    {
      msg: "Queued all marketing emails for processing",
    },
    {
      status: 200,
    }
  );
}
