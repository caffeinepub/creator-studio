import { Globe, Mail } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="footer.section"
      className="relative"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.22 0.08 250) 0%, oklch(0.18 0.06 240) 100%)",
      }}
    >
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none">
        <svg
          viewBox="0 0 1440 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-hidden="true"
        >
          <path
            d="M0,25 C240,50 480,0 720,25 C960,50 1200,0 1440,25 L1440,50 L0,50 Z"
            fill="oklch(0.22 0.08 250)"
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Main footer row */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="font-display text-xl font-extrabold text-white mb-1">
              Florida Dave 🌴
            </div>
            <div className="text-white/50 text-sm font-body">
              Part of the Florida Dave Network
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              data-ocid="footer.tiktok_link"
              href="https://tiktok.com/@floridadave"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body text-sm"
            >
              <SiTiktok size={16} />
              <span>@floridadave</span>
            </a>

            <a
              data-ocid="footer.website_link"
              href="https://floridadave.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body text-sm"
            >
              <Globe size={16} />
              <span>FloridaDave.net</span>
            </a>

            <a
              href="mailto:hello@floridadave.net"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body text-sm"
            >
              <Mail size={16} />
              <span>hello@floridadave.net</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex gap-5 text-white/40 text-xs font-body">
            <button
              type="button"
              className="hover:text-white/70 transition-colors"
            >
              Terms
            </button>
            <button
              type="button"
              className="hover:text-white/70 transition-colors"
            >
              Privacy
            </button>
            <a
              href="mailto:hello@floridadave.net"
              className="hover:text-white/70 transition-colors"
            >
              Contact
            </a>
          </div>

          <div className="text-white/40 text-xs font-body text-center">
            © {year} Florida Dave Network. All rights reserved.
            <br className="md:hidden" />
            <span className="hidden md:inline"> · </span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 underline transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
