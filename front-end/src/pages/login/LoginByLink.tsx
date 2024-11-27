import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { message } from 'antd';
import { useAuth } from '../../hooks/useAuth';

const LoginByLink = () => {
    const axios =useAxios()
    const navigate = useNavigate(); // Use hook outside of useEffect
    const {token} = useParams()
    const {setAuth,auth}=useAuth()

    useEffect(()=>{
        login()
    },[])
    useEffect(()=>{
        if(auth){
            navigate('/home/changePassword', { replace: true });
        }
    },[auth])
    const login = async ()=>{
        const response = await axios.get(`/auth/login/${token}`, {

        }).then((res)=>{
            localStorage.setItem("jwt",res.data.data.accessToken)
            setAuth(res.data.data.user)
            console.log(res.data)
        }).catch((err)=>{
            message.error('Invalid Token. Please try again.');
            console.log(err)

        })
    }
  return (
    <div>
        Loading
    </div>
  )
}

export default LoginByLink
