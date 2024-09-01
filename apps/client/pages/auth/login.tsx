import { notifications } from "@mantine/notifications";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login({}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [auth, setAuth] = useState("oauth");

  async function postData() {
    if (auth === "oauth") {
      await fetch(`/api/v1/auth/sso/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.success && res.oauth) {
            router.push(res.ouath_url);
          } else {
            if (!res.success) {
              notifications.show({
                title: "Error",
                message:
                  "There was an error logging in, please try again. If this issue persists, please contact support via the discord.",
                color: "red",
                autoClose: 5000,
              });
            } else {
              setAuth("password");
            }
          }
        });
    } else {
      await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.user) {
            setCookie("session", res.token);
            if (res.user.external_user) {
              router.push("/portal");
            } else {
              if (res.user.firstLogin) {
                router.push("/onboarding");
              } else {
                router.push("/");
              }
            }
          } else {
            notifications.show({
              title: "Error",
              message:
                "There was an error logging in, please try again. If this issue persists, please contact support via the discord.",
              color: "red",
              autoClose: 5000,
            });
          }
        });
    }
  }

  useEffect(() => {
    if (router.query.error) {
      notifications.show({
        title: "Account Error - No Account Found",
        color: "red",
        message:
          "It looks like you have tried to use SSO with an account that does not exist. Please try again or contact your admin to get you set up first.",
        autoClose: false,
      });
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {status === "loading" ? (
          <div className="text-center mr-4">{/* <Loader size={32} /> */}</div>
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        postData()
                      }
                    }}
                  />
                </div>
              </div>

              {auth !== "oauth" && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      onKeyPress={event => {
                        if (event.key === 'Enter') {
                          postData()
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={postData}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center flex flex-col space-y-2">
        </div>
      </div>
    </div>
  );
}
