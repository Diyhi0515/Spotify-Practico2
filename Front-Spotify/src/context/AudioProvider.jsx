import React, { useRef } from 'react'
import { AudioContext } from './AudioContext'

export const AudioProvider = ({ children }) => {
  const currentAudioRef = useRef(null)

  const registerAudio = (audioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
    }
    currentAudioRef.current = audioElement
  }

  return (
    <AudioContext.Provider value={{ registerAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

