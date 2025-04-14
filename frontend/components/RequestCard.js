import React from "react";

const RequestCard = ({ request }) => {
  const { name, category, description, location, date } = request;

  return (
    <div className="border rounded-lg shadow p-4 bg-black">
      <h3 className="text-lg font-bold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-2">{category} · {location}</p>
      <p className="mb-2">{description}</p>
      <p className="text-sm text-gray-400">{date}</p>
    </div>
  );
};

export default RequestCard;
