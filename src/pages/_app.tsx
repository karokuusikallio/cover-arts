// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";

import Header from "./components/Header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default MyApp;
