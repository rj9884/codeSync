import { useState, FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { roomApi } from '../../services/api'

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps) {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const createNewRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const id = uuidv4().substring(0, 8)
      // Create room on backend
      await roomApi.create('javascript', '')
      const currentUser = { roomId: id, name: name.trim() || 'Anonymous' }
      localStorage.setItem('codesync_user', JSON.stringify(currentUser))
      navigate(`/editor/${id}`)
      toast.success('Room created')
    } catch (err) {
      setError('Failed to create room')
      toast.error('Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!roomId.trim() || !name.trim()) {
      setError('Please fill in both Room ID and Name fields')
      toast.error('Please fill in both fields')
      return
    }

    setIsLoading(true)

    try {
      // Check if room exists (or create if joining new)
      try {
        await roomApi.get(roomId.trim())
      } catch {
        // Room doesn't exist, create it
        await roomApi.create('javascript', '')
      }

      // Store current user data
      const currentUser = { roomId: roomId.trim(), name: name.trim() }
      localStorage.setItem('codesync_user', JSON.stringify(currentUser))

      // Navigate to editor
      navigate(`/editor/${roomId.trim()}`)
    } catch (err) {
      setError('Failed to join room')
      toast.error('Failed to join room')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to CodeSync</h1>
        <p className="text-muted-foreground mt-1">Join a room to start collaborating</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="roomId" className="text-sm font-medium">
            Room ID
          </label>
          <div className="relative">
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter Room ID"
              className="w-full px-4 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
              autoComplete="off"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            required
            autoComplete="name"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join Room
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <button
        onClick={createNewRoom}
        className="w-full py-2.5 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        <CheckCircle className="h-4 w-4 text-primary" />
        Create New Room
      </button>
    </div>
  )
}