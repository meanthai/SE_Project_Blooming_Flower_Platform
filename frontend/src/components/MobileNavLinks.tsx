import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

const MobileNavLinks = () => {
    const { logout } = useAuth0()
    return (
        <>
            <Link to="/order-status" className="flex bg-white items-center font-bold hover:text-[#B7BD3f]">
                Order Status
            </Link>

            <Link to="/manage-restaurant" className="flex bg-white items-center font-bold hover:text-[#B7BD3f]">
                My Flower Store
            </Link>

            <Link to="/user-profile" className="flex bg-white items-center font-bold hover:text-[#B7BD3f]">
                User Profile
            </Link>

            <Button onClick={() => logout()} className="flex items-center px-3 font-bold hover:bg-gray-500">
                Log out
            </Button>
        </>
    )
}

export default MobileNavLinks
