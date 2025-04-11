// components/IconGrid.js
const iconList = [
  { name: "Donations", path: "/icons/icon-donations.png" },
  { name: "Chat", path: "/icons/icon-chat.png" },
  { name: "Elderly", path: "/icons/icon-elderly.png" },
  { name: "Environment", path: "/icons/icon-environment.png" },
  { name: "Education", path: "/icons/icon-education.png" },
  { name: "Food", path: "/icons/icon-food.png" },
  { name: "Grants", path: "/icons/icon-grants.png" },
  { name: "Help", path: "/icons/icon-help.png" },
  { name: "Home", path: "/icons/icon-home.png" },
  { name: "Impact", path: "/icons/icon-impact.png" },
  { name: "Leaderboard", path: "/icons/icon-leaderboard.png" },
  { name: "Like", path: "/icons/icon-like.png" },
  { name: "Medicine", path: "/icons/icon-medicine.png" },
  { name: "Mentor", path: "/icons/icon-mentor.png" },
  { name: "MyDeeds", path: "/icons/icon-mydeeds.png" },
  { name: "Notifications", path: "/icons/icon-notifications.png" },
  { name: "Profile", path: "/icons/icon-profile.png" },
  { name: "Request", path: "/icons/icon-request.png" },
  { name: "Settings", path: "/icons/icon-settings.png" },
  { name: "Share", path: "/icons/icon-share.png" },
  { name: "Transport", path: "/icons/icon-transport.png" },
  { name: "Volunteering", path: "/icons/icon-volunteering.png" },
  { name: "Wallet", path: "/icons/icon-wallet.png" },
  { name: "Achievements", path: "/icons/icon-achievements.png" },
];

const IconGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {iconList.map((icon) => (
        <div key={icon.name} className="flex flex-col items-center">
          <img src={icon.path} alt={icon.name} className="w-10 h-10 mb-2" />
          <span className="text-sm">{icon.name}</span>
        </div>
      ))}
    </div>
  );
};

export default IconGrid;
