import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DefaultPage = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate("home/transaction")
    },[])
  return (
    <div>
      
    </div>
  )
}

export default DefaultPage
