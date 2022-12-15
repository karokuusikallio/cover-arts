import Image from "next/image";
import Link from "next/link";

import spotcoverlogo from "../../public/spotart-logo.png";

const Header = () => {
  return (
    <header className="z-1000 relative top-0 flex h-[100px] items-center py-5 shadow-lg sm:px-20">
      <div className="flex w-screen">
        <Link href="/" className="flex items-center px-5">
          <Image
            alt="SpotArtLogo"
            src={spotcoverlogo}
            width="192"
            height="40.5"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
