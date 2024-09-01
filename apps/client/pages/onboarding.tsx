import { useRouter } from "next/router";

import { getCookie } from "cookies-next";
import Link from "next/link";
import { useUser } from "../store/session";

// if admin -> set up a new user -> set up a new client -> set up a webhook -> set up an Email Queue
// if user -> new password -> check user info like name etc

export default function Home() {
  const router = useRouter();

  const { user } = useUser();
  const token = getCookie("session");

  return (
    <div className="bg-gray-200">
      <div className="flex justify-center align-center h-screen items-center">
        <div className="bg-white shadow-xl rounded-lg lg:p-8 p-4 mx-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">HelpDesk </h1>
              <p className="text-gray-600">
                Welcome to HelpDesk!
              </p>
            </div>
          </div>
          <div className="float-right mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 mr-6 text-sm font-semibold rounded-lg"
              onClick={() => router.push("/")}
            >
              Go To Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
