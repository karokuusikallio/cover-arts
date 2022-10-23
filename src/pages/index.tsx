import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  return (
    <div>
      <h1>SpotArt App</h1>
    </div>
  );
};

export default Home;
