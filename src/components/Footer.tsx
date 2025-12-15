import Link from "next/link";
import { LogoIcon } from "./icons";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LogoIcon className="text-primary" />
            <span className="font-semibold text-foreground">Pelcutron</span>
          </div>
          <p className="text-muted-foreground">
            Smart monitoring for modern aquaculture.
          </p>
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Pelcutron. All rights reserved.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-foreground">Product</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="#features" className="hover:text-primary">
                Features
              </Link>
            </li>
            <li>
              <Link href="#boat" className="hover:text-primary">
                Monitoring Boat
              </Link>
            </li>
            <li>
              <Link href="#dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-foreground">Company</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link href="#" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary">
                Careers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 text-foreground">
            Quick Contact
          </div>
          <ul className="space-y-1 text-muted-foreground">
            <li>Email: hello@Pelcutron.app</li>
            <li>Phone: +62 812‑3456‑7890</li>
            <li>Address: Indonesia</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
