// src/pages/_app.tsx
import { SessionProvider, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { slide as Menu } from "react-burger-menu";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import Head from "next/head";

import { Montserrat } from "@next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

import Header from "../components/Header";
import Footer from "../components/Footer";
import getSessionInfo from "../components/helpers/getSessionInfo";

import "../styles/globals.css";
import { burgerMenuStyles } from "../components/styles/burgerMenuStyles";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [userName, setUsername] = useState<string>("");
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    setOpen(true);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getUsername = async () => {
      const session = await getSessionInfo();

      if (session && session.user) {
        setUsername(session.user.id);
      }
    };

    getUsername();
  }, []);

  const queryClient = new QueryClient();
  return (
    <>
      <Head>
        <title>SpotArt App</title>
      </Head>
      <Menu
        styles={burgerMenuStyles}
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={closeSideBar}
        burgerButtonClassName={"sm:right-20 right-5"}
      >
        <Link
          href="/"
          className="px-5 font-semibold text-spotartPurple hover:text-spotartLightPurple"
          onClick={closeSideBar}
        >
          Dashboard
        </Link>
        <Link
          href="/search"
          className="px-5 font-semibold text-spotartPurple hover:text-spotartLightPurple"
          onClick={closeSideBar}
        >
          Search Album Art
        </Link>
        <Link
          href="/discover"
          className="px-5 font-semibold text-spotartPurple hover:text-spotartLightPurple"
          onClick={closeSideBar}
        >
          Discover Albums
        </Link>
        <p className="mt-60 px-5 text-black">Logged in as: {userName}</p>
        <button
          className="text-bold inline-block rounded-lg bg-spotartPurple !p-2 uppercase text-white hover:bg-spotartLightPurple"
          type="submit"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </button>
      </Menu>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <div
            className={`flex h-screen flex-col overflow-hidden ${montserrat.className}`}
          >
            <Header />
            <Component {...pageProps} />
            <Footer />
          </div>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
