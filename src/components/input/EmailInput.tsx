interface EmailInputProps {
    value: string;
    onChange: (text: string) => void;
  }
  
  const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
    return (
      <input
        type="email"
        placeholder="Digite seu email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="email"
      />
    );
  };
  
  export default EmailInput;
  