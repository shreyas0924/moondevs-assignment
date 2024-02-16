//@ts-nocheck
import React, { createContext, useContext, useState } from 'react'

const Context = createContext()

// Step 2: Create a provider
const Provider = ({ children }) => {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Context.Provider value={{ theme, toggleTheme }}>
      {children}
    </Context.Provider>
  )
}
