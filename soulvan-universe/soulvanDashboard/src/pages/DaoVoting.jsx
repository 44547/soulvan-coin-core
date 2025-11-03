import { useEffect, useState } from "react";

export default function DaoVoting() {
  const [proposals, setProposals] = useState([]);
  const [voted, setVoted] = useState({});

  useEffect(() => {
    fetch("/api/dao/proposals").then(res => res.json()).then(setProposals);
  }, []);

  const handleVote = async (id) => {
    await fetch(`/api/dao/vote/${id}`, { method: "POST" });
    setVoted({ ...voted, [id]: true });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">SoulvanDAO Voting</h2>
      <ul className="space-y-4">
        {proposals.map(p => (
          <li key={p.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-lg">{p.description}</p>
            <button
              disabled={voted[p.id]}
              onClick={() => handleVote(p.id)}
              className={`mt-2 px-4 py-2 rounded ${voted[p.id] ? "bg-gray-600" : "bg-soulvan-purple hover:bg-purple-700"}`}
            >
              {voted[p.id] ? "Voted" : "Vote"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
