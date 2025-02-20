import Image from "next/image";

const WelcomeHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <Image
        src="/images/bg1.png"
        alt="Background"
        width={250}
        height={250}
        className="rounded-2xl mx-auto shadow-md"
      />
      <h1 className="text-3xl font-bold text-blue-900">Bem-vindo ao Is.sues</h1>
      <p className="text-lg text-gray-600">Escolha uma opção abaixo para começar</p>
    </div>
  );
};

export default WelcomeHeader;
