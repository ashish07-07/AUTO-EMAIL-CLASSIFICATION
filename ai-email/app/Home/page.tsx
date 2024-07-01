"use client";
import { useEffect, useState } from "react";
import { EMAIL } from "../type";
import axios from "axios";
import { classifyEmails } from "../../utils/gpt-classifier";

export default function Home() {
  const [email, setemail] = useState<EMAIL[]>();
  useEffect(() => {
    async function Fetchemails() {
      const response = await axios.get("/api/emails");

      // console.log(response.data.emailDetails);

      const data = response.data.emailDetails;
      console.log(data);

      setemail(data);
    }

    Fetchemails();
  }, []);

  return (
    <div>
      Email fetching re
      {/* {JSON.stringify(email)} */}
      <button
        onClick={async function () {
          if (email) {
            const response = await classifyEmails(email);
            console.log(response);
          }
        }}
      >
        how classified emails
      </button>
    </div>
  );
}
