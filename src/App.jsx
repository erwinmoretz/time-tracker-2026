import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MonthPage from './pages/MonthPage';
import YearView from './pages/YearView';
import OverviewPage from './pages/OverviewPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/month" replace />} />
          <Route path="/month" element={<MonthPage />} />
          <Route path="/year" element={<YearView />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="*" element={<Navigate to="/month" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
