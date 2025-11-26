import LoginForm from "../components/LoginForm.jsx";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Login = () => {
  useVerifyToken();

  return (
    <div className="flex flex-1 items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;