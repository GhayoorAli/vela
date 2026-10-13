import Link from "next/link";
import { ArrowUpRight, Scan } from "lucide-react";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export function Footer() {
  return (
    <footer className="studio-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="studio-wordmark">
            VELA<span>STUDIO</span>
          </Link>
          <p>
            Clothing and eyewear.
            <br />
            Outfit suggestions and camera try-on.
          </p>
          <Link href="/try-on" className="footer-mirror">
            <Scan size={18} /> Open AR try-on <ArrowUpRight size={17} />
          </Link>
        </div>
        <div>
          <p className="studio-label">EXPLORE</p>
          <nav aria-label="Footer shop navigation">
            <Link href="/shop">The collection</Link>
            <Link href="/shop/hoodies">Hoodies</Link>
            <Link href="/shop/tees">T-shirts</Link>
            <Link href="/shop/trousers">Trousers</Link>
            <Link href="/shop/eyewear">Eyewear</Link>
          </nav>
        </div>
        <div>
          <p className="studio-label">SHOPPING TOOLS</p>
          <nav aria-label="Footer tools">
            <Link href="/try-on">AR fitting room</Link>
            <Link href="/stylist">AI personal stylist</Link>
            <Link href="/cart">Your shopping bag</Link>
            <Link href="/admin">Store administration</Link>
          </nav>
        </div>
        <div className="footer-note">
          <p className="studio-label">TRY BEFORE YOU BUY</p>
          <p>
            Use your camera to try on supported pieces before adding them to your bag.
          </p>
          <span className="footer-star" aria-hidden>
            ✳
          </span>
        </div>
      </div>
      <InstallPrompt />
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vela Studio</span>
        <a href="#store-content">Back to top ↑</a>
      </div>
    </footer>
  );
}
