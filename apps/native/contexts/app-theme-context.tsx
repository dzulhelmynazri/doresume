import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { Uniwind, useUniwind } from "uniwind";

type ThemeName = "light" | "dark";

interface AppThemeContextType {
  currentTheme: string;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useUniwind();

  const isLight = useMemo(() => theme === "light", [theme]);

  const isDark = useMemo(() => theme === "dark", [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    Uniwind.setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  const value = useMemo(
    () => ({
      currentTheme: theme,
      isDark,
      isLight,
      setTheme,
      toggleTheme,
    }),
    [isDark, isLight, setTheme, theme, toggleTheme]
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }
  return context;
};
