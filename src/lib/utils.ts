import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useScrollToTopOnRouteChange() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])
}
