"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { CATEGORIZED_EMAILS2, EMAIL } from "../type";
import { classifyEmails } from "@/utils/gpt-classifier";

export default function EmailResponder() {
  const [emails, setEmails] = useState<CATEGORIZED_EMAILS2>([]);

  useEffect(() => {
    async function fetchAndClassifyEmails() {
      try {
        const response = await axios.get("/api/emails");
        const data: EMAIL[] = response.data.emailDetails;

        const classifiedEmails: CATEGORIZED_EMAILS2 = await classifyEmails(
          data
        );

        setEmails(classifiedEmails);
      } catch (error) {
        console.error("Error fetching and classifying emails:", error);
      }
    }

    fetchAndClassifyEmails();
  }, []);

  return (
    <div>
      This page is for replying to the emails
      <button
        onClick={async function () {
          try {
            if (emails.length > 0) {
              await axios.post("/api/replyemails", emails);
              console.log("Replied to all marketing emails.");
            } else {
              console.log("No emails to reply to.");
            }
          } catch (error) {
            console.error("Error replying to emails:", error);
          }
        }}
      >
        Reply to all the marketing emails
      </button>
    </div>
  );
}
