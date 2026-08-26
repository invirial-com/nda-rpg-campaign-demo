import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Plus, User, Trash2, Edit } from "lucide-react"
import api from "../lib/api"
import CharacterWizard from "../components/CharacterWizard"
import { Badge } from "../components/ui/badge"
import { toast } from "sonner"

interface Character {
    id: string
    name: string
    race: string
    class: string
    level: number
    campaign?: {
        name: string
    }
}

export default function CharactersList() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCharacters = async () => {
        try {
            const response = await api.get('/characters')
            setCharacters(response.data)
        } catch (error) {
            console.error("Failed to fetch characters", error)
            toast.error("Failed to load characters")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCharacters()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this character?")) return
        try {
            await api.delete(`/characters/${id}`)
            toast.success("Character deleted")
            fetchCharacters()
        } catch (error) {
            console.error("Failed to delete character", error)
            toast.error("Failed to delete character")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Characters</h1>
                    <p className="text-muted-foreground">
                        Manage your heroes and villains
                    </p>
                </div>
                <Button className="gap-2" onClick={() => setIsWizardOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Character
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading characters...</div>
            ) : characters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
                        <User className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No characters yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Create your first character to join campaigns and start your adventure.
                    </p>
                    <Button onClick={() => setIsWizardOpen(true)}>Create Character</Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char) => (
                        <Card key={char.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <div className="h-2 bg-primary/80" />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{char.name}</CardTitle>
                                        <CardDescription>{char.race} {char.class}</CardDescription>
                                    </div>
                                    <Badge variant="outline">Lvl {char.level}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="text-sm text-muted-foreground">
                                    {char.campaign ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            In Campaign: {char.campaign.name}
                                        </span>
                                    ) : (
                                        <span className="text-yellow-600">Not in a campaign</span>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/50 p-4 flex justify-end gap-2">
                                <Button variant="ghost" size="icon" title="Edit (Coming Soon)" disabled>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(char.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <CharacterWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                onSuccess={fetchCharacters}
            />
        </div>
    )
}
