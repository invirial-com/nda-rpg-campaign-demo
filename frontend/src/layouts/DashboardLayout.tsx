import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import {
    LayoutDashboard,
    Users,
    Sword,
    LogOut,
    Menu,
    X,
    Map,
    Terminal
} from "lucide-react"
import { cn } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const location = useLocation()
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xl text-primary">
                            <Sword className="h-6 w-6" />
                            <span>NdaCampaignDemo</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)}>
                            <Button
                                variant={location.pathname === "/dashboard" ? "secondary" : "ghost"}
                                className="w-full justify-start gap-3"
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link to="/campaigns" onClick={() => setIsSidebarOpen(false)}>
                            <Button
                                variant={location.pathname === "/campaigns" ? "secondary" : "ghost"}
                                className="w-full justify-start gap-3"
                            >
                                <Map className="h-5 w-5" />
                                Campaigns
                            </Button>
                        </Link>
                        <Link to="/characters" onClick={() => setIsSidebarOpen(false)}>
                            <Button
                                variant={location.pathname === "/characters" ? "secondary" : "ghost"}
                                className="w-full justify-start gap-3"
                            >
                                <Users className="h-5 w-5" />
                                Characters
                            </Button>
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/dev" onClick={() => setIsSidebarOpen(false)}>
                                <Button
                                    variant={location.pathname === "/dev" ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                    <Terminal className="h-5 w-5" />
                                    Dev Console
                                </Button>
                            </Link>
                        )}
                    </nav>

                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b flex items-center px-4 justify-between bg-card">
                    <div className="flex items-center gap-2 font-bold text-lg text-primary">
                        <Sword className="h-5 w-5" />
                        <span>NdaCampaignDemo</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
