import { Pagination, Spin } from "antd"; // If you are using Ant Design for UI components
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import DetailForm from "../../components/Variant/DetailForm";
import UpdateForm from "../../components/Variant/UpdateForm";
import VariantCard from "../../components/Variant/VariantCard";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fecthVariantsByProduct,
    setPagination,
    setSelectedFilters,
} from "../../redux/reducer-type/VariantReducer";
import { EModal } from "../product/Product";
import DeleteForm from "../../components/Variant/DeleteForm";
import NoData from "../../components/Variant/NoData";
import FilterForm from "../../components/Variant/FilterForm";
export default function Variant() {
    const { id } = useParams();
    const { variants, pagination, totalVariants, searchTerm, selectedFilters } = useAppSelector(
        (state) => state.variant
    );
    const dispatch = useAppDispatch();
    const axios = usePrivateAxios();
    const location = useLocation();
    const { currentProduct } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
    const [_id, setId] = useState<string>("");

    // useEffect(() => {
    //     console.log("variants", variants);
    // }, [variants]);

    const currentVariant = useMemo(() => {
        return variants.find((variant) => variant._id === _id);
    }, [variants, _id]);

    useEffect(() => {
        if (id) {
            if (searchTerm || Object.keys(selectedFilters).length > 0) {
                setLoading(true);
            }
            dispatch(
                fecthVariantsByProduct({
                    axiosInstance: axios,
                    productId: id,
                    page: pagination.current!,
                    limit: pagination.pageSize!,
                    barcode: searchTerm,
                    filters: selectedFilters,
                })
            )
                .unwrap()
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching variants:", err);
                    setLoading(false);
                });
        }
    }, [id, dispatch, axios, searchTerm, selectedFilters, pagination]);

    useEffect(() => {
        return () => {
            dispatch(setSelectedFilters({}));
        };
    }, []);

    const handleCancel = () => {
        setIsModalOpen(EModal.NONE);
    };
    const handleChangePage = (page: number, pageSize: number) => {
        dispatch(setPagination({ page, pageSize }));
        dispatch(
            fecthVariantsByProduct({
                axiosInstance: axios,
                productId: id!,
                page: page,
                limit: pageSize,
                barcode: searchTerm,
                filters: selectedFilters,
            })
        );
    };

    return (
        <>
            <div className="h-full p-2 flex flex-col justify-between bg-[#F5F5F7]">
                <FilterForm />

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-5  xl:gap-7  pb-5 ${
                            variants.length <= 5 && "grid-rows-2"
                        } overflow-auto custom-scrollbar`}
                    >
                        {variants.length > 0 ? (
                            variants.map((variant) => {
                                return (
                                    <VariantCard
                                        key={variant._id}
                                        _id={variant._id}
                                        currentProduct={currentProduct}
                                        variant={variant}
                                        setIsModalOpen={setIsModalOpen}
                                        setId={setId}
                                    />
                                );
                            })
                        ) : (
                            <NoData />
                        )}
                    </div>
                )}
                {variants.length > 0 && (
                    <Pagination
                        pageSize={pagination.pageSize}
                        current={pagination.current}
                        total={totalVariants}
                        align="end"
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} variants`}
                        onChange={(page, pageSize) => {
                            handleChangePage(page, pageSize);
                        }}
                    />
                )}
            </div>

            <UpdateForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                currentVariant={currentVariant}
            />

            <DetailForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                currentVariant={currentVariant}
                currentProduct={currentProduct}
            />

            <DeleteForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                currentVariant={currentVariant}
            />
        </>
    );
}
