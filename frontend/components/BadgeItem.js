// components/BadgeItem.js
export default function BadgeItem({ badge }) {
  return (
    <div className={`p-4 rounded-xl bg-gray-800 ${!badge.earned && 'opacity-50'} relative`}>
      <img
        src={badge.image}
        alt={badge.name}
        className="w-full h-40 object-contain rounded mb-3"
      />
      <h2 className="text-xl font-semibold mb-1">{badge.name}</h2>
      <p className="text-sm mb-3">{badge.description}</p>

      {badge.earned ? (
        <div className="flex gap-2">
          <button className="bg-teal-500 text-black px-3 py-1 rounded hover:bg-teal-400 text-sm">
            Mint as NFT
          </button>
          <button className="bg-purple-500 text-black px-3 py-1 rounded hover:bg-purple-400 text-sm">
            Share
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Locked</p>
      )}
    </div>
  );
}
