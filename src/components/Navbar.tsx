import Link from "next/link";
import logo from "@/assets/images/logo/Pelcutron_Logo_Main.png";
import { LogoIcon } from "./icons";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src={logo} alt="Logo Pelcutron" className="w-28" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="#features"
            className="hover:text-primary text-muted-foreground"
          >
            Features
          </Link>
          <Link
            href="#boat"
            className="hover:text-primary text-muted-foreground"
          >
            Monitoring Boat
          </Link>
          <Link
            href="#dashboard"
            className="hover:text-primary text-muted-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#contact"
            className="hover:text-primary text-muted-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-full text-sm border border-border hover:bg-secondary"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
