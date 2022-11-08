import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import HeroSection from "./components/HeroSection";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <main className="flex-1 overflow-y-scroll">
        <HeroSection backgroundName="record-store">
          <h1 className="opacity-100">SpotArt App</h1>
        </HeroSection>
        <p>Welcome {session.user?.id}!</p>
      </main>
    );
  }

  if (status === "loading") {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-scroll">
      <h1>SpotArt App</h1>
      <button type="submit" onClick={() => signIn("spotify")}>
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
