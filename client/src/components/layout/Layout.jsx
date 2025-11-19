const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Glow suave en el fondo, SIN mix-blend */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-30
          bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.22),_transparent_55%)]
        "
      />
      <div
        className="
          relative
          mx-auto w-full 
          px-4 sm:px-6 lg:px-24
          max-w-5xl
          py-6
        "
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;


