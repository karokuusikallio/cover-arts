import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import HeroSection from "../components/HeroSection";

import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";

import getSessionInfo from "../components/helpers/getSessionInfo";

const Home: NextPage = () => {
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const login = url.searchParams.get("login");

    const checkUser = async () => {
      const session = await getSessionInfo();

      if (session && session.user && login) {
        const userId = session.user.id;
        setLoggingIn(true);
        const response = await fetch(`/api/user/login?userId=${userId}`);
        const user = await response.json();
        if (user) {
          setLoggingIn(false);
          router.push("/");
          return;
        }

        if (userId) {
          await fetch(`/api/user/login?userId=${userId}`, {
            method: "POST",
          });

          router.push("/login=true");
        }
      }

      if (session && session.user) {
        setUserId(session.user.id);
      }
    };

    checkUser();
  }, [router]);

  if (loggingIn) {
    return (
      <main className="flex-1 overflow-y-scroll">
        <HeroSection backgroundName="record-store">
          <h1 className="opacity-100">SpotArt App</h1>
        </HeroSection>
        <h1>logging in...</h1>
      </main>
    );
  }

  if (userId) {
    return (
      <main className="flex-1 overflow-y-scroll">
        <HeroSection backgroundName="record-store">
          <h1 className="opacity-100">SpotArt App</h1>
        </HeroSection>
        <Dashboard />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-store">
        <h1 className="opacity-100">SpotArt App</h1>
      </HeroSection>
      <button
        className="text-bold m-5 h-8 rounded-lg bg-spotartPurple px-2 uppercase text-white hover:bg-spotartLightPurple"
        onClick={() => signIn("spotify", { callbackUrl: "/?login=true" })}
      >
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
