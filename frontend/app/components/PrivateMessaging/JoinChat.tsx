"use client"

import type React from "react"

import type { Socket } from "socket.io-client"
import type { DefaultEventsMap } from "@socket.io/component-emitter"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router"
import { useSocket } from "~/lib/socketContext"
import { Button } from "../ui/button"
import { ArrowRight, Loader2, RefreshCw, Users } from "lucide-react"

interface JoinChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
}

const backend_url = import.meta.env.VITE_BACKEND_URL

const JoinChat: React.FC<JoinChatProps> = ({ socket }) => {
  const [rooms, setRooms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { username } = useSocket()

  const fetchRooms = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${backend_url}/chat-groups`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const result = await response.json()
      setRooms(result.rooms)
    } catch (err) {
      console.error(err)
      setError("Failed to load available rooms")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center">
            <Users className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <h3 className="text-xl font-medium mb-2">Join a Room</h3>
        <p className="text-gray-400 mb-4">Connect to an existing secure chat room</p>

        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRooms}
            className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 py-4">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRooms}
              className="mt-2 border-red-800 text-red-400 hover:bg-red-950"
            >
              Try Again
            </Button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-400 py-8">No active rooms available. Create a new room to get started.</div>
        ) : (
          <motion.div className="space-y-3 mt-2" variants={containerVariants} initial="hidden" animate="visible">
            {rooms.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between p-3 bg-zinc-800 rounded-md border border-zinc-700 hover:border-emerald-800 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium">Room {item}</p>
                </div>
                {username ? (
                  <Link to={`/chat/${item}`}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      Join <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="text-gray-400 border-gray-700"
                    onClick={() => alert("Please enter your name")}
                  >
                    Enter Name
                  </Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default JoinChat
