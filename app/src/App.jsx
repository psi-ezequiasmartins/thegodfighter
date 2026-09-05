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
import AdminEvents from './pages/AdminEvents.jsx';
import AdminFights from './pages/AdminFights.jsx';
import AdminFighters from './pages/AdminFighters.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminResult from './pages/AdminResult.jsx';
import Layout from './components/Layout.jsx';
import AdminRoute from './components/AdminRoute.jsx';

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
        <Route path="/admin/events" element={<Layout><AdminRoute><AdminEvents /></AdminRoute></Layout>} />
        <Route path="/admin/events/:id/fights" element={<Layout><AdminRoute><AdminFights /></AdminRoute></Layout>} />
        <Route path="/admin/fighters" element={<Layout><AdminRoute><AdminFighters /></AdminRoute></Layout>} />
        <Route path="/admin/users" element={<Layout><AdminRoute><AdminUsers /></AdminRoute></Layout>} />
        <Route path="/admin/fights/:id/result" element={<Layout><AdminRoute><AdminResult /></AdminRoute></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;