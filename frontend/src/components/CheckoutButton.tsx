import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileUpdateForm, { UserFormData } from "@/forms/user-profile-form/UserProfileUpdateForm";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
    onCheckout: (userFormData: UserFormData) => void;
    disabled: boolean,
    isLoading: boolean,
}

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
    const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();

    const { pathname } = useLocation();

    const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

    const onLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: pathname
            }
        })
    }

    if (!isAuthenticated) {
        return (
            <Button 
                onClick={onLogin} 
                className="flex-1" 
                style={{ backgroundColor: "#B7BD3f" }}
            >
                Log in to check out
            </Button>
        )
    }

    if (isAuthLoading || !currentUser || isLoading) {
        return <LoadingButton />
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    disabled={disabled} 
                    className="flex-1" 
                    style={{ backgroundColor: "#B7BD3f" }}
                >
                    Go to checkout
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
                <UserProfileUpdateForm 
                    currentUser={currentUser} 
                    onsave={onCheckout} 
                    isLoading={isGetUserLoading} 
                    title="Delivery Info" 
                    buttonText="Continue to payment"
                />
            </DialogContent>
        </Dialog>
    )
}

export default CheckoutButton;
