import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import useRefresh from './useRefresh';

const usePrivateAxios = () => {
  const navigate = useNavigate();
  const {auth,setAuth}=useAuth()
  const refresh=useRefresh()
  useEffect(() => {
    // Request interceptor for adding the token
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt'); // Retrieve the JWT token from local storage
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`; // Attach the JWT token to the Authorization header
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling expired token
    // const responseInterceptor = axiosPrivate.interceptors.response.use(
    //   (response) => response, // If the response is successful, return it
    //   (error) => {
    //     console.log(error)
    //     if (error.response?.status === 401 && error.response?.data?.message === "Access token is expired") {
    //       // If the token is expired, navigate to the login page
    //       localStorage.removeItem('jwt'); // Optionally, clear the token from storage
    //       setAuth(null);

    //       navigate('/login', { replace: true });
    //     }
    //     if (error.status === 403 && error.response?.data?.message === "No token provided") {
    //       console.log("here")
    //       localStorage.removeItem('jwt'); // Optionally, clear the token from storage
    //       setAuth(null);

    //       navigate('/login', { replace: true });
    //     }
    //     return Promise.reject(error);
    //   }
    // );
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
          const prevRequest = error?.config;
          if (error?.response?.status === 401 && error.response?.data?.message === "Access token is expired"  && !prevRequest?.sent) {
              prevRequest.sent = true;
              const newAccessToken = await refresh();
              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevRequest);
          }
          return Promise.reject(error);
      }
  );
    // Clean up the interceptors when the component unmounts
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return axiosPrivate;
};

export default usePrivateAxios;
