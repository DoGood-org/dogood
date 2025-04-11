// pages/learn.js
const videos = [
  { title: "How to use GoodMap", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { title: "Creating a Post", url: "https://www.youtube.com/embed/ysz5S6PUM-U" },
];

const articles = [
  { title: "What is Mutual Aid?", content: "Mutual aid is a voluntary reciprocal exchange of resources and services for mutual benefit..." },
  { title: "The Ethics of Helping", content: "Helping others requires empathy, responsibility, and consistency..." },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Learn & Grow</h1>

      {/* Videos */}
      <h2 className="text-xl font-semibold mb-4">Video Tutorials</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {videos.map((video, i) => (
          <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
            <iframe className="w-full h-64" src={video.url} title={video.title} allowFullScreen></iframe>
            <div className="p-4 text-lg font-medium">{video.title}</div>
          </div>
        ))}
      </div>

      {/* Articles */}
      <h2 className="text-xl font-semibold mb-4">Articles</h2>
      <div className="space-y-4 mb-10">
        {articles.map((a, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-1">{a.title}</h3>
            <p>{a.content}</p>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <h2 className="text-xl font-semibold mb-4">Philosophy of Kindness</h2>
      <div className="bg-purple-800 p-6 rounded-xl">
        <p className="text-lg">
          At DoGood, kindness is not a transaction — it is a way of life. We believe that every act of good creates ripples
          that change the world for the better. Help because you care, not because you're asked.
        </p>
      </div>
    </div>
  );
}