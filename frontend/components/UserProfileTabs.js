
import { useState } from 'react';
import MyPosts from './MyPosts';
import MyGoodDeeds from './MyGoodDeeds';
import MyHelpHours from './MyHelpHours';
import KarmaPoints from "../components/KarmaPoints";
import Achievements from "../components/Achievements";
import FriendsList from "../components/FriendsList";
import ActivityCalendar from "../components/ActivityCalendar";
import NotificationsPanel from "../components/NotificationsPanel";

const tabs = [
    { name: 'My Posts', component: <MyPosts /> },
    { name: 'My Good Deeds', component: <MyGoodDeeds /> },
    { name: 'My Help Hours', component: <MyHelpHours /> },
    { name: 'My Friends', component: <FriendsList /> },
    { name: 'Activity', component: <ActivityCalendar /> },
    { name: 'Notifications', component: <NotificationsPanel /> },
];

const UserProfileTabs = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <KarmaPoints />
            <Achievements />

            <nav className="flex space-x-4 border-b mt-6">
                {tabs.map((tabItem, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={\`py-2 \${activeTab === index ? 'border-b-2 border-indigo-500 font-semibold' : ''}\`}
                    >
                        {tabItem.name}
                    </button>
                ))}
            </nav>
            <div className="mt-4">
                {tabs[activeTab].component}
            </div>
        </div>
    );
};

export default UserProfileTabs;
