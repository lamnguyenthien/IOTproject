import React from "react";

const Card = ({ title, value, icon }) => (
  <div className="bg-white p-6 shadow-lg rounded-lg flex justify-between items-center">
    <div>
      <div className="text-blue-500 text-3xl font-semibold">{value}</div>
      <div className="text-gray-800 text-lg">{title}</div>
    </div>
    <div className="text-gray-400 text-5xl">
      {icon}
    </div>
  </div>
);

export default Card;