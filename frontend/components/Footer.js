// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-8 text-sm text-center border-t border-gray-800">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" className="hover:text-teal-300">About</Link>
          <Link href="/support" className="hover:text-teal-300">Support</Link>
          <Link href="/learn" className="hover:text-teal-300">Learn</Link>
          <Link href="/privacy" className="hover:text-teal-300">Privacy</Link>
          <Link href="/terms" className="hover:text-teal-300">Terms</Link>
        </div>

        <p className="text-xs text-gray-500">© {new Date().getFullYear()} DoGood. All rights reserved.</p>
      </div>
    </footer>
  );
}
