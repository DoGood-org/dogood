// components/ChatBubble.js
export default function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser ? 'bg-teal-500 text-black' : 'bg-gray-700 text-white'
        }`}
      >
        {message}
      </div>
    </div>
  );
}