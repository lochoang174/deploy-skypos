import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { EModal } from "../../pages/product/Product";
import CreateForm from "../Product/CreateForm";
import { IoSearchOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useDebounce from "../../hooks/useDebounce"; // Assuming you have a debounce hook
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { fetchProducts, setPagination, setSearchTerm } from "../../redux/reducer-type/ProductReducer";

export function ProductHeader() {
    const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
    const { searchTerm } = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState(searchTerm);
    useDebounce(
        () => {
            dispatch(setSearchTerm(search));
        },
        500,
        [search]
    );

    const showModal = () => {
        setIsModalOpen(EModal.CREATE);
    };

    const handleCancel = () => {
        setIsModalOpen(EModal.NONE);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue); // Update local search state, debounced API call will follow
    };

    return (
        <div className="pr-5 pl-10 flex items-center justify-between">
            <Input
                placeholder="Search product by name"
                prefix={<IoSearchOutline />}
                className="w-2/3"
                onChange={handleSearchChange}
                value={search}
            />
            <Button color="default" variant="solid" size="large" onClick={showModal}>
                <FaCirclePlus />
                Add Product
            </Button>
            <CreateForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                setIsModalOpen={setIsModalOpen}
            />
        </div>
    );
}
