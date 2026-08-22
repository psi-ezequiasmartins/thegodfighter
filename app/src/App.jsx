/**
 * src/App.jsx
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Events from './pages/Events.jsx';
import Fights from './pages/Fights.jsx';
import PredictionFlow from './pages/PredictionFlow.jsx';
import Ranking from './pages/Ranking.jsx';
import MeusPalpites from './pages/MeusPalpites.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/events/:id" element={<Layout><Fights /></Layout>} />
        <Route path="/fight/:id" element={<Layout><PredictionFlow /></Layout>} />
        <Route path="/ranking" element={<Layout><Ranking /></Layout>} />
        <Route path="/profile" element={<Layout><MeusPalpites /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;