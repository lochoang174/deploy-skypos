import { Form, Input, Modal, Select } from "antd";

import { useEffect } from "react";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { EModal } from "../../pages/product/Product";
import { useAppDispatch } from "../../redux/hooks";
import { editProduct } from "../../redux/reducer-type/ProductReducer";
import { IProduct } from "../../types";

const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};

type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    currentProduct: IProduct | undefined;
};
export default function UpdateForm(props: TProps) {
    const [form] = Form.useForm();
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.isModalOpen === EModal.NONE) {
            return;
        }
        form.setFieldsValue({
            productName: props.currentProduct?.productName,
            category: props.currentProduct?.category,
            description: props.currentProduct?.description,
        });
    }, [props.currentProduct, props.isModalOpen]);

    const handleSubmit = async (values: any) => {
        await axios.put(`/product/${props.currentProduct?._id}`, values).then((res) => {
            dispatch(editProduct(res.data.data));
            props.handleCancel();
        });
    };
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen === EModal.UPDATE}
                centered
                onCancel={props.handleCancel}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "update-product",
                    htmlType: "submit",
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
            >
                <Form
                    id="update-product"
                    onFinish={handleSubmit}
                    form={form}
                    {...formItemLayout}
                    style={{ maxWidth: 900 }}
                    className="flex-1"
                >
                    <p className="text-lg mb-4">Update Product</p>
                    <Form.Item label="Name" name="productName" labelAlign="left">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Category" name="category" labelAlign="left">
                        <Select>
                            <Select.Option value="phone">Phone</Select.Option>
                            <Select.Option value="laptop">Laptop</Select.Option>
                            <Select.Option value="headphone">Headphone</Select.Option>
                            <Select.Option value="keyboard">Keyboard</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Description" name="description" labelAlign="left">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
