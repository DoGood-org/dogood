import dynamic from "next/dynamic";

// Disable SSR for the map page component
const MapPageContent = dynamic(() => import("../components/MapPage"), {
  ssr: false,
});

export default function MapPage() {
  return <MapPageContent />;
}
