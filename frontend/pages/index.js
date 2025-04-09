import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to DoGood</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        DoGood is a global platform for kindness, purpose, and impact. Here you can find volunteers,
        donate to verified causes, earn help hours, apply for grants, and connect with like-minded people.
      </p>

      <div className="flex gap-4 flex-wrap justify-center mb-8">
        <Link href="/register">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
            Get Started
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition">
            I already have an account
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        <FeatureCard
          title="GoodBot 🤖"
          description="Get daily motivation, guidance and gentle nudges from our AI-powered helper."
          href="/goodbot"
        />
        <FeatureCard
          title="GoodMap 🗺️"
          description="See and track good deeds around the world. Add your own!"
          href="/map"
        />
        <FeatureCard
          title="Volunteering 🙌"
          description="Join people-powered projects. Earn help hours and impact lives."
          href="/volunteering"
        />
        <FeatureCard
          title="Donations 💸"
          description="Support trusted nonprofits and initiatives in a few clicks."
          href="/wallet"
        />
        <FeatureCard
          title="Grants 🎯"
          description="Apply for DoGood microgrants and turn your ideas into action."
          href="/grants"
        />
        <FeatureCard
          title="My Deeds ❤️"
          description="Track your contributions and see how much good you've done!"
          href="/my-deeds"
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, href }) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded shadow hover:shadow-lg transition cursor-pointer text-left">
        <h2 className="text-xl font-semibold text-indigo-800 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        // Animated background dots using canvas
        const canvas = document.getElementById('dots-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const dots = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00FFC8';
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
        <div className="relative w-full h-screen overflow-hidden bg-black text-white">
            <Head>
                <title>DoGood</title>
            </Head>

            {/* Background animation canvas */}
            <canvas id="dots-canvas" className="absolute top-0 left-0 w-full h-full z-0"></canvas>

            {/* Header navigation bar */}
            <header className="relative z-10 flex justify-between items-center px-8 py-4 bg-transparent">
                <div className="text-2xl font-bold flex items-center">
                    <Image src="/logo.png" alt="DoGood Logo" width={40} height={40} className="inline mr-2" />
                    DoGood
                </div>
                <nav className="space-x-6">
                    <Link href="#about" className="hover:text-teal-300">About</Link>
                    <Link href="#how" className="hover:text-teal-300">How it works</Link>
                    <Link href="/login" className="hover:text-teal-300">Login</Link>
                    <Link href="/register" className="hover:text-teal-300">Register</Link>
                </nav>
            </header>

            {/* Hero section */}
            <main className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                <Image src="/planet.png" alt="Planet" width={300} height={300} className="mb-6 animate-pulse" />
                <Image src="/goodbot.png" alt="GoodBot" width={120} height={120} className="mb-6" />
                <h1 className="text-5xl font-extrabold mb-4">Welcome to DoGood</h1>
                <p className="text-xl mb-6 max-w-2xl">
                    A platform where kindness connects the world. Volunteer, donate, support.
                </p>
                <div className="space-x-4">
                    <Link
                        href="/map"
                        className="px-6 py-3 bg-teal-400 rounded-xl text-black font-semibold hover:bg-teal-300 transition"
                    >
                        Start
                    </Link>
                    <Link
                        href="#about"
                        className="px-6 py-3 border border-teal-300 rounded-xl hover:bg-teal-300 hover:text-black transition"
                    >
                        Learn More
                    </Link>
                </div>
            </main>
        </div>
    );
}
