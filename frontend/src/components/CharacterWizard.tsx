import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { ChevronRight, ChevronLeft, Save, User, Activity, BookOpen, CheckCircle } from "lucide-react"
import api from "../lib/api"
import { toast } from "sonner"

interface CharacterWizardProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CharacterWizard({ isOpen, onClose, onSuccess }: CharacterWizardProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        race: "",
        class: "",
        level: 1,
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        history: "",
        skills: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === "level" || name === "strength" || name === "dexterity" || name === "constitution" || name === "intelligence" || name === "wisdom" || name === "charisma"
                ? parseInt(value) || 0
                : value
        }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await api.post('/characters', formData)
            toast.success("Character created successfully!")
            onSuccess()
            onClose()
            setStep(1)
            setFormData({
                name: "",
                race: "",
                class: "",
                level: 1,
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
                history: "",
                skills: ""
            })
        } catch (error) {
            console.error("Failed to create character", error)
            toast.error("Failed to create character")
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Character</DialogTitle>
                    <DialogDescription>
                        Step {step} of 4: {
                            step === 1 ? "Basic Information" :
                                step === 2 ? "Attributes" :
                                    step === 3 ? "Lore & Skills" : "Review"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <User className="h-5 w-5" />
                                <h3 className="font-semibold">Who are you?</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="name">Character Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Aragorn" autoFocus />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="race">Race</Label>
                                    <Input id="race" name="race" value={formData.race} onChange={handleChange} placeholder="e.g. Human" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="class">Class</Label>
                                    <Input id="class" name="class" value={formData.class} onChange={handleChange} placeholder="e.g. Ranger" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Level</Label>
                                    <Input id="level" name="level" type="number" min="1" max="20" value={formData.level} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <Activity className="h-5 w-5" />
                                <h3 className="font-semibold">Define your strengths</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((attr) => (
                                    <div key={attr} className="space-y-2">
                                        <Label htmlFor={attr} className="capitalize">{attr.substring(0, 3)}</Label>
                                        <Input
                                            id={attr}
                                            name={attr}
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={(formData as any)[attr]}
                                            onChange={handleChange}
                                            className="text-center font-mono"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <BookOpen className="h-5 w-5" />
                                <h3 className="font-semibold">Tell your story</h3>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="history">Backstory</Label>
                                <Textarea
                                    id="history"
                                    name="history"
                                    value={formData.history}
                                    onChange={handleChange}
                                    placeholder="Where do you come from?"
                                    className="h-24"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills & Proficiencies</Label>
                                <Textarea
                                    id="skills"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="List your skills..."
                                    className="h-24"
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <CheckCircle className="h-5 w-5" />
                                <h3 className="font-semibold">Ready to adventure?</h3>
                            </div>
                            <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="text-muted-foreground">Name:</span> <span className="font-medium">{formData.name}</span>
                                    <span className="text-muted-foreground">Race/Class:</span> <span className="font-medium">{formData.race} {formData.class} (Lvl {formData.level})</span>
                                </div>
                                <div className="border-t pt-2">
                                    <p className="text-xs text-muted-foreground mb-1">Attributes</p>
                                    <div className="grid grid-cols-6 gap-1 text-center text-xs font-mono">
                                        <div>STR<br />{formData.strength}</div>
                                        <div>DEX<br />{formData.dexterity}</div>
                                        <div>CON<br />{formData.constitution}</div>
                                        <div>INT<br />{formData.intelligence}</div>
                                        <div>WIS<br />{formData.wisdom}</div>
                                        <div>CHA<br />{formData.charisma}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        variant="outline"
                        onClick={step === 1 ? onClose : prevStep}
                        disabled={isLoading}
                    >
                        {step === 1 ? "Cancel" : <><ChevronLeft className="mr-2 h-4 w-4" /> Back</>}
                    </Button>

                    {step < 4 ? (
                        <Button onClick={nextStep} disabled={!formData.name}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? "Creating..." : <><Save className="mr-2 h-4 w-4" /> Create Character</>}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
