"use client";

import { FaTag } from "react-icons/fa";
import { MdCheckCircle, MdError } from "react-icons/md";

interface IssueCardProps {
  title: string;
  description: string;
  labels: string[];
  status: boolean; // false = aberta, true = fechada
}

export default function IssueCard({ title, description, labels, status }: IssueCardProps) {
  return (
    <div className="bg-[#25282E] p-4 rounded-lg shadow-md border border-gray-700">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {status ? (
          <span className="flex items-center text-red-400">
            <MdError size={20} className="mr-1" />
            Fechada
          </span>
        ) : (
          <span className="flex items-center text-green-400">
            <MdCheckCircle size={20} className="mr-1" />
            Aberta
          </span>
        )}
      </div>

      {/* Descrição */}
      <p className="text-gray-400 text-sm mt-2">{description}</p>

      {/* Labels */}
      <div className="flex flex-wrap gap-2 mt-3">
        {labels.map((label, index) => (
          <span key={index} className="flex items-center bg-[#3B3F45] text-gray-300 text-xs px-2 py-1 rounded-md">
            <FaTag size={12} className="mr-1" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
