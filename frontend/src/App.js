import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OnboardingWizard from './OnboardingWizard';
import AdminPanel from './AdminPanel.js';
import DataTable from './DataTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingWizard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/data" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
