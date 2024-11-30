import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { Input, Pagination, Space, Table } from "antd";
import { FilterValue } from "antd/es/table/interface";
import React, { Key, useEffect, useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DeleteForm from "../../components/Product/DeleteForm";
import UpdateForm from "../../components/Product/UpdateForm";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProducts, setPagination, setSelectedCategories } from "../../redux/reducer-type/ProductReducer";
import { IProduct } from "../../types";

const { TextArea } = Input;
type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

export enum EModal {
    CREATE,
    DETAIL,
    UPDATE,
    DELETE,
    NONE,
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const Product = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);

    const { products, totalProducts, pagination, selectedCategories, searchTerm } = useAppSelector(
        (state) => state.product
    );
    const dispatch = useAppDispatch();
    const axios = usePrivateAxios();

    const [_id, setId] = useState<string>("");
    const currentProduct = useMemo(() => {
        return products.find((product) => product._id === _id);
    }, [products, _id]);

    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm || selectedCategories.length > 0) {
            setLoading(true);
        }
        // console.log("searchTerm", searchTerm);

        dispatch(
            fetchProducts({
                axiosInstance: axios,
                page: pagination.current!,
                limit: pagination.pageSize!,
                productName: searchTerm,
                categories: selectedCategories,
            })
        )
            .unwrap()
            .then(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [dispatch, axios, selectedCategories, searchTerm, pagination]);

    const handleChangePage = (page: number, pageSize: number) => {
        dispatch(setPagination({ page, pageSize }));
        dispatch(
            fetchProducts({
                axiosInstance: axios,
                limit: pageSize,
                page: page,
                productName: searchTerm,
                categories: selectedCategories,
            })
        );
    };

    useEffect(() => {
        if (selectedCategories.length > 0) {
            // console.log("Categories:", selectedCategories);
        }
    }, [selectedCategories]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>
    ) => {
        const categories = filters.category as string[] | null; // Capture selected categories from filters
        dispatch(setSelectedCategories(categories || [])); // Update selected categories
        dispatch(setPagination({ page: 1, pageSize: pagination.pageSize || 8 }));
    };

    const dataSourceProducts = products.map((product) => ({
        ...product,
        key: product._id, // Use _id as the key field
    }));

    const showModal = (modal: EModal) => {
        setIsModalOpen(modal);
    };

    const handleCancel = () => {
        setIsModalOpen(EModal.NONE);
    };

    const columns: TableColumnsType<IProduct> = [
        {
            title: "Name",
            dataIndex: "productName",
            key: "productName",
            width: 400,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            filters: [
                { text: "Phone", value: "phone" },
                { text: "Laptop", value: "laptop" },
                { text: "Headphone", value: "headphone" },
                { text: "Keyboard", value: "keyboard" },
            ],
            filteredValue: selectedCategories.length > 0 ? selectedCategories : null,
            onFilter: (value, record) => {
                return record.category === value;
            },
            width: 100,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => formatDate(text),
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <div
                        className="cursor-pointer text-[#207C96] hover:text-[#40A0B2] hover:scale-110 transition-transform duration-300 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setId(record._id);
                            showModal(EModal.UPDATE);
                        }}
                    >
                        <MdModeEdit size={20} />
                    </div>
                    <div
                        className="cursor-pointer text-[#DC6691] hover:text-[#F080A3] hover:scale-110 transition-transform duration-300 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setId(record._id);
                            showModal(EModal.DELETE);
                        }}
                    >
                        <FaTrash size={18} />
                    </div>
                </Space>
            ),
        },
    ];
    return (
        <>
            <div className="h-full p-2 flex flex-col justify-between">
                <div className=" overflow-auto">
                    <Table<IProduct>
                        size="small"
                        columns={columns}
                        dataSource={dataSourceProducts}
                        pagination={false} // Hide internal pagination
                        loading={loading}
                        rowClassName={(record, index) =>
                            "cursor-pointer transition-all duration-200 ease-in-out  active:bg-gray-300 !h-4"
                        }
                        onRow={(record, index) => {
                            return {
                                onClick: (event) => {
                                    navigate(`/home/product/variant/${record._id}`, {
                                        state: { currentProduct: record },
                                    });
                                },
                            };
                        }}
                        onChange={handleTableChange}
                    />
                </div>
                <Pagination
                    pageSize={pagination.pageSize}
                    current={pagination.current}
                    total={totalProducts}
                    showQuickJumper
                    align="end"
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
                    pageSizeOptions={["8", "16", "32"]}
                    onChange={(page, pageSize) => {
                        handleChangePage(page, pageSize);
                    }}
                />
            </div>
            <UpdateForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                currentProduct={currentProduct}
            />
            <DeleteForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                currentProduct={currentProduct}
            />
        </>
    );
};

export default Product;
