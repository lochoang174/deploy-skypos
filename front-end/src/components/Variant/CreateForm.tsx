import { Form, Modal } from "antd";
import React, { useEffect } from "react";
import { EModal } from "../../pages/product/Product";
import VariantForm from "./VariantForm";
import { useParams } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addVariant, setPagination } from "../../redux/reducer-type/VariantReducer";

type TProps = {
    isModalOpen: EModal;
    setIsModalOpen: React.Dispatch<React.SetStateAction<EModal>>;
};
export default function CreateForm(props: TProps) {
    const { id } = useParams();
    const [variantForm] = Form.useForm();
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();
    const { variants, totalVariants, pagination } = useAppSelector((state) => state.variant);

    useEffect(() => {
        console.log("variants", variants);
    }, [variants]);

    const handleSubmit = async () => {
        const { current, pageSize } = pagination;
        const isLastPageFull = totalVariants % pageSize! === 0;
        if (variantForm.getFieldValue("variants").length === 0) {
            return;
        }
        const variants = await variantForm.getFieldValue("variants").map((variant: any) => ({
            ...variant,
            Product: id,
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
                .then((res) => {
                    dispatch(addVariant(res.data.data));
                    if (isLastPageFull && pagination.current !== 1) {
                        dispatch(setPagination({ page: current! + 1, pageSize: pageSize! }));
                    }
                })
                .catch((err) => {
                    console.error("Error adding variant:", err);
                });
        }

        props.setIsModalOpen(EModal.NONE);
    };

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
    }, [props.isModalOpen]);
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen === EModal.CREATE}
                centered
                onCancel={() => props.setIsModalOpen(EModal.NONE)}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "add-variant",
                    htmlType: "submit",
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
            >
                <div className="h-[75vh] overflow-auto scrollbar-vanish">
                    <p className="sticky top-0 bg-white z-10 pb-2 text-lg">Variant</p>
                    <div>
                        <VariantForm variantForm={variantForm} handleSubmit={handleSubmit} />
                    </div>
                </div>
            </Modal>
        </>
    );
}
