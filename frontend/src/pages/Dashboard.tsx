import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, Users, ArrowRight, Copy, Search } from "lucide-react"
import api from "../lib/api"
import CreateCampaignModal from "../components/CreateCampaignModal"
import JoinCampaignModal from "../components/JoinCampaignModal"
import { useAuth } from "../context/AuthContext"

interface Campaign {
    id: string
    name: string
    description: string
    inviteCode: string
    setting: string
    characters: any[]
}

export default function Dashboard() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    const fetchCampaigns = async () => {
        try {
            // const endpoint = user?.role === 'game_master' ? '/campaigns' : '/campaigns/joined'
            // Note: We need to implement /campaigns/joined on backend or reuse /campaigns if it handles both
            // For now, let's assume /campaigns returns created campaigns for GM and joined for Player
            // But actually, the current backend /campaigns only returns created ones.
            // We will fix backend soon.
            const response = await api.get('/campaigns')
            setCampaigns(response.data)
        } catch (error) {
            console.error("Failed to fetch campaigns", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [user])

    const copyInviteCode = (code: string) => {
        navigator.clipboard.writeText(code)
        alert(`Invite code ${code} copied to clipboard!`)
    }

    const isGM = user?.role === 'game_master'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isGM ? "My Campaigns" : "Joined Campaigns"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isGM ? "Manage your active adventures" : "Adventures you are participating in"}
                    </p>
                </div>
                {isGM ? (
                    <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                ) : (
                    <Button className="gap-2" onClick={() => setIsJoinModalOpen(true)}>
                        <Search className="h-4 w-4" />
                        Join Campaign
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                        {isGM ? <Plus className="h-8 w-8" /> : <Search className="h-8 w-8" />}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        {isGM
                            ? "Start your journey by creating your first campaign. Invite players and manage your story."
                            : "You haven't joined any campaigns yet. Ask your GM for an invite code!"}
                    </p>
                    {isGM ? (
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create Campaign</Button>
                    ) : (
                        <Button onClick={() => setIsJoinModalOpen(true)}>Join Campaign</Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/50 group">
                            <div className="relative h-32 bg-gradient-to-br from-primary/20 to-background p-6 flex items-center justify-center">
                                <h3 className="text-4xl font-bold text-primary/20 select-none">{campaign.name.charAt(0)}</h3>
                                {isGM && (
                                    <div className="absolute bottom-4 right-4">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => copyInviteCode(campaign.inviteCode)}
                                        >
                                            <Copy className="h-3 w-3" />
                                            {campaign.inviteCode}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{campaign.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{campaign.description || "No description"}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{campaign.characters?.length || 0} Players</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">
                                            {campaign.setting || "System Agnostic"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/50 p-4">
                                <Button variant="ghost" className="w-full gap-2 group-hover:text-primary">
                                    {isGM ? "Manage Campaign" : "Play"}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchCampaigns}
            />

            <JoinCampaignModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onSuccess={fetchCampaigns}
            />
        </div>
    )
}
