import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import HeroSection from "./components/HeroSection";

import Dashboard from "./components/Dashboard";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      if (session && status === "authenticated") {
        const url = new URL(window.location.href);
        const login = url.searchParams.get("login");

        console.log(login);

        if (login) {
          const params = new URLSearchParams({
            name: session?.user?.id as string,
          });
          const response = await fetch(`/api/user/login?${params}`);
          console.log(response);
          const user = await response.json();

          if (user) {
            router.push("/");
          }

          if (session?.user?.id) {
            const response = await fetch("/api/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: session.user.id }),
            });

            const userCreated = await response.json();
            console.log(userCreated);
            router.push("/");
          }
        }
        return;
      }
    };

    checkUser();
  }, [status]);

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

  if (status === "loading") {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-scroll">
      <h1>SpotArt App</h1>
      <button
        onClick={() => signIn("spotify", { callbackUrl: "/?login=true" })}
      >
        Sign in with Spotify
      </button>
    </main>
  );
};

export default Home;
