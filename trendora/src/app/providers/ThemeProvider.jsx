import { useEffect } from 'react';
import useThemeStore from '../../stores/themeStore';

export default function ThemeProvider({ children }) {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return children;
}
