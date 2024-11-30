import React from 'react';
import { Form, Input, Button,notification } from 'antd';
import { useAppDispatch } from '../../redux/hooks';
import { updateCustomer } from '../../redux/slices/cartSlice';
interface Pros {
  nextStep: ()=>void
}

const Verification= ({nextStep}:Pros) => {
 
  const [form] = Form.useForm();
const dispatch = useAppDispatch()
  const onFinish = (values:any) => {
    // Handle form submission here
    dispatch(updateCustomer({fullName: values.fullName, phoneNumber: values.phoneNumber, email: values.email,address:values.address}))
    nextStep()
  };

  return (
    <div className='w-[50%] h-[300px] m-auto'>
      <Form
        form={form}
        name="customerVerification"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Verification;
