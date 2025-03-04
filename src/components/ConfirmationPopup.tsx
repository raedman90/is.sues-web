"use client";

import React from "react";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#25272B] p-6 rounded-lg shadow-lg text-white text-center">
        <h2 className="text-lg font-bold mb-4">{message}</h2>
        <div className="flex justify-center gap-4">
          <button className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
