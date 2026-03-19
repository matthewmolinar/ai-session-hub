import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface MySessionsState {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  toggleSession: (id: string) => void;
  expandedPaths: Set<string>;
  toggleExpanded: (path: string) => void;
  selectedFilePath: string | null;
  setSelectedFilePath: (path: string | null) => void;
}

const MySessionsContext = createContext<MySessionsState | null>(null);

export function MySessionsProvider({ children }: { children: ReactNode }) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => new Set(["src", "src/editor", "src/sync", "src/components", "src/lib"]));
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const toggleSession = useCallback((id: string) => {
    setActiveSessionId((prev) => (prev === id ? null : id));
  }, []);

  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  return (
    <MySessionsContext.Provider
      value={{
        activeSessionId,
        setActiveSessionId,
        toggleSession,
        expandedPaths,
        toggleExpanded,
        selectedFilePath,
        setSelectedFilePath,
      }}
    >
      {children}
    </MySessionsContext.Provider>
  );
}

export function useMySessionsState() {
  const ctx = useContext(MySessionsContext);
  if (!ctx) throw new Error("useMySessionsState must be used within MySessionsProvider");
  return ctx;
}
