import { useState } from "react";

export default function MusicPreview() {
  const [genre, setGenre] = useState("trap");
  const [mood, setMood] = useState("dark");
  const [preview, setPreview] = useState(null);

  const handleGenerate = async () => {
    const result = await fetch(`/api/music?genre=${genre}&mood=${mood}`).then(res => res.json());
    setPreview(result);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <h2 className="text-3xl font-bold mb-4">Preview Your Soulvan Track</h2>
      <div className="flex gap-4 mb-4">
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="p-2 bg-gray-800 rounded">
          <option value="trap">Trap</option>
          <option value="afrobeat">Afrobeat</option>
          <option value="techno">Techno</option>
        </select>
        <select value={mood} onChange={(e) => setMood(e.target.value)} className="p-2 bg-gray-800 rounded">
          <option value="dark">Dark</option>
          <option value="uplifting">Uplifting</option>
          <option value="mystical">Mystical</option>
        </select>
      </div>
      <button onClick={handleGenerate} className="bg-soulvan-purple hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">
        Generate Preview
      </button>
      {preview && (
        <div className="mt-6 text-center">
          <audio controls src={preview.audioUrl} className="mb-4" />
          <img src={preview.visualUrl} alt="Visual" className="rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
