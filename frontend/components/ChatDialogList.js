// ChatDialogList.js — mock list of user dialogs for chat
export default function ChatDialogList({ onSelect }) {
  const mockDialogs = [
    { id: 1, name: "Julia", lastMessage: "Looking forward to Sunday!" },
    { id: 2, name: "Max", lastMessage: "Do you need more volunteers?" },
    { id: 3, name: "Elena", lastMessage: "Thanks for your help yesterday!" },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-[1490] w-72 bg-white text-black rounded-xl shadow-xl overflow-hidden">
      <div className="bg-teal-600 text-white px-4 py-2 font-semibold">Messages</div>
      <ul className="divide-y divide-gray-200">
        {mockDialogs.map((dialog) => (
          <li
            key={dialog.id}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(dialog.name)}
          >
            <div className="font-bold text-sm">{dialog.name}</div>
            <div className="text-xs text-gray-600 truncate">{dialog.lastMessage}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
