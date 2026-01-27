import { useState, useRef, useEffect, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    action: null,
  });
  
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, action = null, duration = 2500) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    setToast({ visible: true, message, action });

    timeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ visible: false, message: "", action: null });
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { toast, showToast, hideToast };
};