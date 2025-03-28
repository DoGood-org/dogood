import { useEffect, useState } from 'react';

export default function Verification() {
  const [document, setDocument] = useState('');
  const [status, setStatus] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const requestVerification = () => {
    fetch('http://localhost:5000/api/verification/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ document })
    })
    .then(res => res.json())
    .then(() => setStatus('Запрос отправлен'))
    .catch(console.error);
  };

  return (
    <div>
      <h1>Верификация</h1>
      <input type="text" placeholder="URL документа" onChange={(e) => setDocument(e.target.value)} />
      <button onClick={requestVerification}>Отправить запрос</button>
      {status && <p>{status}</p>}
    </div>
  );
}
