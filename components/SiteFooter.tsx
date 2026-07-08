export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="min-h-[96px] border-t border-white/[0.12] bg-black">
      <div className="mx-auto flex min-h-[96px] flex-col items-center justify-center gap-3 px-6 py-7 text-center md:grid md:grid-cols-3 md:items-center md:gap-0 md:px-[3.5vw] md:py-8 md:pr-[5vw] md:text-left">
        <p className="text-[0.77rem] tracking-[0.22em] text-gold uppercase md:text-[0.88rem] md:tracking-[0.16em]">
          SMM ENTERTAINMENT
        </p>

        <p className="text-[0.68rem] tracking-[0.22em] text-white/55 uppercase md:text-center md:text-[0.72rem] md:tracking-[0.65em]">
          CREATE. PERFORM. CONNECT. EVOLVE.
        </p>

        <p className="max-w-full text-[10px] tracking-[0.18em] text-white/45 uppercase md:text-right md:tracking-[0.14em]">
          &copy; {currentYear} SMM ENTERTAINMENT. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
