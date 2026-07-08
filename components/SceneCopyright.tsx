export default function SceneCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <p className="pointer-events-none absolute right-4 bottom-4 z-20 max-w-none whitespace-nowrap text-right text-[11px] leading-none tracking-[0.12em] text-white/45 uppercase md:right-28 md:bottom-6 md:text-[14px] md:tracking-[0.14em]">
      © {currentYear} SMM ENTERTAINMENT. ALL RIGHTS RESERVED.
    </p>
  );
}
