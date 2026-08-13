'use client'

import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('gosafe-theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 transition-colors"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
