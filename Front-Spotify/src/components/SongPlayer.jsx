import React, { useEffect, useRef, useContext } from 'react'
import { AudioContext } from '../context/AudioContext'
import { mp3Url } from "../config/config"

const SongPlayer = ({ url }) => {
  const audioRef = useRef(null)
  const { registerAudio } = useContext(AudioContext)

  useEffect(() => {
    const audio = audioRef.current

    const handlePlay = () => {
      registerAudio(audio)
    }

    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('play', handlePlay)
    }
  }, [registerAudio])

  return (
    <audio ref={audioRef} controls src={`${mp3Url}${url}`} style={{ width: '80%' }}>
      Tu navegador no soporta el audio.
    </audio>
  )
}

export default SongPlayer
