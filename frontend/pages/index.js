import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#FFF9EB] min-h-screen text-[#1D2B3A] font-sans">
      <Head>
        <title>DoGood</title>
      </Head>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-[#1D2B3A]">DoGood</div>
        <nav className="hidden md:flex gap-6 text-[#1D2B3A] font-medium text-sm">
          <Link href="#about" className="hover:text-teal-500">About</Link>
          <Link href="#explore" className="hover:text-teal-500">Explore</Link>
          <Link href="#how" className="hover:text-teal-500">How it works</Link>
        </nav>
        <Link
          href="/register"
          className="bg-[#1D8A99] hover:bg-[#13727d] text-white text-sm px-5 py-2 rounded-full font-semibold"
        >
          Sign up
        </Link>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-extrabold text-[#1D2B3A]">DoGood</h1>
          <p className="text-[#3F4D5B] text-base max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            consectetur ligula eget dolor.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="bg-[#1D8A99] hover:bg-[#13727d] text-white px-6 py-3 rounded-full font-semibold shadow"
            >
              Get Started
            </Link>
            <Link
              href="#how"
              className="border border-[#1D8A99] text-[#1D8A99] hover:bg-[#E6F5F6] px-6 py-3 rounded-full font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center relative">
          <div className="absolute top-[-40px] left-[-60px] md:left-[-80px] w-40 h-40 bg-[#E4FFE6] rounded-full blur-3xl z-0" />
          <Image
            src="/planet.png"
            alt="Planet"
            width={300}
            height={300}
            className="z-10"
          />
          <Image
            src="/goodbot.png"
            alt="GoodBot"
            width={130}
            height={130}
            className="absolute top-[-60px] left-[-60px] animate-pulse z-10"
          />
        </div>
      </main>

      {/* Info Boxes */}
      <section className="bg-[#FFFDF6] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
            <div className="text-4xl mb-2">💛</div>
            <h3 className="text-lg font-bold text-[#1D2B3A] mb-1">Looking for help</h3>
            <p className="text-sm text-[#3F4D5B]">Find someone who can support you.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
            <div className="text-4xl mb-2">🌿</div>
            <h3 className="text-lg font-bold text-[#1D2B3A] mb-1">Nearby proposals</h3>
            <p className="text-sm text-[#3F4D5B]">See what happens near you.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition text-center">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-bold text-[#1D2B3A] mb-1">Your good deeds</h3>
            <p className="text-sm text-[#3F4D5B]">Track your impact and actions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
