import LoginForm from "../components/LoginForm.jsx";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Login = () => {
  useVerifyToken();

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;