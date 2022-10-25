import Link from "next/link";

const Header = () => (
  <header>
    <Link href="/">SpotArt</Link>
    <nav>
      <Link href="/search">Search</Link>
      <Link href="/discover">Discover</Link>
    </nav>
  </header>
);

export default Header;
