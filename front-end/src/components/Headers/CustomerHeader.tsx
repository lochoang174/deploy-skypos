import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useDebounce from "../../hooks/useDebounce"; // Assuming you have a debounce hook
// import { fetchProducts, setPagination, setSearchTerm } from "../../redux/reducer-type/ProductReducer";
import { setSearchTerm } from "../../redux/reducer-type/CustomerReducer";
export function CustomerHeader() {
    // const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
    };

    return (
        <div className="pr-5 pl-10 flex items-center justify-between">
            <Input
                placeholder="Search customer"
                prefix={<IoSearchOutline />}
                className="w-2/3"
                onChange={handleSearchChange}
                value={search}
            />
            {/* <Button color="default" variant="solid" size="large" onClick={showModal}>
                <FaCirclePlus />
                Add Product
            </Button>
            <CreateForm
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                setIsModalOpen={setIsModalOpen}
            /> */}
        </div>
    );
}