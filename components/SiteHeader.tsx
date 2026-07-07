import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/80 via-black/45 to-transparent md:h-28" />
      <div className="relative flex items-start px-6 pt-6 md:px-10 md:pt-7 lg:px-12 lg:pt-8">
        <Image
          src="/images/smme-logo.png"
          alt="SMM Entertainment"
          width={220}
          height={56}
          priority
          className="h-[30px] w-auto md:h-auto md:w-[100px]"
        />
      </div>
    </header>
  );
}
