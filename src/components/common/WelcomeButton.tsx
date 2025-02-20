interface WelcomeButtonProps {
    title: string;
    backgroundColor?: string;
    textColor?: string;
    onClick: () => void;
  }
  
  const WelcomeButton: React.FC<WelcomeButtonProps> = ({
    title,
    backgroundColor = "#000",
    textColor = "#fff",
    onClick,
  }) => {
    return (
      <button
        className="w-full py-3 px-6 rounded-lg font-bold transition duration-300 hover:opacity-80"
        style={{ backgroundColor, color: textColor }}
        onClick={onClick}
      >
        {title}
      </button>
    );
  };
  
  export default WelcomeButton;
  