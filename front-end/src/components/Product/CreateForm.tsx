import { Modal, Input, Select, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import VariantForm from "../Variant/VariantForm";
import { EModal } from "../../pages/product/Product";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addProduct, setPagination } from "../../redux/reducer-type/ProductReducer";

type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<EModal>>;
};
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};
export default function CreateForm(props: TProps) {
    const [form] = Form.useForm();
    const [variantForm] = Form.useForm();
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();
    const { pagination, totalProducts } = useAppSelector((state) => state.product);

    useEffect(() => {
        if (props.isModalOpen !== EModal.CREATE) {
            return;
        }
        variantForm.setFieldsValue({
            variants: [
                {
                    importPrice: 0,
                    retailPrice: 0,
                    stock: 0,
                    ram: "4",
                    storage: "64",
                    color: "black",
                    quantityInStock: 0,
                },
            ],
        });
        form.resetFields();
    }, [props.isModalOpen]);

    const handleSubmit = async (values: any) => {
        // Check if the last page is full
        const { current, pageSize } = pagination;
        const isLastPageFull = totalProducts % pageSize! === 0;
        for (let i = 0; i < variantForm.getFieldValue("variants").length; i++) {
            if (!variantForm.getFieldValue("variants")[i].images) {
                alert("Please upload image for all variants before submitting");
                return;
            }
        }
        const product = await axios.post("/product", values).then((res) => {
            return res.data.data.product;
        });

        dispatch(addProduct(product));
        if (isLastPageFull) {
            dispatch(setPagination({ page: current! + 1, pageSize: pageSize! }));
        }
        if (variantForm.getFieldValue("variants").length === 0) {
            props.setIsModalOpen(EModal.NONE);
            return;
        }

        const variants = await variantForm.getFieldValue("variants").map((variant: any) => ({
            ...variant,
            Product: product._id,
            images: Array.isArray(variant.images)
                ? variant.images.map((image: any) => image.originFileObj)
                : [],
        }));

        for (let i = 0; i < variants.length; i++) {
            const randomPart = Math.floor(100000 + Math.random() * 900000);
            const timestampPart = Date.now().toString().slice(-6);
            const barcode = `${randomPart}${timestampPart}`;
            const formData = new FormData();
            formData.append("importPrice", variants[i].importPrice);
            formData.append("retailPrice", variants[i].retailPrice);
            formData.append("color", variants[i].color);
            formData.append("ram", variants[i].ram);
            formData.append("storage", variants[i].storage);
            formData.append("barcode", barcode);
            formData.append("status", variants[i].status);
            formData.append("quantityInStock", variants[i].quantityInStock);
            formData.append("Product", variants[i].Product);
            variants[i].images.forEach((image: any) => {
                formData.append("images", image);
            });

            await axios
                .post("/variant", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    props.setIsModalOpen(EModal.NONE);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen === EModal.CREATE}
                width={1000}
                centered
                onCancel={props.handleCancel}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "add-product",
                    htmlType: "submit",
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
            >
                <div className="flex justify-between gap-5 h-[75vh]">
                    <Form
                        id="add-product"
                        onFinish={handleSubmit}
                        form={form}
                        {...formItemLayout}
                        className="flex-1"
                    >
                        <p className="text-lg mb-4">Product</p>
                        <Form.Item
                            label="Name"
                            name="productName"
                            labelAlign="left"
                            required={false}
                            rules={[{ required: true, message: "Please input product name" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Category"
                            name="category"
                            labelAlign="left"
                            required={false}
                            rules={[{ required: true, message: "Please input category" }]}
                        >
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
                    <div className="flex-1 overflow-auto scrollbar-vanish">
                        <p className="sticky top-0 bg-white z-10 pb-2 text-lg">Variant</p>
                        <div className="border-l-2 pl-4 ">
                            <VariantForm variantForm={variantForm} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
