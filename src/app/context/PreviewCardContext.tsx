import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface PreviewCardContextValue {
  expandedIds: Set<string>;
  anyExpanded: boolean;
  register: (id: string) => void;
  unregister: (id: string) => void;
}

const PreviewCardContext = createContext<PreviewCardContextValue>({
  expandedIds: new Set(),
  anyExpanded: false,
  register: () => {},
  unregister: () => {},
});

export function usePreviewCardContext() {
  return useContext(PreviewCardContext);
}

export function PreviewCardProvider({ children }: { children: React.ReactNode }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const register = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    expandedIds,
    anyExpanded: expandedIds.size > 0,
    register,
    unregister,
  }), [expandedIds, register, unregister]);

  return (
    <PreviewCardContext.Provider value={value}>
      {children}
    </PreviewCardContext.Provider>
  );
}
