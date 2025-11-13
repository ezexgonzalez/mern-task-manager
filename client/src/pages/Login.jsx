import LoginForm from "../components/LoginForm.jsx";
import { useVerifyToken } from "../hooks/useVerifyToken.js";

const Login = () =>{

    useVerifyToken();

    return(
        <div>
            <LoginForm/>
        </div>
    )
}


export default Login;