// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
