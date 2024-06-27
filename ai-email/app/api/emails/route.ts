import { google } from "googleapis";
import { NEXT_AUTH } from "@/app/config/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);

  console.log("Session Object:", session);

  if (session && session.user && session.user.accessToken) {
    const accessToken = session.user.accessToken;

    console.log("Printing the access token:");
    console.log(accessToken);

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    try {
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "",
        maxResults: 25,
      });

      const messages = response.data.messages || [];

      console.log("Messages:", messages);

      const emailDetails= await Promise.all(

        messages.map(async function (message)
      {
            return (
                         
               const msg = await gmail.users.messages.get({
                  userId:'me',
                  id:message.id
               })

            )
      })

      )

      // return NextResponse.json({
      //   response,
      // });
    } catch (e) {
      console.error("error found in the code ");
      return NextResponse.json({
        msg: "error",
      });
    }
  } else {
    return NextResponse.json(
      { error: "Access token not found" },
      { status: 400 }
    );
  }
}

// import { google } from "googleapis";
// import { NEXT_AUTH } from "@/app/config/auth";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(NEXT_AUTH);

//   console.log("Session Object:", session);

//   if (session && session.user && session.user.accessToken) {
//     const accessToken = session.user.accessToken;

//     console.log("Printing the access token:");
//     console.log(accessToken);

//     const oAuth2Client = new google.auth.OAuth2();
//     oAuth2Client.setCredentials({ access_token: accessToken });

//     const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

//     try {
//       const response = await gmail.users.messages.list({
//         userId: "me",
//         q: "",
//         maxResults: 25,
//       });

//       const messages = response.data.messages || [];

//       console.log("Messages:", messages);

//       // const emailDetails = await Promise.all(
//       //   messages.map(async  (message) => {
//       //     const msg = await gmail.users.messages.get({
//       //       userId: "me",
//       //       id: message.id,
//       //     });
//       //     return msg.data; // returning the data of the email
//       //   })
//       // );
//       const emailDetails = await Promise.all(
//         messages.map(async (message) => {
//           const msg = await gmail.users.messages.get({
//             userId: 'me',
//             id: message.id,
//           });
//       console.log("Email Details:", emailDetails);

//       return NextResponse.json({ emailDetails }, { status: 200 });
//     } catch (e) {
//       console.error("Error found in the code:", e);
//       return NextResponse.json(
//         { error: "Failed to fetch email details" },
//         { status: 500 }
//       );
//     }
//   } else {
//     return NextResponse.json(
//       { error: "Access token not found" },
//       { status: 400 }
//     );
//   }
// }
