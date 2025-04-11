// pages/badges.js
const sampleBadges = [
  {
    id: 1,
    name: 'Kindness Starter',
    description: 'First act of kindness recorded.',
    image: '/badges/kindness-starter.png',
    earned: true
  },
  {
    id: 2,
    name: 'GoodBot Helper',
    description: 'Used GoodBot to assist others.',
    image: '/badges/goodbot-helper.png',
    earned: false
  },
  {
    id: 3,
    name: 'Community Builder',
    description: 'Started a volunteer initiative.',
    image: '/badges/community-builder.png',
    earned: true
  },
];

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Badges</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sampleBadges.map(badge => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl bg-gray-800 ${!badge.earned && 'opacity-50'} relative`}
          >
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
        ))}
      </div>
    </div>
  );
}