// pages/messages.js
import { useState } from 'react';

const sampleChats = [
  { id: 1, name: 'Alice', messages: ['Hi!', 'Thanks for helping yesterday!'] },
  { id: 2, name: 'Volunteer Group', messages: ['Reminder: cleanup event at 10am!'] },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(sampleChats[0]);
  const [newMsg, setNewMsg] = useState("");

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    selected.messages.push(newMsg);
    setNewMsg("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex gap-6">
      {/* Chat List */}
      <div className="w-1/3 space-y-3">
        <h2 className="text-xl font-semibold mb-3">Chats</h2>
        {sampleChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => setSelected(chat)}
            className={`p-3 rounded-xl cursor-pointer hover:bg-gray-700 ${selected.id === chat.id ? 'bg-gray-800' : 'bg-gray-700'}`}
          >
            {chat.name}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-3">{selected.name}</h2>
        <div className="flex-1 bg-gray-800 p-4 rounded-xl mb-4 overflow-y-auto space-y-2">
          {selected.messages.map((msg, i) => (
            <div key={i} className="bg-gray-700 p-2 rounded w-fit max-w-xs">
              {msg}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 text-black rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-teal-400 text-black px-4 py-2 rounded hover:bg-teal-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}