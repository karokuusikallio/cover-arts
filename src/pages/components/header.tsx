import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import spotcoverlogo from "../../../public/spotart-logo.png";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex h-[100px] items-center justify-between p-5 shadow-md">
      <div className="mx-20 flex">
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
        <nav className="flex items-center text-xl font-semibold text-spotartPurple">
          <Link href="/search">
            <a className="px-5">Search Album Art</a>
          </Link>
          <Link href="/discover">
            <a className="px-5">Discover Albums</a>
          </Link>
        </nav>
        {session && (
          <button type="submit" onClick={() => signOut()}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
