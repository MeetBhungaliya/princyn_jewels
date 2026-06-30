import Link from "next/link";
import React from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

const socials = [
  {
    icon: FaInstagram,
    href: "#",
    label: "Instagram",
  },
  {
    icon: FaFacebook,
    href: "#",
    label: "Facebook",
  },
  {
    icon: FaYoutube,
    href: "#",
    label: "YouTube",
  },
];

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2">
      {socials.map(({ href, icon, label }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          className="group rounded-full border border-border/60 bg-surface p-2.5 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-background"
        >
          {React.createElement(icon, { className: "size-5" })}
        </Link>
      ))}
    </div>
  );
}
