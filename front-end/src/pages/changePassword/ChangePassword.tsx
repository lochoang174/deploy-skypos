import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { CiLogout } from "react-icons/ci";

// Định nghĩa type cho values
interface ChangePasswordValues {
  newPassword: string;
}

const ChangePassword: React.FC = () => {
  const axios = usePrivateAxios();
  const navigate = useNavigate(); // Use hook outside of useEffect
  const { setAuth, auth } = useAuth();
  useEffect(() => {
    if (auth?.isCreated === true) {
      navigate("/home/transaction", { replace: true });
    }
  }, [auth]);
  const onFinish = async (values: ChangePasswordValues) => {
    console.log(auth?.username);

    await axios
      .post("/auth/changePassword", {
        oldPwr: auth?.username,
        newPwr: values.newPassword,
      })
      .then((res) => {
        setAuth({ ...auth!, isCreated: true });
      })
      .catch((err) => {
        console.log(err);
        message.error("Invalid username or password. Please try again.");
      });
  };
  const logout = ()=>{
    localStorage.clear()
    setAuth(null)
    window.location.reload()
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        style={{
          width: 500,
          height: 200,
          padding: 20,
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >
        <div className="flex justify-between">
        <h2>Change Password</h2>
        <div className="flex gap-1 cursor-pointer " onClick={logout}><CiLogout className="self-center" /> logout
        </div>
        </div>
        <Form name="change-password" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]/,
                message: "Password must contain both letters and numbers",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
