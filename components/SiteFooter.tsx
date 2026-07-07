export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black md:h-9">
      <div className="mx-auto flex h-auto min-h-9 flex-col items-center justify-center gap-3 px-6 py-4 text-center md:h-9 md:flex-row md:justify-between md:gap-4 md:px-[52px] md:py-0 md:text-left">
        <p className="text-[7px] tracking-[0.25em] text-white/70 uppercase">
          SMM ENTERTAINMENT
        </p>

        <p className="text-[7px] tracking-[0.2em] text-white/50 uppercase">
          CREATE. PERFORM. CONNECT. EVOLVE.
        </p>

        <p className="text-[7px] tracking-[0.15em] text-white/40 uppercase">
          &copy; 2024 SMM ENTERTAINMENT. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
