import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const NavBar = () =>{

    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () =>{
        logout();
        navigate("/login");
    }
   
    return(
        <nav className="flex flex-col justify-center items-center">
            <button onClick={handleLogout}>Logout</button>
        </nav>
    )
}

export default NavBar; 