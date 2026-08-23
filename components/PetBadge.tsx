"use client";
import { usePathname } from "next/navigation";

// Small floating corner link to the kids' game (Adoption Pet) at /pet.
// Appears on the marketing pages via the root layout; hidden on tool pages
// like /screener so it doesn't overlap the content.
const HIDE_ON_PREFIXES = ["/screener"];

export default function PetBadge() {
  const pathname = usePathname();
  if (pathname && HIDE_ON_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return (
    <a
      href="/pet"
      aria-label="Adoption Pet game"
      className="group fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 shadow-pop-sm transition-transform hover:-translate-y-0.5"
    >
      <span
        className="grid h-8 w-8 place-items-center rounded-full text-lg shadow-pop-sm"
        style={{ background: "linear-gradient(135deg,#ff7eb6,#a97bff)" }}
      >
        🐾
      </span>
      <span className="text-sm font-extrabold leading-none text-navy">
        Adoption&nbsp;Pet
      </span>
    </a>
  );
}
