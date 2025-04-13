import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MyPosts from '../components/MyPosts';
import MyGoodDeeds from '../components/MyGoodDeeds';
import MyHelpHours from '../components/MyHelpHours';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['posts', 'deeds', 'hours'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'deeds':
        return <MyGoodDeeds />;
      case 'hours':
        return <MyHelpHours />;
      default:
        return <MyPosts />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={\`px-4 py-2 rounded \${activeTab === 'posts' ? 'bg-teal-500 text-white' : 'bg-gray-200'}\`}
            onClick={() => {
              setActiveTab('posts');
              window.location.hash = 'posts';
            }}
          >
            My Posts
          </button>
          <button
            className={\`px-4 py-2 rounded \${activeTab === 'deeds' ? 'bg-teal-500 text-white' : 'bg-gray-200'}\`}
            onClick={() => {
              setActiveTab('deeds');
              window.location.hash = 'deeds';
            }}
          >
            My Good Deeds
          </button>
          <button
            className={\`px-4 py-2 rounded \${activeTab === 'hours' ? 'bg-teal-500 text-white' : 'bg-gray-200'}\`}
            onClick={() => {
              setActiveTab('hours');
              window.location.hash = 'hours';
            }}
          >
            My Help Hours
          </button>
        </div>

        {renderTab()}
      </div>
    </Layout>
  );
}
