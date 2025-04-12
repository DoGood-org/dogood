// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-6 text-sm border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <Link href="/profile" className="hover:text-teal-300">My Profile</Link>
          <Link href="/myposts" className="hover:text-teal-300">My Posts</Link>
          <Link href="/my-deeds" className="hover:text-teal-300">Good Deeds</Link>
          <Link href="/my-hours" className="hover:text-teal-300">Help Hours</Link>
          <Link href="/wallet" className="hover:text-teal-300">Wallet</Link>
          <Link href="/badges" className="hover:text-teal-300">Badges</Link>
          <Link href="/grants" className="hover:text-teal-300">Grants</Link>
          <Link href="/volunteer" className="hover:text-teal-300">Volunteer</Link>
          <Link href="/support" className="hover:text-teal-300">Support</Link>
          <Link href="/learn" className="hover:text-teal-300">Learn</Link>
        </div>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} DoGood. All rights reserved.</p>
      </div>
    </footer>
  );
}
