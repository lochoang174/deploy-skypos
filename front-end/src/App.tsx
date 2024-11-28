// import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/account/Account";
import Product from "./pages/product/Product";
import Transaction from "./pages/transaction/Transaction";
import Login from "./pages/login/Login";
import RequireAuth from "./components/Authentication/RequireAuth";
import Authorized from "./components/Authentication/Authorized";
import LoginByLink from "./pages/login/LoginByLink";
import ChangePassword from "./pages/changePassword/ChangePassword";
import DefaultPage from "./pages/DefaultPage";
import Unauthorized from "./components/Authentication/Unauthorized";
import Variant from "./pages/variant/Variant";
import CustomerTransaction from "./pages/customer/CustomerTransaction";
import Customer from "./pages/customer/Customer";
import ExecuteTransaction from "./pages/transaction/ExecuteTransaction";
import Profile from "./pages/profile/Profile";
import DetailTransaction from "./pages/dashboard/DetailTransaction";
import StaffTransaction from "./pages/account/StaffTransaction";

const ROLES = {
    STAFF: 1,
    Admin: 0,
};

function App() {
    return (
        
        <Router>
            <Routes>
                <Route path="/" element={<DefaultPage />} />
                <Route path="login" element={<Login />} />
                <Route path="loginByLink/:token" element={<LoginByLink />} />
                <Route path="home" element={<RequireAuth />}>
                    <Route element={<Layout />}>
                        <Route element={<Authorized allowedRoles={[ROLES.Admin, ROLES.STAFF]} />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="detail-transaction" element={<DetailTransaction />} />
                        </Route>
                        <Route element={<Authorized allowedRoles={[ROLES.Admin]} />}>
                            <Route path="account" element={<Account />} />
                            <Route
                                path="staff/:staffId/transactions"
                                element={<StaffTransaction />}
                            />
                        </Route>
                        <Route element={<Authorized allowedRoles={[ROLES.Admin]} />}>
                            <Route path="product" element={<Product />} />
                            <Route path="variant/product/:id" element={<Variant />} />
                        </Route>
                        <Route element={<Authorized allowedRoles={[ROLES.Admin]} />}>
                            <Route path="customer" element={<Customer />} />
                            <Route
                                path="customer/:customerId/transactions"
                                element={<CustomerTransaction />}
                            />
                        </Route>
                        <Route element={<Authorized allowedRoles={[ROLES.Admin, ROLES.STAFF]} />}>
                            <Route path="transaction" element={<ExecuteTransaction />} />
                        </Route>
                    </Route>
                    <Route path="changePassword" element={<ChangePassword />} />
                    <Route path="unauthorized" element={<Unauthorized />} />
                </Route>
                <Route path="profile" element={<Profile />} />

                {/* <Route element={<Authorized allowedRoles={[ROLES.STAFF]} />}> */}
                {/* </Route> */}

                {/* <Route path="/auth" element={<AuthLayout />}>
        </Route>
        <Route path="callback" element={<CallbackPage />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
