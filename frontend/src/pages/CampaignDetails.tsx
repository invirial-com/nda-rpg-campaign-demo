import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Settings, LogOut, Shield, User as UserIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Member {
    id: string;
    userId: string;
    status: string;
    user: User;
}

interface Campaign {
    id: string;
    name: string;
    description: string;
    inviteCode: string;
    gameMasterId: string;
    gameMaster: User;
    members: Member[];
}

export default function CampaignDetails() {
    const { id } = useParams<{ id: string }>();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCampaignDetails();
    }, [id]);

    const fetchCampaignDetails = async () => {
        try {
            const response = await api.get(`/campaigns/${id}`);
            setCampaign(response.data);
        } catch (error) {
            console.error('Failed to fetch campaign details:', error);
            toast.error('Failed to load campaign details');
            navigate('/campaigns');
        } finally {
            setLoading(false);
        }
    };

    const copyInviteCode = () => {
        if (campaign?.inviteCode) {
            navigator.clipboard.writeText(campaign.inviteCode);
            toast.success('Invite code copied to clipboard');
        }
    };

    const handleKickMember = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this player?')) return;
        try {
            await api.delete(`/campaigns/${id}/members/${userId}`);
            toast.success('Player removed');
            fetchCampaignDetails();
        } catch (error) {
            console.error('Failed to remove member:', error);
            toast.error('Failed to remove player');
        }
    };

    const handleLeaveCampaign = async () => {
        if (!confirm('Are you sure you want to leave this campaign?')) return;
        try {
            if (user) {
                await api.delete(`/campaigns/${id}/members/${user.id}`);
                toast.success('Left campaign');
                navigate('/campaigns');
            }
        } catch (error) {
            console.error('Failed to leave campaign:', error);
            toast.error('Failed to leave campaign');
        }
    };

    if (loading || !campaign) {
        return <div className="p-8 text-center">Loading campaign details...</div>;
    }

    const isGM = user?.id === campaign.gameMasterId;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
                    <p className="text-muted-foreground">{campaign.description || "No description provided."}</p>
                </div>
                <div className="flex gap-2">
                    {isGM ? (
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    ) : (
                        <Button variant="destructive" onClick={handleLeaveCampaign}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Leave Campaign
                        </Button>
                    )}
                </div>
            </div>

            {/* Invite Code (GM Only) */}
            {isGM && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Invite Code</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {campaign.inviteCode}
                        </code>
                        <Button variant="ghost" size="icon" onClick={copyInviteCode}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Tabs defaultValue="players" className="w-full">
                <TabsList>
                    <TabsTrigger value="players">Players</TabsTrigger>
                    <TabsTrigger value="characters">Characters</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="players" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Members</CardTitle>
                            <CardDescription>
                                {campaign.members.length} players in this campaign.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* GM */}
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{campaign.gameMaster.name}</p>
                                            <p className="text-sm text-muted-foreground">Game Master</p>
                                        </div>
                                    </div>
                                    <Badge variant="default">GM</Badge>
                                </div>

                                {/* Players */}
                                {campaign.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{member.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">Player</Badge>
                                            {isGM && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleKickMember(member.userId)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {campaign.members.length === 0 && (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No players yet. Share the invite code to get started!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="characters" className="mt-4">
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">Characters Coming Soon</h3>
                        <p className="text-muted-foreground mt-1">Character management will be available in the next update.</p>
                    </div>
                </TabsContent>

                <TabsContent value="sessions" className="mt-4">
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">Sessions Coming Soon</h3>
                        <p className="text-muted-foreground mt-1">Session tracking will be available in the next update.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
