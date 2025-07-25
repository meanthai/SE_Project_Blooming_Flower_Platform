import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BACKEND_URL = import.meta.env.VITE_API_BACKEND_URL

type myUserCreateType = {
    auth0Id: string,
    email: string,
};

export const useCreateMyUser = () => {
    const {getAccessTokenSilently} = useAuth0();

    const createMyUserRequest = async (user: myUserCreateType) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BACKEND_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if(!response.ok){
            throw new Error("Error while creating new user at the front end");
        }
    }

    const {
        mutateAsync: createUser,
        isLoading,
        isError,
        isSuccess,
    } = useMutation(createMyUserRequest);

    return {
        createUser,
        isLoading,
        isError,
        isSuccess
    };
}

type myUserUpdateType = {
    name: string,
    addressLine1: string,
    city: string,
    country: string,
};

export const useUpdateMyUser = () => {
    const {getAccessTokenSilently} = useAuth0();

    console.log("useUpdateMyUser");

    const updateMyUserRequest = async (updateFormData: myUserUpdateType) => {
        
        console.log("updateFormData: ", updateFormData);

        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BACKEND_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateFormData),
        });

        if(!response.ok){
            throw new Error("Failed to update user info!");
        }
    }

    const {
        mutateAsync: updateUser,
        isLoading,
        isError,
        error,
        isSuccess,
        reset,
    } = useMutation(updateMyUserRequest);

    if(isSuccess){
        toast.success("User profile successfully updated!");
    }
    else if(isError && error) {
        toast.error(error.toString());
        reset();
    }

    return { updateUser, isLoading, isError, isSuccess }
}

export const useGetMyUser = () => {
    const {getAccessTokenSilently} = useAuth0();

    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BACKEND_URL}/api/my/user`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if(!response.ok){
            throw new Error("Failed to get user info!");
        }

        return response.json();
    }

    const {
        data: currentUser,
        isLoading,
        error
    } = useQuery("fetchCurrentUser", getMyUserRequest);

    if(error) {
        toast.error(error.toString());
    }

    return { currentUser, isLoading }
}