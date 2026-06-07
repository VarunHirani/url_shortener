// import { redirect } from "@tanstack/react-router";


// export const checkAuth = ({context})=>{
//     const store = context.store
//     const queryClient = context.queryClient

//     const user = queryClient.getQueryData(['currentUser'])
//     if(user){
//         store.dispatch(login(user))
//         return true;
//     }

//     const auth = store.getState().auth;
//     if(!auth.isAuthenticated){
//         throw redirect({to: "/auth"});
//     }
// }

import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../apis/user.api.js";
import { login } from "../store/slice/authSlice";

export const checkAuth = async ({ context }) => {
    try {
        const { queryClient, store } = context;
        const user = await queryClient.ensureQueryData({
            queryKey: ["currentUser"],
            queryFn: getCurrentUser,
            retry: false,
        });
        if(!user) return false;
        store.dispatch(login(user));
        const {isAuthenticated} = store.getState().auth;
        if(!isAuthenticated) return false;
        return true
    } catch (error) {
        return redirect({to: "/auth"})
    }
};