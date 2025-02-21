interface NameInputProps {
    value: string;
    onChange: (text: string) => void;
  }
  
  const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => {
    return (
      <input
        type="text"
        placeholder="Nome completo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };
  
  export default NameInput;
  