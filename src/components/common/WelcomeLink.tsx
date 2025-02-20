interface WelcomeLinkProps {
    onClick: () => void;
    title: string;
  }
  
  const WelcomeLink: React.FC<WelcomeLinkProps> = ({ onClick, title }) => {
    return (
      <button
        onClick={onClick}
        className="text-gray-500 text-lg font-medium underline hover:text-gray-700 transition"
      >
        {title}
      </button>
    );
  };
  
  export default WelcomeLink;
  