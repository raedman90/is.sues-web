interface ConfirmPasswordInputProps {
    value: string;
    onChange: (text: string) => void;
  }
  
  const ConfirmPasswordInput: React.FC<ConfirmPasswordInputProps> = ({ value, onChange }) => {
    return (
      <input
        type="password"
        placeholder="Confirme sua senha"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="new-password"
      />
    );
  };
  
  export default ConfirmPasswordInput;
  