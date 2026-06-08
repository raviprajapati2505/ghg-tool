import { showErrorNotification, showSuccessNotification } from "@/helpers/client/swal_fire_helper";
import axios, { AxiosRequestConfig } from "axios";
import { toastify } from "./toast";

/**
 * Generic API call helper
 * @param url - API endpoint
 * @param data - Request body data (can include `action`)
 * @param config - Optional Axios config (e.g., custom headers)
 * @returns Response data or null
 */
const callApi = async (
    url: string,
    data: Record<string, any> | FormData,
    successNotifShow?: any,
    errorNotifShow?: any,
    config?: AxiosRequestConfig
): Promise<any | null> => {
    try {
        const isFormData = data instanceof FormData;
        const finalConfig: AxiosRequestConfig = {
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
            },
            ...config,
        };
        const apiData = isFormData ? data : JSON.stringify(data);
        const res = await axios.post(url, apiData, finalConfig);
        if (finalConfig?.responseType === "blob") {
            return res;
        }

        const resData = res.data;

        if (resData?.status === 200) {
            if (successNotifShow && resData?.message) {
                // showSuccessNotification(resData?.message);
                toastify({ message: resData?.message });
            }
        } else if (errorNotifShow && resData?.message) {
            showErrorNotification(resData?.message);
        }

        return resData;
    } catch (error: any) {
        console.error("API call error:", error);
        return [];
    }
};


export default callApi;
