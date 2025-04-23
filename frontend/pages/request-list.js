"use client";

import { useEffect, useState } from "react";
import RequestListSection from "@/components/RequestListSection";
import CreateRequestForm from "@/components/CreateRequestForm";

export default function RequestListPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/requests`)
        .then((res) => res.json())
        .then((data) => setRequests(data));
  }, []);

  const handleNewRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  return (
      <div className="min-h-screen bg-gray-50 p-4">
        <CreateRequestForm onSuccess={handleNewRequest} />
        <RequestListSection requests={requests} />
      </div>
  );
}
