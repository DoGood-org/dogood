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
}
