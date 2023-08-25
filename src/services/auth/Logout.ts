import instance from "../api";
import { message } from "antd";

export const LogoutApi = async () => {
    const { data } = await instance("auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if(data.status === 400){
        alert('Invalid username or password');
        document.location.replace('/login');
    }else{
        localStorage.removeItem("token");
        document.location.replace('/');
    }
    document.location.replace('/login');
};