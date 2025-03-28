import { useEffect, useState } from 'react';

export default function CSR() {
  const [programs, setPrograms] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetch('http://localhost:5000/api/csr')
      .then(res => res.json())
      .then(setPrograms)
      .catch(console.error);
  }, []);

  const joinProgram = (id) => {
    fetch('http://localhost:5000/api/csr/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ programId: id })
    })
    .then(res => res.json())
    .then(() => alert('Вы участвуете в программе'))
    .catch(console.error);
  };

  return (
    <div>
      <h1>Корпоративные программы CSR</h1>
      {programs.map(program => (
        <div key={program._id}>
          <h3>{program.title}</h3>
          <p>{program.description}</p>
          <p>Организатор: {program.company.name}</p>
          <button onClick={() => joinProgram(program._id)}>Принять участие</button>
        </div>
      ))}
    </div>
  );
}
