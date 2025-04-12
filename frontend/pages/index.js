// pages/index.js
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const canvas = document.getElementById("dots-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FFC8";
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const features = [
    {
      title: "GoodBot 🤖",
      description: "Daily guidance and motivational help from AI assistant.",
      href: "/goodbot",
    },
    {
      title: "GoodMap 🗺️",
      description: "Track and see good deeds around the globe.",
      href: "/map",
    },
    {
      title: "Volunteering 🙌",
      description: "Join local and global missions, earn help hours.",
      href: "/volunteering",
    },
    {
      title: "Donations 💸",
      description: "Easily support verified causes and campaigns.",
      href: "/wallet",
    },
    {
      title: "Grants 🎯",
      description: "Apply for microgrants to boost your ideas.",
      href: "/grants",
    },
    {
      title: "My Deeds ❤️",
      description: "Your personal good action dashboard.",
      href: "/my-deeds",
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title>DoGood</title>
      </Head>

      <canvas id="dots-canvas" className="absolute top-0 left-0 w-full h-full z-0"></canvas>

      <header className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold flex items-center">
          <Image src="/logo.png" alt="DoGood Logo" width={40} height={40} className="inline mr-2" />
          DoGood
        </div>
        <nav className="space-x-4 text-sm">
          <Link href="#about" className="hover:text-teal-300">About</Link>
          <Link href="#features" className="hover:text-teal-300">Features</Link>
          <Link href="/login" className="hover:text-teal-300">Login</Link>
          <Link href="/register" className="hover:text-teal-300">Register</Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-20">
        <Image src="/planet.png" alt="Planet" width={300} height={300} className="mb-6 animate-pulse" />
        <Image src="/goodbot.png" alt="GoodBot" width={120} height={120} className="mb-6" />
        <h1 className="text-5xl font-extrabold mb-4">Welcome to DoGood</h1>
        <p className="text-xl mb-6 max-w-2xl">
          A platform where kindness connects the world. Volunteer, donate, support.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="px-6 py-3 bg-teal-400 rounded-xl text-black font-semibold hover:bg-teal-300 transition">
            Get Started
          </Link>
          <Link href="/login" className="px-6 py-3 border border-teal-300 rounded-xl hover:bg-teal-300 hover:text-black transition">
            I already have an account
          </Link>
        </div>
      </main>

      <section id="features" className="relative z-10 bg-white text-black px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Platform Features</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map(({ title, description, href }) => (
            <Link key={title} href={href}>
              <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg hover:bg-gray-200 transition cursor-pointer h-full">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{title}</h3>
                <p className="text-gray-700 text-sm">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
