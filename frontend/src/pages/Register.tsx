import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Sword, Shield, Scroll, Crown, User } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../context/AuthContext"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<"player" | "game_master">("player")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        setIsLoading(true)

        try {
            // 1. Register
            await api.post('/auth/register', { name, email, password, role })

            // 2. Auto-login
            const loginResponse = await api.post('/auth/login', { email, password })
            const { access_token } = loginResponse.data

            // 3. Fetch Profile
            const profileResponse = await api.get('/users/profile', {
                headers: { Authorization: `Bearer ${access_token}` }
            })

            login(access_token, profileResponse.data)
            navigate('/dashboard')

        } catch (error) {
            console.error("Registration failed", error)
            alert("Registration failed! Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 transform -rotate-12">
                    <Sword size={200} />
                </div>
                <div className="absolute bottom-10 right-10 transform rotate-12">
                    <Shield size={200} />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
                    <Scroll size={400} />
                </div>
            </div>

            <Card className="w-full max-w-md z-10 border-primary/20 shadow-2xl shadow-primary/10">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <Scroll size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Join the Adventure</CardTitle>
                    <CardDescription>
                        Create your account to start managing campaigns
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Tabs defaultValue="player" className="w-full" onValueChange={(v) => setRole(v as any)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="player" className="flex gap-2">
                                    <User className="h-4 w-4" /> Player
                                </TabsTrigger>
                                <TabsTrigger value="game_master" className="flex gap-2">
                                    <Crown className="h-4 w-4" /> Game Master
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Gandalf the Grey"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="wizard@NdaCampaignDemo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Scribing..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
