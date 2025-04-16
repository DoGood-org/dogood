// TabContents.js

export function TasksTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Today's Tasks</h2>
      <ul className="space-y-2">
        <li className="bg-white text-black rounded p-4 shadow">
          🧹 Help clean up the community park – 15:00, Central Park
        </li>
        <li className="bg-white text-black rounded p-4 shadow">
          🧺 Deliver food parcels to seniors – 17:30, East Side
        </li>
      </ul>
    </div>
  );
}

export function RequestsTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Help Requests</h2>
      <ul className="space-y-2">
        <li className="bg-white text-black rounded p-4 shadow">
          🙏 Anna is looking for someone to help carry groceries – near Green Street
        </li>
        <li className="bg-white text-black rounded p-4 shadow">
          🧒 Local shelter needs volunteers for Sunday activities with kids
        </li>
      </ul>
    </div>
  );
}

export function ProfileTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Profile</h2>
      <p className="bg-white text-black rounded p-4 shadow">
        🌟 You’ve helped 6 people this week. Keep it up!
      </p>
      <p className="bg-white text-black rounded p-4 shadow">
        🎖️ Badges: Kind Helper, Fast Responder
      </p>
    </div>
  );
}
