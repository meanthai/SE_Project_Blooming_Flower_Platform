import { Link } from "react-router-dom"
import MobileNav from "./MobileNav"
import MainNav from "./MainNav"

const Header = () => {
    return (
        <div style={{ borderBottom: "2px solid #B7BD3f" }} className="py-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link 
                    to="/" 
                    className="text-3xl font-bold tracking-tight" 
                    style={{ color: "#B7BD3f" }}
                >
                    Blooming.com
                </Link>

                <div className="md:hidden">
                    <MobileNav />
                </div>
                
                <div className="hidden md:block">
                    <MainNav />
                </div>
            </div>
        </div>
    )
}

export default Header
