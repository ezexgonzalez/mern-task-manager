import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, LogOut } from "lucide-react";

const NavBar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div ref={menuRef} className="relative inline-block">
        {/* Ícono 3 puntitos SIN fondo ni borde */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="
            text-white/70 hover:text-white 
            transition 
            text-2xl leading-none
          "
        >
          <MoreVertical size={20} />
        </motion.button>

        {/* Menú glass animado */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="
                absolute right-0 mt-3
                bg-glassLight backdrop-blur-md 
                border border-borderGlass 
                rounded-bubble 
                py-2 w-44
                shadow-bubble
              "
            >
              <button
                onClick={handleLogout}
                className="
                  w-full px-3 py-2
                  flex items-center gap-2
                  text-sm text-gray-200 text-left 
                  hover:text-red-400
                  transition
                "
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NavBar;


