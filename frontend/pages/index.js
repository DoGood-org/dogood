// pages/index.js
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import AnimatedSection from "../components/AnimatedSection";

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

  return (
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <Head>
          <title>DoGood</title>
        </Head>

        <canvas id="dots-canvas" className="absolute top-0 left-0 w-full h-full z-0" />

        <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-2 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Image src="/logo.png" alt="DoGood Logo" width={40} height={40} />
            DoGood
          </div>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link href="#about" className="hover:text-teal-300">About</Link>
            <Link href="#how" className="hover:text-teal-300">How it works</Link>
            <Link href="/login" className="hover:text-teal-300">Login</Link>
            <Link href="/register" className="hover:text-teal-300">Register</Link>
          </nav>
        </header>

        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center justify-between px-4 pt-4 pb-8 gap-4 max-w-5xl mx-auto">
          <div className="flex flex-col items-start text-left max-w-xl">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">Welcome to DoGood</h1>
            <p className="text-base text-gray-300 mb-4 leading-relaxed">
              A platform where kindness connects the world. Volunteer, donate, support.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                  href="/map"
                  className="px-5 py-2.5 bg-teal-400 rounded-lg text-black font-semibold hover:bg-teal-300 transition"
              >
                Start
              </Link>
              <Link
                  href="#about"
                  className="px-5 py-2.5 border border-teal-300 rounded-lg hover:bg-teal-300 hover:text-black transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center w-full">
            <Image
                src="/planet.png"
                alt="Planet"
                width={450}
                height={450}
                className="animate-pulse"
            />
          </div>



          <form className="bg-white text-black rounded-xl p-4 shadow w-full max-w-md mx-auto mt-10">
            <h3 className="text-lg font-bold mb-2">Subscribe for updates</h3>
            <input
                type="email"
                placeholder="Your email"
                className="w-full p-2 border rounded mb-2"
                required
            />
            <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
            >
              Subscribe
            </button>
          </form>
        </main>

        <AnimatedSection>
          <section id="features" className="relative z-10 bg-white text-black px-4 py-6">
            <h2 className="text-2xl font-bold text-center mb-6">What You Can Do</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {features.map(({ title, description, href }) => (
                  <Link key={title} href={href}>
                    <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg hover:bg-gray-200 transition h-full cursor-pointer">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-1">{title}</h3>
                      <p className="text-gray-700 text-sm">{description}</p>
                    </div>
                  </Link>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </div>
  );
}