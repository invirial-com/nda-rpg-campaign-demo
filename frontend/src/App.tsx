import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DevConsole from './pages/DevConsole'
import CampaignsList from './pages/CampaignsList'
import CampaignDetails from './pages/CampaignDetails'
import CharactersList from './pages/CharactersList'
import DashboardLayout from './layouts/DashboardLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'sonner'

// Protected Route Component
const RequireAuth = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Dashboard Routes */}
                    <Route element={<RequireAuth />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/campaigns" element={<CampaignsList />} />
                            <Route path="/campaigns/:id" element={<CampaignDetails />} />
                            <Route path="/characters" element={<CharactersList />} />
                            <Route path="/dev" element={<DevConsole />} />
                        </Route>
                    </Route>

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
            <Toaster />
        </AuthProvider>
    )
}

export default App
