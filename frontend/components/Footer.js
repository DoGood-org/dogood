// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-6 text-sm border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/profile" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            My Profile
          </Link>
          <Link href="/myposts" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            My Posts
          </Link>
          <Link href="/my-deeds" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Good Deeds
          </Link>
          <Link href="/my-hours" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Help Hours
          </Link>
          <Link href="/wallet" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Wallet
          </Link>
          <Link href="/badges" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Badges
          </Link>
          <Link href="/grants" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Grants
          </Link>
          <Link href="/volunteer" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Volunteer
          </Link>
          <Link href="/support" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Support
          </Link>
          <Link href="/learn" className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded">
            Learn
          </Link>
        </div>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} DoGood. All rights reserved.</p>
      </div>
    </footer>
  );
}
