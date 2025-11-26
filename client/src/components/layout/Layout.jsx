const Layout = ({ children }) => {
  return (
    <div
      className="
        min-h-screen
        bg-dark
        relative
        overflow-hidden
        flex
        flex-col
      "
    >
      {/* Glow suave en el fondo */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-30
          bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.22),_transparent_55%)]
        "
      />

      {/* Contenido principal */}
      <div
        className="
          relative z-10
          mx-auto w-full 
          px-4 sm:px-6 lg:px-24
          max-w-5xl
          py-6
          flex-1
          flex
          flex-col
        "
      >
        {children}
      </div>

      {/* Footer siempre abajo */}
      <footer className="relative z-10 mt-4 pb-4">
        <div
          className="
            mx-auto w-full 
            px-4 sm:px-6 lg:px-24
            max-w-5xl
            text-center
            text-[11px]
            text-slate-600
          "
        >
          Desarrollado por{" "}
          <a
            href="https://github.com/ezexgonzalez"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-200 hover:underline transition"
          >
            Ezequiel Gonzalez
          </a>{" "}
          · 2025
        </div>
      </footer>
    </div>
  );
};

export default Layout;


