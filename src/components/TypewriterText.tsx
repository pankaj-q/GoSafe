'use client'

import { useState, useEffect, useCallback } from 'react'

interface TypewriterTextProps {
  words: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  pauseMs?: number
}

export default function TypewriterText({
  words,
  className = '',
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseMs = 2000,
}: TypewriterTextProps) {
  const [state, setState] = useState({ wordIndex: 0, charIndex: 0, deleting: false })

  const tick = useCallback(() => {
    setState(prev => {
      const currentWord = words[prev.wordIndex]
      if (!prev.deleting && prev.charIndex < currentWord.length) {
        return { ...prev, charIndex: prev.charIndex + 1 }
      }
      if (!prev.deleting && prev.charIndex === currentWord.length) {
        return prev
      }
      if (prev.deleting && prev.charIndex > 0) {
        return { ...prev, charIndex: prev.charIndex - 1 }
      }
      if (prev.deleting && prev.charIndex === 0) {
        return {
          wordIndex: (prev.wordIndex + 1) % words.length,
          charIndex: 0,
          deleting: false,
        }
      }
      return prev
    })
  }, [words])

  useEffect(() => {
    const currentWord = words[state.wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!state.deleting && state.charIndex === currentWord.length) {
      timeout = setTimeout(() => {
        setState(prev => ({ ...prev, deleting: true }))
      }, pauseMs)
    } else if (!state.deleting) {
      timeout = setTimeout(tick, typeSpeed)
    } else {
      timeout = setTimeout(tick, deleteSpeed)
    }

    return () => clearTimeout(timeout)
  }, [state, words, tick, typeSpeed, deleteSpeed, pauseMs])

  return (
    <span className={className}>
      {words[state.wordIndex].slice(0, state.charIndex)}
      <span className="animate-blink text-blue-200 font-light">|</span>
    </span>
  )
}
