import React from "react";
import { EModal } from "../../pages/product/Product";
import { IVariant } from "../../types";
import { Modal } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import {
    deleteVariant,
    fecthVariantsByProduct,
    setPagination,
} from "../../redux/reducer-type/VariantReducer";

type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    currentVariant: IVariant | undefined;
};

export default function DeleteForm(props: TProps) {
    const dispatch = useAppDispatch();
    const axios = usePrivateAxios();

    const { totalVariants, pagination, selectedFilters } = useAppSelector((state) => state.variant);
    const handleSubmit = async () => {
        await axios.delete(`/variant/${props.currentVariant?._id}`).then(() => {
            dispatch(deleteVariant(props.currentVariant?._id));
            const isLastPage = Math.ceil(totalVariants / pagination.pageSize!) === pagination.current;
            if (!isLastPage) {
                dispatch(
                    fecthVariantsByProduct({
                        axiosInstance: axios,
                        productId: props.currentVariant?.Product._id,
                        page: pagination.current!,
                        limit: pagination.pageSize!,
                        barcode: "",
                        filters: selectedFilters,
                    })
                );
            } else if (isLastPage && pagination.current !== 1) {
                dispatch(
                    fecthVariantsByProduct({
                        axiosInstance: axios,
                        productId: props.currentVariant?.Product._id,
                        page: pagination.current! - 1,
                        limit: pagination.pageSize!,
                        barcode: "",
                        filters: selectedFilters,
                    })
                );
                dispatch(
                    setPagination({
                        page: pagination.current! - 1,
                        pageSize: pagination.pageSize!,
                    })
                );
            }
            props.handleCancel();
        });
    };
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen === EModal.DELETE}
                onCancel={props.handleCancel}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "update-product",
                    onClick: handleSubmit,
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
                width={400}
            >
                <p>
                    Are you sure you want to delete this Variant with Barcode:
                    <span className="text-[#DC6691] font-semibold"> {props.currentVariant?.barcode}</span>
                </p>
            </Modal>
        </>
    );
}
