

"use client";
import { useEffect, useState } from "react";
import { EMAIL, CATEGORIZED_EMAILS2 } from "../type";
import axios from "axios";
import { classifyEmails } from "../../utils/gpt-classifier";

export default function Home() {
  const [emails, setEmails] = useState<EMAIL[]>();
  const [classifiedEmails, setClassifiedEmails] =
    useState<CATEGORIZED_EMAILS2>();

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get("/api/emails");
        const data = response.data.emailDetails;
        setEmails(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    }

    fetchEmails();
  }, []);

  const handleClassifyEmails = async () => {
    if (emails) {
      try {
        const response = await classifyEmails(emails);
        setClassifiedEmails(response);
      } catch (error) {
        console.error("Error classifying emails:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Email Fetching and Classification
        </h1>
        <button
          onClick={handleClassifyEmails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Classify Emails
        </button>
        {classifiedEmails && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Classified Emails</h2>
            {classifiedEmails.map((email, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded mb-2 shadow-sm"
              >
                <h3 className="text-lg font-bold text-black">
                  {email.subject}
                </h3>
                <p className="text-lg font-bold text-black">
                  <strong>From:</strong> {email.from}
                </p>
                <p className="text-lg font-bold text-black">
                  <strong>Classification:</strong> {email.classification}
                </p>
                <div className="mt-2">
                  <p className="text-gray-600">{email.body.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
