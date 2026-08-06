import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Newsletter from "./Newsletter";

const GOLD = "var(--color-gold)";

const socials = [
  { icon: FaInstagram, href: "https://www.instagram.com/princynjewels", label: "Instagram" },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/share/19FqUYSXd1",
    label: "Facebook",
  },
  { icon: FaWhatsapp, href: "https://wa.me/+918320828901", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-foreground)] transition-colors duration-300">
      {/* Upper Footer: Main columns */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                  border: `1.5px solid rgba(var(--color-gold-rgb),0.45)`,
                  backgroundColor: "rgba(var(--color-gold-rgb),0.07)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Princyn Jewels"
                  width={38}
                  height={38}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="leading-none">
                <div
                  className="font-serif text-xl uppercase tracking-[0.32em]"
                  style={{ color: GOLD }}
                >
                  Princyn
                </div>
                <div
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.6em]"
                  style={{ color: "var(--color-gold-dark)" }}
                >
                  Jewels
                </div>
              </div>
            </Link>

            <p className="text-sm text-[var(--color-foreground-secondary)] leading-relaxed font-sans max-w-sm">
              Discover unique craftsmanship and timeless elegance. Princyn
              Jewels offers an exquisite collection of luxury rings, necklaces,
              bracelets, and earrings designed to be cherished for generations.
            </p>

            <div className="flex items-center gap-3 mt-2">
              {socials.map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={label === "WhatsApp" ? "_blank" : undefined}
                  rel={label === "WhatsApp" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="group rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-2.5 transition-all duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                >
                  {React.createElement(icon, {
                    className:
                      "size-4 group-hover:scale-110 transition-transform duration-300",
                  })}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links / Collections */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-serif text-base uppercase tracking-[0.2em] font-semibold border-b border-[var(--color-border)] pb-2 max-w-[120px]"
              style={{ color: GOLD }}
            >
              Collections
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/category/women"
                  className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/category/men"
                  className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/category/kids"
                  className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  Kid&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/category/other"
                  className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200"
                >
                  Other Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Info */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-serif text-base uppercase tracking-[0.2em] font-semibold border-b border-[var(--color-border)] pb-2 max-w-[150px]"
              style={{ color: GOLD }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm text-[var(--color-foreground-secondary)]">
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="size-4 shrink-0 mt-0.5"
                  style={{ color: GOLD }}
                />
                <span>
                  1st Floor Morlidhar Complex, Pipals Char Rasta, Katargam, Surat-395004
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0" style={{ color: GOLD }} />
                <a
                  href="tel:+918320828901"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  (+91) 83208 28901
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0" style={{ color: GOLD }} />
                <a
                  href="mailto:support@princynjewels.com"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  support@princynjewels.com
                </a>
              </li>

              {/* <li className="flex items-center gap-2.5">
                <HelpCircle
                  className="size-4 shrink-0"
                  style={{ color: GOLD }}
                />
                <Link
                  href="#"
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  FAQs & Help Center
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4
              className="font-serif text-base uppercase tracking-[0.2em] font-semibold border-b border-[var(--color-border)] pb-2 max-w-[150px]"
              style={{ color: GOLD }}
            >
              Newsletter
            </h4>
            <p className="text-sm text-[var(--color-foreground-secondary)] leading-relaxed">
              Subscribe to receive updates on new arrivals, secret sales, and
              exclusive brand events.
            </p>
            <Newsletter />
          </div>
        </div>
      </div>

      {/* Lower Footer: Copyright & Payments */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)] py-4 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center text-xs text-[var(--color-foreground-secondary)]">
          &copy; {new Date().getFullYear()} Princyn Jewels. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
