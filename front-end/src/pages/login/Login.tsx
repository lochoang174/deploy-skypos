import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { FaLock, FaUser } from "react-icons/fa";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../hooks/useAuth";
import { IAuth } from "../../types";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const axios = useAxios();
    const navigate = useNavigate(); // Use hook outside of useEffect
    const { setAuth, auth } = useAuth();
    useEffect(() => {
        if (auth) {
            navigate("/", { replace: true });
        }
    }, [auth]);

    const onFinish = async (values: any) => {
        const response = await axios
            .post("/auth/login", {
                username: values.username,
                password: values.password,
            })
            .then((res) => {
                localStorage.setItem("jwt", res.data.data.accessToken);
                setAuth(res.data.data.user);
                console.log(res.data);
            })
            .catch((err) => {
                message.error(err.response.data.message);
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className="w-full h-full flex justify-center items-center bg-gray/40">
            <div className="bg-white h-[380px] w-[680px] rounded-xl shadow-lg">
                <Row className="h-full">
                    <Col span={12} className="flex flex-col justify-center p-6">
                        <div className="flex gap-2">
                            <img src="/logo.png" className="w-12 h-12" alt="" />
                            <h2 className="text-center text-2xl mb-6">Welcom to Skypos</h2>
                        </div>
                        <Form
                            name="basic"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: "Please input your username!" }]}
                            >
                                <Input prefix={<FaUser />} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: "Please input your password!" }]}
                            >
                                <Input.Password prefix={<FaLock />} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <img
                            src="/phonebg.png"
                            alt="Phone"
                            className="h-full w-full object-cover rounded-r-xl"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Login;
