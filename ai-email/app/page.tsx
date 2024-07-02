// "use client";
// import { signIn } from "next-auth/react";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";

// export default function Home() {
//   const session = useSession();

//   if (!session) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <div className="bg-black-800 p-8 rounded shadow-md text-center max-w-lg">
//           <h1 className="text-2xl font-bold mb-4 text-white">
//             Email Automation Project
//           </h1>
//           <p className="mb-6 text-gray-300">
//             This project automatically classifies emails into categories such as
//             General, Marketing, Scam, Important, etc. With a single click, it
//             sends automated replies to all classified marketing emails.
//           </p>
//           <button
//             onClick={function () {
//               signIn();
//             }}
//             className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
//           >
//             Sign In
//           </button>
//         </div>
//       </div>
//     );
//   } else {
//     <div>
//       HI bro wts up
//       <button
//         className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
//         onClick={function () {
//           redirect("/Home");
//         }}
//       >
//         {" "}
//         Home button bro
//       </button>
//       ;
//     </div>;
//   }
// }

"use client";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-800 p-8 rounded shadow-md text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Email Automation Project
          </h1>
          <p className="mb-6 text-gray-300">
            This project automatically classifies emails into categories such as
            General, Marketing, Scam, Important, etc. With a single click, it
            sends automated replies to all classified marketing emails.
          </p>
          <button
            onClick={function () {
              signIn();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-800 p-8 rounded shadow-md text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">Welcome Back!</h1>
          <p className="mb-6 text-gray-300">Email classifier project ?</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
            onClick={function () {
              router.push("/Home");
            }}
          >
            Email classifting page
          </button>
        </div>
      </div>
    );
  }
}
