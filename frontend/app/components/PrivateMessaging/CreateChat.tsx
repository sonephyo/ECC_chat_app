"use client"

import type React from "react"

import type { Socket } from "socket.io-client"
import type { DefaultEventsMap } from "@socket.io/component-emitter"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { useSocket } from "~/lib/socketContext"
import { Loader2, Lock } from "lucide-react"

interface CreateChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
}

const CreateChat: React.FC<CreateChatProps> = ({ socket }) => {
  const { username } = useSocket()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = () => {
    if (username.length === 0) {
      alert("Please enter your name")
      return
    }
    if (!socket) return

    setIsCreating(true)
    socket.emit("create_room", { username: username })

    // Reset creating state after a timeout in case the response is delayed
    setTimeout(() => {
      setIsCreating(false)
    }, 5000)
  }

  return (
    <div className="text-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center">
            <Lock className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <h3 className="text-xl font-medium mb-2">Create a Secure Room</h3>
        <p className="text-gray-400 mb-6">Start a new encrypted chat room and invite others to join</p>

        <Button
          onClick={handleCreateRoom}
          disabled={isCreating || username.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>Create Secure Room</>
          )}
        </Button>

        {username.length === 0 && <p className="mt-2 text-amber-400 text-sm">Please enter your name above</p>}
      </motion.div>
    </div>
  )
}

export default CreateChat
