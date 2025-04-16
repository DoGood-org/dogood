
import React from "react";
import RequestListSection from "@/components/RequestListSection";


const fakeRequests = [
  {
    name: "Олена Петрова",
    category: "Продукти",
    description: "Потрібна допомога з доставкою продуктів для мами.",
    location: "Львів",
    date: "2024-04-14"
  },
  {
    name: "Іван Коваль",
    category: "Техніка",
    description: "Потрібен ноутбук для навчання дитини.",
    location: "Київ",
    date: "2024-04-13"
  },
  {
    name: "Марія Сидоренко",
    category: "Одяг",
    description: "Потрібен теплий одяг для дітей.",
    location: "Харків",
    date: "2024-04-12"
  },
  {
    name: "Андрій Шевченко",
    category: "Переїзд",
    description: "Потрібна допомога з перевезенням речей.",
    location: "Одеса",
    date: "2024-04-11"
  }
];


const RequestListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RequestListSection requests={fakeRequests} />
    </div>
  );
};


export default RequestListPage;



