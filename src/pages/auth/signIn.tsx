import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Signin() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("spotify", { callbackUrl: "/" });
    } else if (status === "authenticated") {
      void router.push("/");
    }
  }, [status, router]);

  return (
    <div className="flex-1 overflow-y-scroll">
      <p className="p-20">Trying to log in...</p>
    </div>
  );
}
