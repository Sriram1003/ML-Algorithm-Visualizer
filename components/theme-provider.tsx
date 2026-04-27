'use client';
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children, attribute, defaultTheme }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
