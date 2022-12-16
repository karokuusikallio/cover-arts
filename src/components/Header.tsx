import Image from "next/image";
import Link from "next/link";

import coverArtsLogo from "../../public/cover-arts-logo.png";

const Header = () => {
  return (
    <header className="z-1000 sticky top-0 flex h-[100px] items-center py-5 px-5 shadow-lg sm:px-20">
      <div className="flex w-screen">
        <Link href="/" className="flex items-center">
          <Image
            alt="CoverArtsLogo"
            src={coverArtsLogo}
            width="220"
            height="60"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
