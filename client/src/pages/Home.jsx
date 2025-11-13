import { useVerifyToken } from "../hooks/useVerifyToken.js";


const Home = () =>{

    useVerifyToken();

    return(
    <div>
        HOME
    </div>
    )
}



export default Home;