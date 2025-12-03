import { useState } from "react";
import { hashPhoto, createSoulvanWallet } from "../utils/wallet";

export default function CreateWallet() {
  const [photo, setPhoto] = useState(null);
  const [genre, setGenre] = useState("trap");
  const [mood, setMood] = useState("dark");

  const handleSubmit = async () => {
    if (!photo) return;
    const metadata = { genre, mood, photoHash: await hashPhoto(photo) };
    const wallet = await createSoulvanWallet(metadata);
    console.log("Wallet created:", wallet);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h2 className="text-3xl font-bold mb-4">Create Your Soulvan Wallet</h2>
      <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="mb-4" />
      <select value={genre} onChange={(e) => setGenre(e.target.value)} className="mb-2 p-2 bg-gray-800 rounded">
        <option value="trap">Trap</option>
        <option value="afrobeat">Afrobeat</option>
        <option value="techno">Techno</option>
      </select>
      <select value={mood} onChange={(e) => setMood(e.target.value)} className="mb-4 p-2 bg-gray-800 rounded">
        <option value="dark">Dark</option>
        <option value="uplifting">Uplifting</option>
        <option value="mystical">Mystical</option>
      </select>
      <button onClick={handleSubmit} className="bg-soulvan-purple hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">
        Mint Wallet Identity
      </button>
    </div>
  );
}
