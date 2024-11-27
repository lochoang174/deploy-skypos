import React, { useState } from 'react'
import { Input, Card, Button, InputNumber, message } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import usePrivateAxios from '../../hooks/usePrivateAxios'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addItem, decreaseQuantity, increaseQuantity, removeItem, updateQuantity } from '../../redux/slices/cartSlice'
import { IVariant } from '../../types'

interface Pros {
  nextStep: ()=>void
}

const AddProduct = ({nextStep}:Pros) => {
  const {items}=useAppSelector((state)=>state.cart)

  const [quantity, setQuantity] = useState(1)
  const axiosPrivate = usePrivateAxios()
  const base_url = import.meta.env.VITE_BE_URL+ "/public/images/";
  // import.meta.env.VITE_BE_URL +
  // "/public/images/" +
  // props.currentProduct._id +
  // "/" +
  // props._id +
  // "/" +
  // props.variant.images[0]
  const dispatch=useAppDispatch()
  const handleSearch = async (value: string) => {
    try {
      const response = await axiosPrivate.get(`/variant/search?barcode=${value}`).then((res)=>{
       
        dispatch(addItem(res.data.data as IVariant))
      }).catch((err)=>{
        message.error(err.response.data.message)
      })
      
    } catch (error) {
      console.error('Error searching product:', error)
    }
  }

  const handleQuantityChange = (value: number | null) => {
    if (value !== null) {
      setQuantity(value)
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems:'center' }}>
      <Input.Search
        placeholder="Nhập mã vạch sản phẩm"
        onSearch={handleSearch}
        style={{ width: "40%", marginBottom: 20, height: 40 }}
      />
        <div className='grow flex flex-col gap-2 border border-gray-300 rounded-lg p-2 w-[80%] overflow-y-auto max-h-[390px]'>
          {items && items.length > 0 && (
            <div className='flex-1 flex flex-col gap-4 '>
              {items.map((item, index) => (
                <div key={index} className='flex items-center bg-white rounded-lg shadow-md p-4 space-x-4 '>
                  {item.variant && item.variant.Product && (
                    <>
                      <img 
                        src={`${base_url}${item.variant.Product._id}/${item.variant._id}/${item.variant.images[0]}`} 
                        alt={item.variant.Product.productName} 
                        className='w-20 h-20 object-cover rounded-md'
                      />
                      <div className='flex-grow flex justify-between items-center'>
                        <div>
                          <h3 className='text-lg font-semibold'>{item.variant.Product.productName}</h3>
                          <p className='text-sm text-gray-600'>
                            {item.variant.color} - {item.variant.ram} - {item.variant.storage}
                          </p>
                        </div>
                        <div className='flex items-center gap-3 '>
                          <Button 
                            icon={<MinusOutlined />} 
                            size="small"
                            onClick={() => dispatch(decreaseQuantity(item.variant._id))}
                          />
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => {
                              if (value !== null) {
                                dispatch(updateQuantity({ id: item.variant._id, quantity: value }));
                              }
                            }}
                            controls={false}

                            style={{ width: '60px' }}
                          />
                          <Button 
                            icon={<PlusOutlined />} 
                            size="small"
                            onClick={() => dispatch(increaseQuantity(item.variant._id))}
                          />
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-semibold'>${item.total.toFixed(2)}</p>
                          <button className='text-red-500 hover:text-red-700 mt-2' onClick={()=>dispatch(removeItem(item.variant._id))}>Remove</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="primary" onClick={nextStep} className='mt-4'>
              Next
            </Button>
    </div>
  )
}

export default AddProduct
