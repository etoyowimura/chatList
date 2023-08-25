import instance from "../api";
import {message} from "antd";

export const LoginApi = async ( username : string, password : string ) => {

    try {
        const { data } = await instance("auth/login/", {
            method: "POST",
            data: { username, password },
            headers: { "Content-Type": "application/json" },
        });
        if(data.status === 400){
            alert('Invalid username or password');
            document.location.replace('/login');
        }else{
            localStorage.setItem("token" , data.token);
            document.location.replace('/');
        }
    } catch (err) {
        setTimeout(() => {
            message.error({ content: 'Invalid username or password',  duration: 2});
        }, 100);
        // throw new Error("Something went wrong");
    }
}