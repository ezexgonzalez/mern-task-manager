import { useVerifyToken } from "../hooks/useVerifyToken.js";
import { Link } from "react-router-dom";

const Home = () => {
  useVerifyToken();

  return (
    <div
      className="
        relative min-h-screen
        bg-dark bg-cover bg-center
        text-gray-100
        flex items-center justify-center
      "
      style={{ backgroundImage: "url('/landing-hero.png')" }}
    >
      {/* Overlay más suave para que NO tape tanto la imagen */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido centrado, mismo ancho que los forms */}
      <div
        className="
          relative z-10 w-full max-w-md px-4 text-center space-y-5
          md:scale-[1.08] lg:scale-[1.12] md:origin-center
        "
      >
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/60">
          Task Manager • Liquid Glass UI
        </p>

        <h1 className="text-4xl font-semibold leading-tight text-white">
          Organizá tus tareas
          <br />
          con diseño Liquid Glass.
        </h1>

        <p className="text-sm text-white/70">
          Un espacio minimalista para capturar ideas, ordenar tu día y ver con
          claridad qué es lo próximo que tenés que hacer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          {/* Ir a Register */}
          <Link
            to="/register"
            className="
              w-full sm:w-auto
              px-5 py-2.5
              rounded-bubble
              bg-gradient-to-r from-success/90 to-success/70
              text-white
              border border-success/60
              shadow-[0_8px_25px_rgba(34,197,94,0.35)]
              hover:shadow-[0_10px_30px_rgba(34,197,94,0.5)]
              hover:brightness-105
              active:scale-[0.98]
              transition text-sm font-medium text-center
            "
          >
            Empezar ahora
          </Link>

          {/* Ir a Login */}
          <Link
            to="/login"
            className="
              w-full sm:w-auto
              px-5 py-2.5
              rounded-bubble
              bg-glassLight/35 backdrop-blur-md
              border border-borderGlass
              text-gray-100
              hover:bg-glassMedium/70
              hover:border-white/30
              hover:shadow-bubble
              transition text-sm font-medium text-center
            "
          >
            Ya tengo cuenta
          </Link>
        </div>

        <p className="text-[11px] text-white/55 pt-1">
          Sin ruido visual. Solo vos, tus ideas y el siguiente paso.
        </p>
      </div>
    </div>
  );
};

export default Home;
