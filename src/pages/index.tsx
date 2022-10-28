import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import HeroSection from "./components/HeroSection";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <main>
        <HeroSection backgroundName="record-store">
          <h1 className="opacity-100">SpotArt App</h1>
        </HeroSection>
        <p>Welcome {session.user?.id}!</p>
      </main>
    );
  }

  return (
    <main>
      <h1>SpotArt App</h1>
      <button type="submit" onClick={() => signIn("spotify")}>
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
