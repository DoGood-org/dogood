import { useState, useEffect } from 'react';
import AvatarUpload from '../components/AvatarUpload';
import UserProfileTabs from '../components/UserProfileTabs';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setUser(res.data);
        };
        fetchProfile();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Мой профиль</h1>
            <AvatarUpload />
            <UserProfileTabs />
        </div>
    );
};

export default ProfilePage;
