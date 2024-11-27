import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};

const PasswordChangeForm = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const axios = usePrivateAxios();

    const handleSubmit = async (values: any) => {
        try {
            console.log(values['current-password'])


            await axios.post("/auth/changePassword", {
                oldPwr: values['current-password'],
                newPwr: values['new-password']
            }).then(
                () => {

                    message.success("Password updated successfully!");
                    form.resetFields();
                }
            ).catch((err) => {
                message.error("Wrong password")
            })
        } catch {
            message.error("Something went wrong!");

        }

    };

    const validatePassword = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error("Please input new password"));
        }
        const hasNumber = /\d/.test(value);
        const hasLetter = /[a-zA-Z]/.test(value);
        if (!hasNumber) {
            return Promise.reject(new Error("Password must include at least one number"));
        }
        if (!hasLetter) {
            return Promise.reject(new Error("Password must include at least one letter"));
        }
        if (value.length < 6) {
            return Promise.reject(new Error("Password must be more than 6 characters long"));
        }
        return Promise.resolve();
    };

    return (
        <div className="flex items-center justify-center px-5 w-2/5">
            <Form
                id="add-product"
                onFinish={handleSubmit}
                form={form}
                {...formItemLayout}
                className="w-full "
            >
                {/* Change Password Section */}
                <h2 className="text-primary-black text-lg font-semibold py-3">Change Password</h2>

                {/* Current Password */}
                <div>
                    <label
                        className="text-gray-500 text-xs font-medium"
                        htmlFor="current-password"
                    >
                        CURRENT PASSWORD
                    </label>
                    <Form.Item
                        name="current-password"
                        rules={[{ required: true, message: "Please input current password" }]}
                    >
                        <Input.Password
                            placeholder="Input current password"
                            id="current-password"
                            className="w-full mt-1"
                        />
                    </Form.Item>
                </div>

                {/* New Password */}
                <div className="mb-4">
                    <label className="text-gray-500 text-xs font-medium" htmlFor="new-password">
                        NEW PASSWORD
                    </label>
                    <Form.Item
                        name="new-password"
                        rules={[{ validator: validatePassword }]}
                    >
                        <Input.Password
                            placeholder="Input new password"
                            id="new-password"
                            className="w-full mt-1"
                        />
                    </Form.Item>
                </div>

                {/* Confirm New Password */}
                <div className="mb-6">
                    <label
                        className="text-gray-500 text-xs font-medium"
                        htmlFor="confirm-password"
                    >
                        CONFIRM NEW PASSWORD
                    </label>
                    <Form.Item
                        name="confirm-new-password"
                        dependencies={['new-password']}
                        rules={[
                            { required: true, message: "Please confirm new password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new-password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("Passwords do not match")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Input confirm new password"
                            id="  confirm-password"
                            className="w-full mt-1"
                        />
                    </Form.Item>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end">
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="mt-4 w-full"
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default PasswordChangeForm;
