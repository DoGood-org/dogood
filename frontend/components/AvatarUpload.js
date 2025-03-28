import { useState } from 'react';
import axios from 'axios';

const AvatarUpload = () => {
  const [avatar, setAvatar] = useState(null);

  const handleChange = async (e) => {
    const formData = new FormData();
    formData.append('avatar', e.target.files[0]);

    const res = await axios.post('/api/user/avatar', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    setAvatar(res.data.avatar);
  };

  return (
    <div className="flex items-center space-x-4">
      <img src={avatar || '/default-avatar.png'} className="h-20 w-20 rounded-full" alt="Avatar" />
      <input type="file" onChange={handleChange} accept="image/*" />
    </div>
  );
};

export default AvatarUpload;
