import Image from "next/image";

const NAV_LINKS = ["Story", "Metabolism", "Memories", "Dashboard"] as const;

export function Navbar() {
  return (
    <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3">
      <div className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0 overflow-hidden">
        <Image
          src="/Images/logo-brands/wal-is-alive-logo-remove.png"
          alt="Wal is Alive"
          width={44}
          height={44}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div
        className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3"
        style={{ backgroundColor: "#EDEDED" }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}
