import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateWallet from "./pages/CreateWallet";
import MusicPreview from "./pages/MusicPreview";
import DaoVoting from "./pages/DaoVoting";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/music-preview" element={<MusicPreview />} />
        <Route path="/dao-voting" element={<DaoVoting />} />
      </Routes>
    </Router>
  );
}
