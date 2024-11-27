import { Form, Modal, Switch, UploadFile } from "antd";
import React, { useEffect, useState } from "react";
import { EModal } from "../../pages/product/Product";
import VariantForm from "./VariantForm";
import { IVariant } from "../../types";
import { useActionData } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch } from "../../redux/hooks";
import { editVariant } from "../../redux/reducer-type/VariantReducer";
type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    currentVariant: IVariant | undefined;
};
export default function UpdateForm(props: TProps) {
    const [variantForm] = Form.useForm();
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();
    // const handleSubmit = async (values: any) => {};

    useEffect(() => {
        if (props.isModalOpen == EModal.NONE) {
            return;
        }
        const {
            importPrice = 0,
            retailPrice = 0,
            quantityInStock = 0,
            ram = 0,
            storage = 0,
            color = "",
            images = [],
            barcode = "",
            status = "",
            quantitySold = 0,
        } = props.currentVariant || {};

        const convertImage = [] as UploadFile[];
        const productId = props.currentVariant?.Product._id ?? props.currentVariant?.Product;
        for (const image of images) {
            const newImage =
                import.meta.env.VITE_BE_URL +
                "/public/images/" +
                productId +
                "/" +
                props.currentVariant?._id +
                "/" +
                image;

            convertImage.push({
                uid: image || `${Date.now()}-${Math.random()}`,
                name: image,
                status: "done",
                url: newImage,
            });
        }
        variantForm.setFieldsValue({
            variants: [
                {
                    importPrice,
                    retailPrice,
                    quantityInStock,
                    ram: ram.toString(),
                    storage: storage.toString(),
                    color,
                    images: convertImage,
                    barcode,
                    status,
                    quantitySold,
                },
            ],
        });
    }, [variantForm, props.currentVariant, props.isModalOpen]);

    const handleSubmit = async (values: any) => {
        try {
            console.log("values", values.variants[0].status);
            // values.variants[0].status = values.variants[0].status ? "Available" : "Unavailable";
            const existingImages = values.variants[0].images.filter((image: any) => image.url); // Retained images
            const newImages = values.variants[0].images.filter((image: any) => image.originFileObj); // New images to upload
            values.variants[0] = {
                ...values.variants[0],
                Product: props.currentVariant?.Product._id,
                images: existingImages.map((image: any) => image.name), // Use name for existing images
            };

            const formData = new FormData();
            formData.append("importPrice", values.variants[0].importPrice);
            formData.append("retailPrice", values.variants[0].retailPrice);
            formData.append("color", values.variants[0].color);
            formData.append("ram", values.variants[0].ram);
            formData.append("storage", values.variants[0].storage);
            formData.append("status", values.variants[0].status);
            formData.append("quantityInStock", values.variants[0].quantityInStock);
            formData.append("quantitySold", values.variants[0].quantitySold);

            // Append existing image files
            existingImages.forEach((image: any) => {
                formData.append("existingImages", image.name);
            });

            // Append new image files
            newImages.forEach((image: any) => {
                formData.append("images", image.originFileObj);
            });

            await axios
                .put(`/variant/${props.currentVariant?._id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    const Product = props.currentVariant?.Product;
                    res.data.data.Product = Product;
                    console.log("update variant", res.data.data);
                    dispatch(editVariant(res.data.data));
                    props.handleCancel();
                });
        } catch (error) {
            console.log("Error", error);
        }
    };
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen == EModal.UPDATE}
                centered
                title={<div className="text-lg font-semibold">Update Variant</div>}
                onCancel={props.handleCancel}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "update-variant",
                    htmlType: "submit",
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
            >
                <div className="flex justify-between gap-5 h-[75vh]">
                    <div className="flex-1 overflow-auto scrollbar-vanish">
                        <VariantForm
                            variantForm={variantForm}
                            currentVariant={props.currentVariant}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}
