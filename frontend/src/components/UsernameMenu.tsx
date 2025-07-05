import { useAuth0 } from "@auth0/auth0-react"

import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const UsernameMenu = () => {
    const {user, logout} = useAuth0()
    return (
        <DropdownMenu>
            
            <DropdownMenuTrigger className="flex items-center px-3 font-bold gap-2" style={{ color: '#B7BD3f' }}>
                <CircleUserRound style={{ color: '#B7BD3f' }}/>
                {user?.email}
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="space-y-1 flex-col lg-rounded" style={{ backgroundColor: '#B7BD3f' }}>
                <DropdownMenuItem>
                    <Link to="/manage-restaurant" className="font-bold" style={{ color: 'white' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                        Manage Flower Store
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link to="/user-profile" className="font-bold flex items-center justify-center" style={{ color: 'white' }} onMouseEnter={(e) => e.currentTarget.style.color = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                        User Profile
                    </Link>
                </DropdownMenuItem>

                <Separator/>

                <DropdownMenuItem>
                    <Button onClick={() => logout()} className="flex flex-1 font-bold" style={{ backgroundColor: '#B7BD3f', color: 'white' }}>
                        Log out
                    </Button>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UsernameMenu