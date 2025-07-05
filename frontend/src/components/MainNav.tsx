import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "./ui/button"
import UsernameMenu from "./UsernameMenu"
import { Link } from "react-router-dom"

const MainNav = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0()
    return (
        <span className="flex space-x-2 items-center">
            {
                isAuthenticated ? (
                <>
                    <Link 
                        to="/order-status" 
                        className="font-bold hover:bg-white" 
                        style={{ color: "inherit" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#B7BD3f"}
                        onMouseLeave={e => e.currentTarget.style.color = "inherit"}
                    >
                        Order Status
                    </Link>
                    
                    <UsernameMenu />
                </>
                ) : (
                <Button 
                    variant="ghost" 
                    className="font-bold hover:bg-white"
                    style={{ color: "inherit" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#B7BD3f"}
                    onMouseLeave={e => e.currentTarget.style.color = "inherit"}
                    onClick={() => loginWithRedirect()}
                >
                    Log In
                </Button> )
            }
        </span>
    )
}

export default MainNav
