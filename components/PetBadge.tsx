// Small floating corner link to the kids' game (Adoption Pet) at /pet.
// Server component — just an anchor, no client JS. Appears on the marketing
// pages via the root layout; the static /pet and /build pages don't render it.
export default function PetBadge() {
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
