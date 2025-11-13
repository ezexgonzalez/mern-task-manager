import RegisterForm from "../components/RegisterForm";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Register = () => {
  useVerifyToken();

  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default Register;
