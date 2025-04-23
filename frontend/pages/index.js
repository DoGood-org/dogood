import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedSection from "../components/AnimatedSection";

export default function Home() {
  const [email, setEmail] = useState("");

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
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00FFC8";
      dots.forEach((dot) => {
        dot.x += dot.dx;
        dot.y += dot.dy;

        if (dot.x < 0 || dot.x > canvas.width) dot.dx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.dy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to backend API
    console.log("Subscribed email:", email);
    setEmail("");
  };

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
          <title>DoGood — Connect Through Kindness</title>
          <meta name="description" content="A platform where kindness connects the world. Volunteer, donate, support." />
        </Head>

        <canvas id="dots-canvas" className="absolute top-0 left-0 w-full h-full z-0" />

        <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-2 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Image src="/logo.png" alt="DoGood Logo" width={40} height={40} />
            DoGood
          </div>
          <nav className="flex flex-wrap gap-3 text-sm text-gray-300">
            <Link href="#about" className="hover:text-teal-300">About</Link>
            <Link href="#how" className="hover:text-teal-300">How it works</Link>
            <Link href="/login" className="hover:text-teal-300">Login</Link>
            <Link href="/register" className="hover:text-teal-300">Register</Link>
          </nav>
        </header>

        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center justify-between px-4 pt-4 pb-12 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-start text-left max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Welcome to <span className="text-teal-400">DoGood</span>
            </h1>
            <p className="text-base text-gray-300 mb-6 leading-relaxed">
              A platform where kindness connects the world. Volunteer, donate, support — and make a real impact.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                  href="/map"
                  className="px-6 py-2.5 bg-teal-400 text-black font-semibold rounded-lg hover:bg-teal-300 transition"
              >
                Get Started
              </Link>
              <Link
                  href="#about"
                  className="px-6 py-2.5 border border-teal-300 text-teal-300 rounded-lg hover:bg-teal-300 hover:text-black transition"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center w-full">
            <Image
                src="/planet.png"
                alt="Planet of kindness"
                width={460}
                height={460}
                className="animate-pulse"
                priority
            />
          </div>

          <form
              onSubmit={handleSubmit}
              className="col-span-1 lg:col-span-2 bg-white text-black rounded-xl p-5 shadow w-full max-w-lg mx-auto"
          >
            <h3 className="text-lg font-bold mb-3">Subscribe for updates</h3>
            <input
                type="email"
                placeholder="Your email"
                className="w-full p-3 border rounded mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          <section id="features" className="relative z-10 bg-white text-black px-4 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">What You Can Do</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {features.map(({ title, description, href }) => (
                  <Link key={title} href={href}>
                    <div className="bg-gray-100 p-5 rounded-lg shadow hover:shadow-lg hover:bg-gray-200 transition h-full cursor-pointer">
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
