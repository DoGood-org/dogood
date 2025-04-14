import React from "react";
import RequestCard from "./RequestCard";

const RequestListSection = ({ title = "Active Requests", requests = [] }) => {
  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request, index) => (
          <RequestCard key={index} request={request} />
        ))}
      </div>
    </section>
  );
};

export default RequestListSection;
