import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import HeroSection from "../components/HeroSection";

import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";

import getSessionInfo from "../components/helpers/getSessionInfo";

const Home: NextPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const session = await getSessionInfo();

      if (session && session.user) {
        if (session?.user?.inDatabase === true) {
          setUserId(session.user.id);
          return;
        }

        signOut();
      }
    };

    checkUser();
  }, []);

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
        onClick={() => signIn("spotify")}
      >
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
