/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateMission from './pages/CreateMission';
import History from './pages/History';
import PreviewMission from './pages/PreviewMission';
import CreateAutorisation from './pages/CreateAutorisation';
import PreviewAutorisation from './pages/PreviewAutorisation';
import CreateProcesVerbal from './pages/CreateProcesVerbal';
import PreviewProcesVerbal from './pages/PreviewProcesVerbal';

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans print:bg-white print:h-auto">
        <Sidebar />
        <main className="flex-1 overflow-y-auto print:overflow-visible">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateMission />} />
            <Route path="/create-autorisation" element={<CreateAutorisation />} />
            <Route path="/create-proces-verbal" element={<CreateProcesVerbal />} />
            <Route path="/history" element={<History />} />
            <Route path="/preview/:id" element={<PreviewMission />} />
            <Route path="/preview-autorisation/:id" element={<PreviewAutorisation />} />
            <Route path="/preview-proces-verbal/:id" element={<PreviewProcesVerbal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
