import React, { useEffect, useState } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Badge,
    Button,
    Card,
    Form,
    FormInstance,
    GetProp,
    Input,
    InputNumber,
    Select,
    Switch,
    Upload,
    UploadFile,
    UploadProps,
    Image,
    Col,
} from "antd";
import { IVariant } from "../../types";
const { Option } = Select;
import { toDataURL, dataURLtoFile } from "../../utils";
import { EModal } from "../../pages/product/Product";
import { FaTrash } from "react-icons/fa";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type TProps = {
    variantForm: FormInstance<any>;
    handleSubmit?: (values: any) => void;
    currentVariant?: IVariant;
    isModalOpen?: boolean;
};

export default function VariantForm(props: TProps) {
    const [status, setStatus] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onChange = (checked: boolean) => {
        setStatus(checked);
    };

    useEffect(() => {
        setStatus(props.currentVariant?.status ? true : false);
    }, [props.currentVariant]);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    return (
        <>
            <Form
                form={props.variantForm}
                name="dynamic_form_nest_item"
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={props.handleSubmit}
                id={props.currentVariant ? "update-variant" : "add-variant"}
            >
                <Form.List name="variants">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => {
                                return (
                                    <Card
                                        size="small"
                                        title={
                                            <div className="flex items-center justify-between">
                                                {props.currentVariant ? (
                                                    props.currentVariant?.Product.productName
                                                ) : (
                                                    <div> Variant {field.name + 1}</div>
                                                )}

                                                {props.currentVariant && (
                                                    <div className="flex items-center ">
                                                        <Badge dot={status} className="my-2">
                                                            <div className=" p-1 bg-slate-400 text-white rounded-lg text-xs">
                                                                {status ? "Available" : "Unavailable"}
                                                            </div>
                                                        </Badge>
                                                        <Form.Item
                                                            name={[field.name, "status"]}
                                                            className="mb-0"
                                                        >
                                                            <Switch
                                                                checked={status}
                                                                onChange={onChange}
                                                                className="ml-3"
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        key={field.key} // Ensure the Card has a unique key
                                        extra={
                                            !props.currentVariant && (
                                                <FaTrash
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            )
                                        }
                                        className="mb-3 "
                                    >
                                        <div className="flex gap-3">
                                            <Form.Item
                                                label="Import Price"
                                                name={[field.name, "importPrice"]}
                                                labelAlign="left"
                                            >
                                                <InputNumber
                                                    style={{ width: 120 }}
                                                    prefix="$"
                                                    type="number"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label="Retail Price"
                                                name={[field.name, "retailPrice"]}
                                            >
                                                <InputNumber
                                                    style={{ width: 120 }}
                                                    prefix="$"
                                                    type="number"
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="flex gap-6">
                                            <Form.Item label="Color" name={[field.name, "color"]}>
                                                <Select style={{ width: 150 }}>
                                                    <Select.Option value="black">Black</Select.Option>
                                                    <Select.Option value="white">White</Select.Option>
                                                    <Select.Option value="red">Red</Select.Option>
                                                    <Select.Option value="blue">Blue</Select.Option>
                                                    <Select.Option value="yellow">Yellow</Select.Option>
                                                    <Select.Option value="green">Green</Select.Option>
                                                    <Select.Option value="pink">Pink</Select.Option>
                                                    <Select.Option value="purple">Purple</Select.Option>
                                                    <Select.Option value="grey">Grey</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="In Stock"
                                                name={[field.name, "quantityInStock"]}
                                            >
                                                <InputNumber style={{ width: 140 }} type="number" />
                                            </Form.Item>
                                        </div>
                                        <div className="flex gap-5">
                                            <Form.Item label="Ram" name={[field.name, "ram"]}>
                                                <Select style={{ width: 150 }}>
                                                    <Select.Option value="4">4GB</Select.Option>
                                                    <Select.Option value="6">6GB</Select.Option>
                                                    <Select.Option value="8">8GB</Select.Option>
                                                    <Select.Option value="16">16GB</Select.Option>
                                                    <Select.Option value="32">32GB</Select.Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item label="Storage" name={[field.name, "storage"]}>
                                                <Select style={{ width: 150 }}>
                                                    <Select.Option value="64">64GB</Select.Option>
                                                    <Select.Option value="128">128GB</Select.Option>
                                                    <Select.Option value="256">256GB</Select.Option>
                                                    <Select.Option value="512">512GB</Select.Option>
                                                    <Select.Option value="1024">1TB</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        {props.currentVariant && (
                                            <div className="flex gap-3">
                                                <Form.Item label="Barcode" name={[field.name, "barcode"]}>
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item label="Sold" name={[field.name, "quantitySold"]}>
                                                    <InputNumber style={{ width: 120 }} type="number" />
                                                </Form.Item>
                                            </div>
                                        )}

                                        <Form.Item
                                            label="Upload"
                                            valuePropName="fileList"
                                            getValueFromEvent={normFile}
                                            name={[field.name, "images"]}
                                            required={false}
                                            rules={[{ required: true, message: "Please upload an image" }]}
                                        >
                                            <Upload listType="picture-card" onPreview={handlePreview}>
                                                <button
                                                    style={{ border: 0, background: "none" }}
                                                    type="button"
                                                >
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </button>
                                            </Upload>
                                        </Form.Item>
                                    </Card>
                                );
                            })}
                            {!props.currentVariant && (
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                importPrice: 0,
                                                retailPrice: 0,
                                                stock: 0,
                                                ram: "4",
                                                storage: "64",
                                                color: "black",
                                                quantityInStock: 0,
                                            })
                                        }
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Add field
                                    </Button>
                                </Form.Item>
                            )}
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: "none" }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </>
                    )}
                </Form.List>
            </Form>
        </>
    );
}
