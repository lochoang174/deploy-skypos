import { message, Modal } from 'antd'
import React from 'react'
import usePrivateAxios from '../../hooks/usePrivateAxios';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { removeSelectedAccounts } from '../../redux/reducer-type/AccountReducer';
interface Pros{
    open: boolean;
    onClose: () => void;
  }


const DeleteAccount = ({onClose,open}:Pros) => {
    const axios = usePrivateAxios()
    const {accountSelected} = useAppSelector((state)=>state.account)
    const dispatch = useDispatch()
    const handleDelete = async()=>{
        const ids =accountSelected.map((ele)=>ele._id)
        if(ids.length!==0){
            await axios.delete("/account", {
                data: { ids }  // Send the array of ids in the body
              }).then((res)=>{
                console.log(res.data.data)
                dispatch(removeSelectedAccounts())
                onClose();
              }).catch((err)=>{
                message.error(err.response.data.message);
        
              })
        }
    
    }
  return (
    <>
   
    <Modal title="Are you sure to delete accounts ?" open={open} onOk={handleDelete} onCancel={onClose}>
      <p>When they are deleted, it can not rollback</p>
      
    </Modal>
  </>
  )
}

export default DeleteAccount
