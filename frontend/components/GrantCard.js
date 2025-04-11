// components/GrantCard.js
export default function GrantCard({ grant }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-4">
      <h2 className="text-xl font-semibold mb-1">{grant.title}</h2>
      <p className="text-sm text-teal-300 mb-2">Deadline: {grant.deadline}</p>
      <p className="mb-3">{grant.description}</p>
      <button className="px-4 py-2 bg-teal-500 text-black rounded hover:bg-teal-400 text-sm">
        Apply Now
      </button>
    </div>
  );
}
