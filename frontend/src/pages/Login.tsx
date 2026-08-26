import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Sword, Shield, Scroll } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import api from "../lib/api"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await api.post('/auth/login', { email, password })
            const { access_token } = response.data

            // Fetch user profile
            const profileResponse = await api.get('/users/profile', {
                headers: { Authorization: `Bearer ${access_token}` }
            })

            login(access_token, profileResponse.data)
            navigate('/dashboard')
        } catch (error) {
            console.error("Login failed", error)
            alert("Login failed! Please check your credentials.")
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
                            <Sword size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">NdaCampaignDemo</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the realm
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Casting spell..." : "Enter Realm"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-medium hover:underline">
                            Join the adventure
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
