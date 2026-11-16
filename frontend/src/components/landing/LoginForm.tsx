import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { roomApi } from '../../services/api'

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps) {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const createNewRoom = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault()
    // Generate a clean room ID (8-char or UUID)
    const id = uuidv4().substring(0, 8)
    setRoomId(id)
    toast.success('New Room ID Generated')
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedRoomId = roomId.trim()
    const trimmedName = name.trim()

    if (!trimmedRoomId || !trimmedName) {
      toast.error('Please fill in both Room ID and Name fields!')
      return
    }

    setIsLoading(true)

    try {
      // Store user data in localStorage
      const currentUser = { roomId: trimmedRoomId, name: trimmedName }
      localStorage.setItem('codesync_user', JSON.stringify(currentUser))
      localStorage.setItem('currentUser', JSON.stringify(currentUser))

      // Ensure room is created in backend
      try {
        await roomApi.create(trimmedRoomId, 'javascript', '')
      } catch (err) {
        // Even if create call errors (e.g. already exists or network), WebSocket will also handle join
        console.warn('Room create check notice:', err)
      }

      // Navigate to editor
      navigate(`/editor/${trimmedRoomId}`)
    } catch (err) {
      toast.error('Failed to join room')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="text-sm text-zinc-400 mt-1">Paste Your Room ID</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="roomId" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              ROOM ID
            </label>
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Your Room ID"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
              required
              autoComplete="name"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50 transition-colors cursor-pointer mt-2 shadow"
          >
            {isLoading ? 'Joining...' : 'Join Now'}
          </button>

          <div className="text-center text-sm text-zinc-400 pt-2">
            Don&apos;t have Any Room ID?{' '}
            <a
              id="link"
              href="#generate"
              onClick={createNewRoom}
              className="text-white underline underline-offset-4 hover:text-zinc-300 cursor-pointer font-medium"
            >
              Generate Now
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
