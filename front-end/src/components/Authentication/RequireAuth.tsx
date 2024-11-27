import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IAuth } from '../../types';


const RequireAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  // const [auth, setAuth] = useState<IAuth | null>(null);
  const {auth,setAuth}=useAuth()
  const navigate = useNavigate(); // Use hook outside of useEffect

  useEffect(() => {
    const checkJwt = () => {
      const jwt = localStorage.getItem('jwt');
      
      if (jwt) {
        try {
          const decoded= jwtDecode(jwt);


          const currentTimestamp = Date.now();
          // @ts-ignore
          const unixTimestamp = new Date(decoded.expirationDate).getTime();          
          if (currentTimestamp < unixTimestamp) {
            setAuth(decoded as IAuth);
          } else {
            setAuth(null);
            localStorage.removeItem('jwt');
          }
        } catch (error) {
          // Invalid token, clear auth
          setAuth(null);
          localStorage.removeItem('jwt');
        }
      } else {
        setAuth(null);
      }
      
      setLoading(false);
    };
    if(!auth){
      checkJwt();

    }else{
      setLoading(false)
    }
  }, [auth]);
  useEffect(()=>{
    if(auth?.isCreated===false){
      navigate("/home/changePassword")
    }
  },[auth?.isCreated])
  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner or placeholder
  }
  // If the user is authenticated, return the Outlet to render the protected component
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
