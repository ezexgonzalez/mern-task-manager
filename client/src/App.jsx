import AppRouter from "./router/AppRouter";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const wakeUp = async () => {
      try {
        // VITE_API_URL = https://.../api
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
        await fetch(`${baseUrl}/`);
      } catch (e) {
        console.log("Wakeup ping failed", e);
      }
    };

    wakeUp();
  }, []);
  return <AppRouter />;
}

export default App;
