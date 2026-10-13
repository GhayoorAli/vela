import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Camera,
  Scan,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { listProducts } from "@/lib/catalog";
import { CollectionEdit } from "@/components/store/CollectionEdit";
import { ShoppingStudio } from "@/components/store/ShoppingStudio";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listProducts({ sort: "featured" });
  const ivory = products.find((p) => p.slug === "ivory-hoodie");
  const denim = products.find((p) => p.slug === "indigo-jeans");
  return (
    <main className="atelier-home">
      <section className="atelier-hero">
        <Image
          src="/editorial/campaign-v3.webp"
          alt="Ivory hoodie styled against oxblood architecture and a sculptural blue installation"
          fill
          priority
          sizes="100vw"
          className="atelier-hero-image"
        />
        <div className="atelier-hero-shade" />
        <div className="atelier-hero-content">
          <h1>
            Find your
            <br />
            <em>next outfit.</em>
          </h1>
          <div className="hero-bottom">
            <div className="hero-feature-actions">
              <a href="#ai-stylist" className="atelier-button">
                <Sparkles size={18} /> AI stylist
              </a>
              <Link href="/try-on" className="atelier-button hero-ar-button">
                <Scan size={18} /> AR try-on
              </Link>
            </div>
            <p>
              Get outfit suggestions from our AI stylist.
              <br />Try supported pieces on with your camera.
            </p>
          </div>
        </div>
        <a href="#shopping-studio" className="hero-discover">
          <ArrowDown size={16} />
          <span>Explore below</span>
        </a>
        <Link href="/shop" className="hero-mirror-link">
          <span>Explore the collection</span>
          <ArrowUpRight size={17} />
        </Link>
      </section>

      <ShoppingStudio />

      <section id="the-edit" className="atelier-edit">
        <div className="atelier-section-top">
          <Link href="/shop" className="atelier-link">
            Explore all pieces <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="atelier-edit-heading">
          <h2>
            Shop the
            <br />
            <em>collection.</em>
          </h2>
          <p>
            Hoodies, T-shirts, trousers and eyewear.
          </p>
        </div>
        <CollectionEdit products={products} />
      </section>

      <section className="atelier-look">
        <div className="look-photo">
          <Image
            src="/editorial/look-v3.webp"
            alt="Ivory hoodie and indigo jeans styled on a pale blue architectural bench"
            fill
            sizes="(min-width: 900px) 65vw, 100vw"
            className="object-cover"
          />
          {ivory && (
            <Link
              href={`/products/${ivory.slug}`}
              className="look-hotspot"
              aria-label="Shop the ivory hoodie"
            >
              <Plus size={18} />
              <span>
                Ivory Fleece Hoodie <ArrowUpRight size={14} />
              </span>
            </Link>
          )}
        </div>
        <div className="look-panel">
          <h2>
            Hoodie
            <br />
            <em>and denim.</em>
          </h2>
          <p>
            Pair the ivory fleece hoodie with indigo jeans. Shop each piece below.
          </p>
          <div className="look-product-list">
            {[ivory, denim]
              .filter((p) => p !== undefined)
              .map((p) => (
                <Link href={`/products/${p.slug}`} key={p.id}>
                  <span>
                    <small>{p.category.name}</small>
                    {p.name}
                  </span>
                  <span>
                    {formatPrice(p.price)} <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
          </div>
          <Link href="/shop" className="atelier-link">
            Build your own look <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="atelier-mirror">
        <div className="atelier-mirror-layout">
          <div className="atelier-mirror-copy">
            <h2>
              Try it on
              <br />
              <em>with AR.</em>
            </h2>
            <p>
              Open your camera to see supported pieces on yourself before you buy.
            </p>
            <Link href="/try-on" className="atelier-button mirror-button">
              <Camera size={17} /> Enter the fitting room{" "}
              <ArrowUpRight size={17} />
            </Link>
            <div className="mirror-process">
              <span>
                <b>01</b> Choose your piece
              </span>
              <span>
                <b>02</b> Open your camera
              </span>
              <span>
                <b>03</b> See the fit
              </span>
            </div>
          </div>
          <div className="atelier-mirror-visual">
            <div className="mirror-backplate" />
            <div className="mirror-viewfinder">
              <Image
                src="/editorial/ivory-v3.webp"
                alt="Editorial preview of the Vela fitting-room experience"
                fill
                sizes="(min-width: 900px) 35vw, 80vw"
                className="object-cover"
              />
              <span className="viewfinder-corner corner-tl" />
              <span className="viewfinder-corner corner-tr" />
              <span className="viewfinder-corner corner-bl" />
              <span className="viewfinder-corner corner-br" />
              <span className="viewfinder-top">
                <Scan size={16} /> AR TRY-ON
              </span>
            </div>
            <Link href="/try-on" className="mirror-status-card">
              <span className="mirror-status-icon">
                <Scan size={23} />
              </span>
              <span>
                <strong>Open AR try-on</strong>
              </span>
              <ArrowUpRight size={19} />
            </Link>
            <p className="mirror-editorial-note">
              EDITORIAL PREVIEW · LIVE TRY-ON FOR MARKED PRODUCTS
            </p>
          </div>
        </div>
      </section>

      <section className="atelier-discover">
        <div className="discover-heading">
          <h2>
            Browse by
            <br />
            <em>category.</em>
          </h2>
        </div>
        <div className="discover-grid">
          <Link
            href="/shop/hoodies"
            className="discover-tile discover-tile-large"
          >
            <div className="discover-image">
              <Image
                src="/editorial/portrait-v3.webp"
                alt="Rust hoodie in a sculptural cobalt studio setting"
                fill
                sizes="(min-width: 900px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="discover-caption">
              <h3>Hoodies</h3>
              <span>
                Discover hoodies <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
          <div className="discover-right">
            <Link href="/shop/eyewear" className="discover-tile">
              <div className="discover-image">
                <Image
                  src="/editorial/eyewear-v3.webp"
                  alt="Gold round sunglasses in a sculptural still life with pale blue and burgundy tones"
                  fill
                  sizes="(min-width: 900px) 35vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="discover-caption">
                <h3>Eyewear</h3>
                <span>
                  Discover eyewear <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
            <Link href="/shop/trousers" className="discover-type-link">
              <h3>
                Jeans
                <br />
                <em>&amp; chinos.</em>
              </h3>
              <span>
                Explore trousers <ArrowUpRight size={22} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="atelier-signoff">
        <h2>
          See the
          <br />
          <em>full collection.</em>
        </h2>
        <Link href="/shop" className="atelier-button">
          Shop all pieces <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
