'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { ref, push, onChildAdded } from 'firebase/database'

export function CollaborativeTools() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [roomId, setRoomId] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (roomId) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      onChildAdded(messagesRef, (snapshot) => {
        const data = snapshot.val()
        setMessages((prevMessages) => [...prevMessages, data])
      })
    }
  }, [roomId])

  const sendMessage = () => {
    if (newMessage.trim() && roomId) {
      const messagesRef = ref(db, `rooms/${roomId}/messages`)
      push(messagesRef, {
        text: newMessage,
        timestamp: Date.now(),
        sender: 'User', // Replace with actual user name or ID
      })
      setNewMessage('')
    }
  }

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborative Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="mb-2"
          />
          <Button onClick={() => setRoomId(roomId)}>Join Room</Button>
        </div>
        <div className="mb-4">
          <video ref={videoRef} autoPlay muted className="mb-2" />
          <Button onClick={startVideoCall}>Start Video Call</Button>
        </div>
        <div className="mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-1">
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="mr-2"
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  )
}

