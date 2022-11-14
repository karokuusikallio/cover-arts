import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import HeroSection from "./components/HeroSection";

import Dashboard from "./components/Dashboard";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const login = url.searchParams.get("login");

    const checkUser = async () => {
      if (session && status === "authenticated") {
        if (login) {
          setLoggingIn(true);
          const params = new URLSearchParams({
            name: session?.user?.id as string,
          });
          const response = await fetch(`/api/user/login?${params}`);
          const user = await response.json();
          if (user) {
            setLoggingIn(false);
            router.push("/");
            return;
          }

          if (session?.user?.id) {
            await fetch("/api/user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: session.user.id }),
            });
          }
        }
        return;
      }
    };

    checkUser();
  }, [status, session, router]);

  if (status === "loading" || loggingIn) {
    return (
      <div>
        <h1>logging in...</h1>
      </div>
    );
  }

  if (session && status === "authenticated") {
    return (
      <main className="flex-1 overflow-y-scroll">
        <HeroSection backgroundName="record-store">
          <h1 className="opacity-100">SpotArt App</h1>
        </HeroSection>
        <p>Welcome {session.user?.id}!</p>
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
