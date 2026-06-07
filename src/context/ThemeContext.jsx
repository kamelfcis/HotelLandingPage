import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ isDark: true, toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved === null ? true : saved === 'dark';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
