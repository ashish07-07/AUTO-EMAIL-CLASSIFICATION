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

        const validEmails = data.filter((email) => {
          if (!email.subject || !email.body.text) {
            console.error("Email is missing subject or body:", email);
            return false;
          }
          return true;
        });

        if (validEmails.length > 0) {
          const classifiedEmails: CATEGORIZED_EMAILS2 = await classifyEmails(
            validEmails
          );
          setEmails(classifiedEmails);
        } else {
          console.log("No valid emails to classify.");
        }
      } catch (error) {
        console.error("Error fetching and classifying emails:", error);
      }
    }

    fetchAndClassifyEmails();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Email Automation Project</h1>
        <p className="mb-6 text-gray-700">
          This project automatically classifies emails into categories such as
          General, Marketing, Scam, Important, etc. With a single click, it
          sends automated replies to all classified marketing emails.
        </p>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Reply to all the marketing emails
        </button>
      </div>
    </div>
  );
}
