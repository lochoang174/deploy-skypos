import axios from 'axios';
const BASE_URL = 'https://skypos.onrender.com/api';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials:true,

});
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials:true,
    fetchOptions:{
        credentials: 'include',
    }
});
