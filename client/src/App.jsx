import { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import CampaignsPage from './pages/CampaignsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5000', []);

  return (
    <div className="min-h-screen bg-midnight text-white flex">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} apiUrl={apiUrl} />
        <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-midnight via-slateGray/40 to-midnight">
          <Routes>
            <Route path="/" element={<Home apiUrl={apiUrl} />} />
            <Route path="/leads" element={<LeadsPage apiUrl={apiUrl} />} />
            <Route path="/templates" element={<TemplatesPage apiUrl={apiUrl} />} />
            <Route path="/campaigns" element={<CampaignsPage apiUrl={apiUrl} />} />
            <Route path="/analytics" element={<AnalyticsPage apiUrl={apiUrl} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

