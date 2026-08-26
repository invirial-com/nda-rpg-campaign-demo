import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { X } from "lucide-react"
import api from "../lib/api"

interface JoinCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function JoinCampaignModal({ isOpen, onClose, onSuccess }: JoinCampaignModalProps) {
    const [inviteCode, setInviteCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.post('/campaigns/join', { inviteCode })
            onSuccess()
            onClose()
            setInviteCode("")
        } catch (error) {
            console.error("Failed to join campaign", error)
            alert("Failed to join campaign. Please check the invite code.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md border-primary/20 shadow-2xl">
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <CardTitle>Join Campaign</CardTitle>
                    <CardDescription>Enter the invite code provided by your Game Master</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="inviteCode">Invite Code</Label>
                            <Input
                                id="inviteCode"
                                placeholder="QST-XXXX"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Joining..." : "Join Adventure"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
