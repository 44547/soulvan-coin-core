import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-soulvan-purple text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold mb-4 tracking-wide">Soulvan Universe</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Enter a cinematic crypto ecosystem powered by AI, music, NFTs, and decentralized identity.
      </p>
      <Link to="/create-wallet" className="bg-soulvan-purple hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition">
        Begin Your Journey
      </Link>
    </div>
  );
}
