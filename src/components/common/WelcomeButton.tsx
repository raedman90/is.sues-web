interface WelcomeButtonProps {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    onClick: () => void;
  }
  
  const WelcomeButton: React.FC<WelcomeButtonProps> = ({
    title,
    backgroundColor = "bg-blue-600",
    textColor = "text-white",
    onClick,
  }) => {
    return (
      <button
        className={`w-full py-3 px-6 rounded-lg font-bold transition duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${backgroundColor} ${textColor}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  };
  
  export default WelcomeButton;
  