import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 w-full p-4">{children}</main>
    </div>
  );
}
