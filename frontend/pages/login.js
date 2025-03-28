import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("📤 Отправляем данные:", form);
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("📥 Ответ сервера:", data);

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.msg || 'Ошибка входа');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
      <div>
        <h1>Вход</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Пароль" onChange={handleChange} required />
          <button type="submit">Войти</button>
        </form>
      </div>
  );
}
