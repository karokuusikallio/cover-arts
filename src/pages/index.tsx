import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    return (
      <main>
        <h1>SpotArt App</h1>
        <p>Welcome {session.user?.name}</p>
        <button type="submit" onClick={() => signOut()}>
          Logout
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>SpotArt App</h1>
      <button type="submit" onClick={() => signIn()}>
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
