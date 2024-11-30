import { Input } from "antd";
import { useEffect, useState } from "react";
import { IoArrowBackCircle, IoSearchOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useDebounce from "../../hooks/useDebounce"; // Assuming you have a debounce hook
// import { fetchProducts, setPagination, setSearchTerm } from "../../redux/reducer-type/ProductReducer";
import { setSearchTerm } from "../../redux/reducer-type/StaffTransactionReducer";
export function StaffTransactionHeader() {
    // const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
    const { searchTerm, totalRevenue } = useAppSelector((state) => state.staffTransaction);
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
        <div className="pr-5 flex items-center justify-between">
            <div className="flex flex-1 gap-2">
                    <IoArrowBackCircle
                        size={32}
                        className="cursor-pointer transition-all transform  hover:opacity-70 "
                        onClick={() => window.history.back()}
                    />
            <Input
                placeholder="Search customer from your transactions"
                prefix={<IoSearchOutline />}
                className="w-2/3"
                onChange={handleSearchChange}
                value={search}
            />
            </div>
            <div className="font-semibold text-lg">
                Total Revenue:{" "}
                {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(totalRevenue)}
            </div>
        </div>
    );
}
