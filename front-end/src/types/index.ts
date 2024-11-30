export interface IAuth {
    _id: string;
    email: string; // Corrected typo here
    username: string;
    name: string;
    role: number; // 0 admin, 1 staff,
    avatar: string | null;
    isLock: boolean;
    isCreated: boolean;
}

export interface IProduct {
    _id: string;
    productName: string;
    category: string;
    description: string;
    createdAt: Date;
}

export interface IProductDetail {
    _id: string;
    barcode: string;
    Product: {
        _id: string,
        productName: string
    };
    retailPrice: number;
    color: string;
    ram: number;
    storage: number;
}

export interface IProductTransaction {
    productDetails: IProductDetail;
    quantity: number;
    total: number;
}

export interface IProductPayload {
    products: IProduct[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}

export interface IAccount {
    _id: string;
    name: string;
    email: string;
    username: string;
    role: number;
    avatar?: string;
    isLock: boolean;
    isCreated: boolean;
}

export interface ITransaction {
    _id: string;
    staffName: string;
    customerName: string;
    totalAmount: Number;
    purchaseDate: Date;
}

export interface ITransactionDetail {
    _id: string;
    staffName: string;
    Customer: ICustomer;
    totalAmount: number;
    amountPaid: number;
    purchaseDate: Date;
    refund: number;
    status: string;
    products: IProductTransaction[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AccountsPayload {
    staffList: IAccount[];
    currentPage: number;
    totalPages: number;
    totalStaff: number;
}

export interface ICustomer {
    _id: string;
    email: string;
    name: string;
    address: string;
    phoneNumber: string;
}

export interface CustomersPayload {
    customerList: ICustomer[];
    currentPage: number;
    totalPages: number;
    totalCustomer: number;
}

export interface TransactionsPayLoad {
    transactionList: ITransaction[];
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
}

export interface StaffTransactionsPayload {
    transactionList: ITransaction[];
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    totalRevenue: number;
}
export interface IVariant {
    _id: string;
    importPrice: string;
    retailPrice: number;
    color: string;
    ram: string;
    storage: string;
    images: string[];
    barcode: string;
    Product: IProduct;
    status: boolean;
    quantityInStock: number;
    quantitySold?: number;
}

export interface IVariantPayload {
    variants: IVariant[];
    currentPage: number;
    totalPages: number;
    totalVariants: number;
}
export interface ICart {
    variant: IVariant;
    quantity: number;
    total: number;
}

export type TTransaction = {
    _id: string;
    Staff: string;
    Customer: string;
    totalAmount: number;
    amountPaid: number;
    status: string;
    purchaseDate: Date;
    refund: number;
    createdAt: Date;
    updatedAt: Date;
};

export interface IStatistic {
    _id: string;
    totalAmountReceived: number;
    numberOfOrders: number;
    numberOfProductsSold: number;
    profit: number;
    detail: IDetail[];
}

export interface IDetail {
    date: Date;
    numOfProduct: number;
    numOfTransaction: number;
}

export interface IOrder {
    _id: string;
    customer: string;
    staff: string;
    totalAmount: number;
    amountPaid: number;
    refund: number;
    purchaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
    numberOfProductsSold: number;
    status: string;
}

export interface IStatisticPayload {
    data: IStatistic;
}

export interface IOrderPayload {
    data: IOrder[];
}

export type TDetailData = {
    name: string;
    date: Date;
    total: number;
};
