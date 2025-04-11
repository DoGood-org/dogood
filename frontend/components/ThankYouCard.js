// components/ThankYouCard.js
export default function ThankYouCard({ thank }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-4">
      <div className="text-2xl mb-2">{thank.emoji}</div>
      <p className="text-sm text-teal-300 mb-1">To: {thank.to}</p>
      <p className="italic">"{thank.message}"</p>
      <div className="mt-3">
        <button className="px-3 py-1 bg-purple-500 text-black rounded hover:bg-purple-400 text-sm">Share</button>
      </div>
    </div>
  );
}