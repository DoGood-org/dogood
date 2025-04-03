
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    document.title = "Map";
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Map</h1>
      <p>This is the map page of DoGood.</p>
    </div>
  );
}
