/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'

import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { colors } from '../components/constants/colors'
import { auth, db } from '../services/firebase/firebase'
import { ThemeContext, type ThemeMode } from './theme-context'

type ResolvedTheme = 'light' | 'dark'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system')

  // SYSTEM THEME
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches ? 'dark': 'light'

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system' ? systemTheme : themeMode

  const theme = colors[resolvedTheme];

  // LOAD LOCAL
  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode

    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setThemeMode(saved)
    }
  }, [])

  // FIREBASE REALTIME
  useEffect(() => {
    if (!auth.currentUser?.uid) return

    const ref = doc(db, 'users', auth.currentUser.uid)

    const unsub = onSnapshot(ref, snap => {
      const pref = snap.data()?.themePreference

      if (pref === 'light' || pref === 'dark' || pref === 'system') {
        setThemeMode(pref)
      }
    })

    return () => unsub()
  }, [])

  // UPDATE THEME
  const setTheme = async (mode: ThemeMode) => {
    setThemeMode(mode)

    localStorage.setItem('theme', mode)

    if (auth.currentUser?.uid) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        themePreference: mode
      })
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
