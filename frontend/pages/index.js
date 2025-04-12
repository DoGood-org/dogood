import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "GoodBot 🤖",
    description: "Daily guidance and motivation from our AI helper.",
    href: "/goodbot",
  },
  {
    title: "GoodMap 🗺️",
    description: "Explore kind actions around the world.",
    href: "/map",
  },
  {
    title: "Volunteer 🙌",
    description: "Join local and global missions.",
    href: "/volunteering",
  },
  {
    title: "Donate 💸",
    description: "Support trusted initiatives instantly.",
    href: "/wallet",
  },
  {
    title: "Grants 🎯",
    description: "Apply for microgrants to fund your ideas.",
    href: "/grants",
  },
  {
    title: "My Deeds ❤️",
    description: "Track your personal impact.",
    href: "/my-deeds",
  },
];

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

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title>DoGood - Make Kindness Visible</title>
      </Head>

      {/* animated background */}
      <canvas id="dots-canvas" className="absolute top-0 left-0 w-full h-full z-0" />

      {/* HEADER */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Image src="/logo.png" alt="DoGood Logo" width={40} height={40} />
          DoGood
        </div>
        <nav className="space-x-4 text-sm">
          <Link href="/login" className="hover:text-teal-400">Login</Link>
          <Link href="/register" className="hover:text-teal-400">Register</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <Image src="/planet.png" alt="Planet" width={300} height={300} className="mb-4 animate-pulse" />
        <Image src="/goodbot.png" alt="GoodBot" width={120} height={120} className="mb-4" />
        <h1 className="text-5xl font-extrabold mb-4">Welcome to DoGood</h1>
        <p className="text-lg text-gray-200 max-w-2xl mb-6">
          A global platform where kindness connects. Volunteer, donate, support and grow.
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

      {/* FEATURES GRID */}
      <section className="relative z-10 bg-white text-black px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">What You Can Do</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map(({ title, description, href }) => (
            <Link key={title} href={href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-xl hover:bg-gray-200 transition h-full cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">{title}</h3>
                <p className="text-gray-700 text-sm">{description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
