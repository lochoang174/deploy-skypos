import { axiosPrivate } from "../api/axios";
import { useAuth } from "./useAuth";

const useRefresh = () => {
    const { setAuth,auth } = useAuth();
    const refresh = async () => {
        const response = await axiosPrivate.post('/auth/refresh',{id:auth?._id}, {
            withCredentials: true
        }).then(res => {
            console.log(res.data)
            localStorage.setItem("jwt", res.data.data.accessToken);
                setAuth(res.data.data.user);
                return res.data.data.accessToken;

        }).catch(err => {
            console.log(err)
            throw err
        })
        // setAuth(prev => {
        //     // console.log(JSON.stringify(prev));
        //     // console.log(response.data.accessToken);
        //     return {
        //         ...prev,
        //         roles: response.data.roles,
        //         accessToken: response.data.accessToken
        //     }
        // });
        console.log(response)
        return response;

    }
    return refresh;
};

export default useRefresh;