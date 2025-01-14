//@ts-nocheck
import "@radix-ui/themes/styles.css";
import "../styles/globals.css";

import { ThemeProvider } from "next-themes";

import {
  DocumentCheckIcon,
  FolderIcon,
  HomeIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { Theme } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";

import { SessionProvider, useUser } from "../store/session";

import React from "react";

import AdminLayout from "../layouts/adminLayout";
import NewLayout from "../layouts/newLayout";
import NoteBookLayout from "../layouts/notebook";
import PortalLayout from "../layouts/portalLayout";
import Settings from "../layouts/settings";
import GlobalShortcut from "@/shadcn/block/GlobalShortcut";

const queryClient = new QueryClient();

function Auth({ children }: any) {
  const { loading, user } = useUser();

  React.useEffect(() => {
    if (loading) return; // Do nothing while loading
  }, [user, loading]);

  if (user) {
    return children;
  }

  return (
    <div className="flex h-screen justify-center items-center text-green-600"></div>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const router = useRouter();

  const actions = [
    {
      title: "Home",
      description: "Get to home page",
      onTrigger: () => router.push("/"),
      icon: <HomeIcon className="h-8 w-8 text-gray-900" />,
    },
    {
      title: "Notebook",
      description: "Personal User Notes",
      onTrigger: () => router.push("/notebook"),
      icon: <FolderIcon className="h-8 w-8 text-gray-900" />,
    },
    {
      title: "Tickets",
      description:
        "Central store for all company & user tickets, open or closed",
      onTrigger: () => router.push("/tickets"),
      icon: <TicketIcon className="h-8 w-8 text-gray-900" />,
    },
    {
      title: "Documentation",
      description: "Documentation for HelpDesk",
      onTrigger: () => router.push("https://google.com/"),
      icon: <DocumentCheckIcon className="h-8 w-8 text-gray-900" />,
    },
    {
      title: "Github",
      description: "OSS codebase for HelpDesk",
      onTrigger: () =>
        router.push("https://github.com/ChampZ17"),
      icon: (
        <img className="h-7 ml-1 w-auto" src="/github.svg" alt="Workflow" />
      ),
    },
    {
      title: "HelpDesk",
      description: "",
      onTrigger: () => router.push("https://google.com/"),
      icon: <img className="h-7 ml-1 w-auto" src="/logo.svg" alt="Workflow" />,
    },
  ];

  if (router.asPath.slice(0, 5) === "/auth") {
    return (
      <MantineProvider>
        <Notifications position="top-right" />
        <Component {...pageProps} />
      </MantineProvider>
    );
  }

  if (router.pathname.includes("/admin")) {
    return (
      <SessionProvider>
        <MantineProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Theme>
              <QueryClientProvider client={queryClient}>
                <Auth>
                  <AdminLayout>
                    <Notifications position="top-right" />
                    <Component {...pageProps} />
                  </AdminLayout>
                </Auth>
              </QueryClientProvider>
            </Theme>
          </ThemeProvider>
        </MantineProvider>
      </SessionProvider>
    );
  }

  if (router.pathname.includes("/notebook")) {
    return (
      <SessionProvider>
        <MantineProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Theme>
              <QueryClientProvider client={queryClient}>
                <Auth>
                  <NewLayout>
                    <NoteBookLayout>
                      <Notifications position="top-right" />
                      <Component {...pageProps} />
                    </NoteBookLayout>
                  </NewLayout>
                </Auth>
              </QueryClientProvider>
            </Theme>
          </ThemeProvider>
        </MantineProvider>
      </SessionProvider>
    );
  }

  if (router.pathname.includes("/settings")) {
    return (
      <SessionProvider>
        <MantineProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Theme>
              <QueryClientProvider client={queryClient}>
                <Auth>
                  <NewLayout>
                    <Settings>
                      <Notifications position="top-right" />
                      <Component {...pageProps} />
                    </Settings>
                  </NewLayout>
                </Auth>
              </QueryClientProvider>
            </Theme>
          </ThemeProvider>
        </MantineProvider>
      </SessionProvider>
    );
  }

  if (router.pathname.startsWith("/portal")) {
    return (
      <SessionProvider>
        <MantineProvider defaultColorScheme="light">
          <Theme>
            <QueryClientProvider client={queryClient}>
              <Auth>
                <PortalLayout>
                  <Notifications position="top-right" />
                  <Component {...pageProps} />
                </PortalLayout>
              </Auth>
            </QueryClientProvider>
          </Theme>
        </MantineProvider>
      </SessionProvider>
    );
  }

  if (router.pathname === "/onboarding") {
    return (
      <SessionProvider>
        <MantineProvider defaultColorScheme="light">
          <Notifications position="top-right" />
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    );
  }

  if (router.pathname === "/submit") {
    return (
      <MantineProvider defaultColorScheme="light">
        <Notifications position="top-right" />
        <Component {...pageProps} />
      </MantineProvider>
    );
  }

  return (
    <SessionProvider>
      <MantineProvider defaultColorScheme="light">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Theme>
            <QueryClientProvider client={queryClient}>
              <Auth>
                <NewLayout>
                  <GlobalShortcut />
                  <Notifications position="top-right" />
                  <Component {...pageProps} />
                </NewLayout>
              </Auth>
            </QueryClientProvider>
          </Theme>
        </ThemeProvider>
      </MantineProvider>
    </SessionProvider>
  );
}

export default MyApp;
