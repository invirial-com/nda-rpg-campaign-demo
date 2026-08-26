import { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Terminal, Send, Trash2, ShieldAlert } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../context/AuthContext"

interface LogEntry {
    type: 'command' | 'output' | 'error'
    content: string
    timestamp: Date
}

export default function DevConsole() {
    const [input, setInput] = useState("")
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const logsEndRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth()

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [logs])

    useEffect(() => {
        // Initial welcome message
        setLogs([
            {
                type: 'output',
                content: 'Welcome to NdaCampaignDemo Developer Console v1.0.0\nType "help" to see available commands.',
                timestamp: new Date()
            }
        ])
    }, [])

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const command = input.trim()
        setInput("")

        // Add command to logs
        setLogs(prev => [...prev, { type: 'command', content: command, timestamp: new Date() }])
        setIsLoading(true)

        try {
            if (command === 'clear') {
                setLogs([])
                setIsLoading(false)
                return
            }

            const response = await api.post('/dev/command', { command })

            setLogs(prev => [...prev, {
                type: 'output',
                content: response.data.output || JSON.stringify(response.data, null, 2),
                timestamp: new Date()
            }])
        } catch (error: any) {
            console.error("Command failed", error)
            const errorMessage = error.response?.data?.message || error.message || "Unknown error"
            setLogs(prev => [...prev, {
                type: 'error',
                content: `Error: ${errorMessage}`,
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-destructive">
                <ShieldAlert className="h-16 w-16 mb-4" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to access the Developer Console.</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Terminal className="h-6 w-6" />
                    Developer Console
                </h1>
                <Button variant="outline" size="sm" onClick={() => setLogs([])}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Logs
                </Button>
            </div>

            <Card className="flex-1 flex flex-col bg-black border-zinc-800 shadow-2xl overflow-hidden font-mono text-sm">
                <CardHeader className="bg-zinc-900 border-b border-zinc-800 py-2 px-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-2 text-green-400">
                    {logs.map((log, index) => (
                        <div key={index} className={`break-words whitespace-pre-wrap ${log.type === 'command' ? 'text-blue-400 font-bold mt-4' :
                            log.type === 'error' ? 'text-red-400' : 'text-green-400'
                            }`}>
                            {log.type === 'command' && <span className="mr-2">$</span>}
                            {log.content}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="animate-pulse text-green-400/50">Processing...</div>
                    )}
                    <div ref={logsEndRef} />
                </CardContent>
                <div className="p-2 bg-zinc-900 border-t border-zinc-800">
                    <form onSubmit={handleCommand} className="flex gap-2">
                        <span className="flex items-center text-green-500 font-bold px-2">$</span>
                        <Input
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none text-green-400 placeholder:text-green-400/30 focus-visible:ring-0 font-mono"
                            placeholder="Type a command..."
                        />
                        <Button type="submit" size="icon" variant="ghost" className="text-green-500 hover:text-green-400 hover:bg-green-500/10">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}
