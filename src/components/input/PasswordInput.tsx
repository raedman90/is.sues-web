interface PasswordInputProps {
    value: string;
    onChange: (text: string) => void;
  }
  
  const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
    return (
      <input
        type="password"
        placeholder="Digite sua senha"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="current-password"
      />
    );
  };
  
  export default PasswordInput;
  