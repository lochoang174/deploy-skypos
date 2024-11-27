import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface Pros {
  allowedRoles: number[];
}

const Authorized = ({ allowedRoles }: Pros) => {
  const { auth } = useAuth();
  const location = useLocation(); // Use the useLocation hook
  const checkRole = allowedRoles?.includes(auth?.role ?? -1);
  
  return (
    checkRole ? (
      <Outlet />
    ) : auth?._id ? (
      <Navigate to="/home/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  );
};

export default Authorized;
