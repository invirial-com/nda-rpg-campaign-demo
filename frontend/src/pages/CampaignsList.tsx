import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Campaign {
    id: string;
    name: string;
    description: string;
    inviteCode: string;
    gameMasterId: string;
    createdAt: string;
}

export default function CampaignsList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCampaignName, setNewCampaignName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await api.get('/campaigns');
            setCampaigns(response.data);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async () => {
        try {
            await api.post('/campaigns', { name: newCampaignName });
            setNewCampaignName('');
            setIsCreateOpen(false);
            fetchCampaigns();
        } catch (error) {
            console.error('Failed to create campaign:', error);
        }
    };

    const handleJoinCampaign = async () => {
        try {
            const response = await api.post('/campaigns/join', { inviteCode });
            setInviteCode('');
            setIsJoinOpen(false);
            navigate(`/campaigns/${response.data.campaignId}`);
        } catch (error) {
            console.error('Failed to join campaign:', error);
            alert('Failed to join campaign. Check the code and try again.');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading campaigns...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">Manage your campaigns or join a new one.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Join Campaign</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Join a Campaign</DialogTitle>
                                <DialogDescription>
                                    Enter the invite code provided by your Game Master.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="invite-code">Invite Code</Label>
                                    <Input
                                        id="invite-code"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="e.g. QST-ABCD"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleJoinCampaign}>Join</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Campaign</DialogTitle>
                                <DialogDescription>
                                    Start a new adventure as a Game Master.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Campaign Name</Label>
                                    <Input
                                        id="name"
                                        value={newCampaignName}
                                        onChange={(e) => setNewCampaignName(e.target.value)}
                                        placeholder="The Legend of Vox Machina"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateCampaign}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{campaign.name}</CardTitle>
                            <CardDescription className="line-clamp-2">
                                {campaign.description || "No description provided."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{campaign.gameMasterId === user?.id ? 'GM' : 'Player'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                                Open Campaign
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {campaigns.length === 0 && (
                    <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No campaigns found</h3>
                        <p className="text-muted-foreground mt-1">Create one or join an existing campaign to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
