"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Update the state initially
    setMatches(media.matches)

    // Define callback for media query change
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the callback as a listener
    media.addEventListener("change", listener)

    // Remove the listener when the hook is unmounted
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

