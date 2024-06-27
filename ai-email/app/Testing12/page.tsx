import { getServerSession } from "next-auth";
import { Session } from "inspector";
import { NEXT_AUTH } from "../config/auth";
export default async function () {
  const session = await getServerSession(NEXT_AUTH);

  console.log(session);

  console.log(session?.user.accessToken);

  return <div>y are we not able to get the session</div>;
}
