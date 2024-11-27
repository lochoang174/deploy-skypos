import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch } from "../../redux/hooks";
import { addAccount } from "../../redux/reducer-type/AccountReducer";
import { IAccount } from "../../types";

interface CreateAccountProps {
  open: boolean;
  onClose: () => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const axios = usePrivateAxios();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleSave = async () => {
    try {
      await form.validateFields();
      setConfirmLoading(true);

      const values = form.getFieldsValue();

      await axios.post("/account", {
        name: values.fullName,
        email: values.email,
      }).then((res)=>{
        console.log(res.data.data)
        dispatch(addAccount(res.data.data as IAccount))
        form.resetFields();
        onClose();
      }).catch((err)=>{
        message.error(err.response.data.message);

      })

    
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="Create Account For Staff"
      confirmLoading={confirmLoading} // Pass the loading state to the modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          disabled={
            !form.isFieldsTouched(true) ||
            form.getFieldsError().some(({ errors }) => errors.length > 0)
          }
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAccount;
