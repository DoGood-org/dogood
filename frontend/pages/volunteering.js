import { useEffect, useState } from 'react';

export default function Volunteering() {
  const [initiatives, setInitiatives] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/volunteering')
      .then(res => res.json())
      .then(setInitiatives);
  }, []);

  return (
    <div>
      <h1>Волонтёрские инициативы</h1>
      {initiatives.map(init => (
        <div key={init._id}>
          <h3>{init.title}</h3>
          <p>{init.description}</p>
        </div>
      ))}
    </div>
  );
}
