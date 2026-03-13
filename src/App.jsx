import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import './index.css';

const MonthPage    = lazy(() => import('./pages/MonthPage'));
const WeekPage     = lazy(() => import('./pages/WeekPage'));
const YearView     = lazy(() => import('./pages/YearView'));
const OverviewPage = lazy(() => import('./pages/OverviewPage'));

const PageLoader = () => (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm uppercase tracking-widest animate-pulse">
        Laden...
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/"         element={<Navigate to="/month" replace />} />
                        <Route path="/month"    element={<MonthPage />} />
                        <Route path="/week"     element={<WeekPage />} />
                        <Route path="/year"     element={<YearView />} />
                        <Route path="/overview" element={<OverviewPage />} />
                        <Route path="*"         element={<Navigate to="/month" replace />} />
                    </Routes>
                </Suspense>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
