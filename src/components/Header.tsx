import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import spotcoverlogo from "../../public/spotart-logo.png";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="z-1000 relative top-0 flex h-[100px] items-center px-20 py-5 shadow-lg">
      <div className="flex w-screen">
        <Link href="/">
          <a className="flex items-center px-5">
            <Image
              alt="SpotArtLogo"
              src={spotcoverlogo}
              width="192"
              height="40.5"
            />
          </a>
        </Link>
        <nav className="text-l flex items-center font-semibold text-spotartPurple">
          <Link href="/search">
            <a className="px-5 hover:text-spotartLightPurple">
              Search Album Art
            </a>
          </Link>
          <Link href="/discover">
            <a className="px-5 hover:text-spotartLightPurple">
              Discover Albums
            </a>
          </Link>
        </nav>
      </div>
      {session && (
        <div className="flex items-center whitespace-nowrap">
          <p className="px-5">Logged in as: {session.user?.id}</p>
          <button
            className="text-bold float-right m-5 h-8 w-24 rounded-lg bg-spotartPurple uppercase text-white hover:bg-spotartLightPurple"
            type="submit"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
