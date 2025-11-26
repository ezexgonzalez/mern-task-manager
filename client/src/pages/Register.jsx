import RegisterForm from "../components/RegisterForm";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Register = () => {
  useVerifyToken();

  return (
    <div className="flex flex-1 items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Register;
