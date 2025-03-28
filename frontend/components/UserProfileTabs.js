import { useState } from 'react';
import MyPosts from './MyPosts';
import MyGoodDeeds from './MyGoodDeeds';
import MyHelpHours from './MyHelpHours';

const tabs = [
    { name: 'Мои посты', component: <MyPosts /> },
    { name: 'Мои добрые дела', component: <MyGoodDeeds /> },
    { name: 'Мои часы помощи', component: <MyHelpHours /> },
];

const UserProfileTabs = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <nav className="flex space-x-4 border-b">
                {tabs.map((tabItem, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`py-2 ${activeTab === index ? 'border-b-2 border-indigo-500' : ''}`}
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
