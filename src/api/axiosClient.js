import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://ophim1.com/",
    timeout: 10000, // Replace with your API timeout
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export default axiosClient;
