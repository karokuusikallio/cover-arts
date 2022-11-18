// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "../components/Header";
import Footer from "../components/Footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <div className="flex h-screen flex-col overflow-hidden">
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
