import RegisterForm from "../components/RegisterForm";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Register = () => {
  useVerifyToken();

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Register;
