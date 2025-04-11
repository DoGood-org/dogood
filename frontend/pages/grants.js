// pages/grants.js
import { useState } from 'react';

const sampleGrants = [
  { id: 1, title: 'Local Community Help Fund', deadline: '2025-06-01', description: 'Support for grassroots social initiatives.' },
  { id: 2, title: 'Youth Volunteer Grant', deadline: '2025-07-15', description: 'Funding for teen-led volunteer projects.' },
];

const sampleRecipients = [
  { name: 'GreenHands Berlin', amount: 1200, report: 'park-cleanup.pdf' },
  { name: 'Youth Impact Group', amount: 800, report: 'mentoring-summary.pdf' },
];

export default function GrantsPage() {
  const [tab, setTab] = useState('list');
  const [form, setForm] = useState({ name: '', project: '', file: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, file: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Grant application submitted:', form);
    alert('Application submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Grants & Support</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button onClick={() => setTab('list')} className={`${tab === 'list' ? 'border-b-2 border-teal-400 font-semibold' : 'text-gray-400'}`}>Grants List</button>
        <button onClick={() => setTab('apply')} className={`${tab === 'apply' ? 'border-b-2 border-teal-400 font-semibold' : 'text-gray-400'}`}>Apply</button>
        <button onClick={() => setTab('recipients')} className={`${tab === 'recipients' ? 'border-b-2 border-teal-400 font-semibold' : 'text-gray-400'}`}>Recipients</button>
      </div>

      {/* Tab Content */}
      {tab === 'list' && (
        <div className="space-y-4">
          {sampleGrants.map((grant) => (
            <div key={grant.id} className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-xl font-semibold">{grant.title}</h2>
              <p className="text-sm text-teal-300">Deadline: {grant.deadline}</p>
              <p>{grant.description}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'apply' && (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <input
            name="name"
            placeholder="Your Name / Organization"
            required
            onChange={handleChange}
            className="w-full p-3 text-black rounded"
          />
          <textarea
            name="project"
            placeholder="Describe your project..."
            required
            onChange={handleChange}
            className="w-full p-3 text-black rounded h-40"
          />
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded"
          />
          <button type="submit" className="bg-teal-500 text-black px-6 py-2 rounded hover:bg-teal-400">
            Submit Application
          </button>
        </form>
      )}

      {tab === 'recipients' && (
        <div className="space-y-4">
          {sampleRecipients.map((r, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-xl">
              <p className="text-lg font-semibold">{r.name}</p>
              <p className="text-sm">Received: €{r.amount}</p>
              <p className="text-sm text-teal-300">Report: {r.report}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}