import { useEffect, useState } from 'react';

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': token }
    })
        .then(res => res.json())
        .then(setUsers)
        .catch(console.error);

    fetch('http://localhost:5000/api/friends', {
      headers: { 'Authorization': token }
    })
        .then(res => res.json())
        .then(setFriends)
        .catch(console.error);
  }, [token]);

  const sendRequest = (id) => {
    fetch('http://localhost:5000/api/friends/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ friendId: id })
    }).then(() => alert('Заявка отправлена'));
  };

  const acceptRequest = (id) => {
    fetch('http://localhost:5000/api/friends/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ friendId: id })
    }).then(() => alert('Вы теперь друзья'));
  };

  return (
      <div>
        <h1>Друзья</h1>
        <h2>Все пользователи</h2>
        {users.map(user => (
            <div key={user._id}>
              {user.name} <button onClick={() => sendRequest(user._id)}>Добавить в друзья</button>
            </div>
        ))}
        <h2>Ваши друзья</h2>
        {friends.map(friend => <div key={friend._id}>{friend.name}</div>)}
      </div>
  );
}
