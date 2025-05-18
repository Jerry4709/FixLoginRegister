import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function usePageTheme(pageKey: string) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(`theme_${pageKey}`);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as Theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(`theme_${pageKey}`, theme);
  }, [theme, pageKey]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}