import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { X } from "lucide-react"
import api from "../lib/api"

interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [setting, setSetting] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.post('/campaigns', { name, description, setting })
            onSuccess()
            onClose()
            setName("")
            setDescription("")
            setSetting("")
        } catch (error) {
            console.error("Failed to create campaign", error)
            alert("Failed to create campaign")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
                <CardHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <CardTitle>Create New Campaign</CardTitle>
                    <CardDescription>Start a new adventure for your players</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input
                                id="name"
                                placeholder="The Legend of Vox Machina"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="setting">Setting / System</Label>
                            <Input
                                id="setting"
                                placeholder="D&D 5e, Pathfinder, etc."
                                value={setting}
                                onChange={(e) => setSetting(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="A brief summary of the adventure..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Campaign"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
