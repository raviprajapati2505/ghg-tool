"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import LoaderTemplate from "./LoaderTemplate";

export default function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(false);

    const blockLoaderOnApiActions = useMemo(() => [
        "",
    ], []);

    useEffect(() => {
        const LoaderShowOrNot = (action?: string) => {
            if (!action) return true;
            return action && !blockLoaderOnApiActions.some((blockLoaderOnApiAction) => action.includes(blockLoaderOnApiAction));
        }

        const reqInterceptor = axios.interceptors.request.use(
            (request) => {
                if (LoaderShowOrNot(request?.data?.action)) {
                    if (!request?.data?.isLoading || request?.data?.isLoading === false) {
                        setIsLoading(true);
                    }
                }
                return request;
            },
            (error) => {
                setIsLoading(false);
                return Promise.reject(error);
            }
        );

        const resInterceptor = axios.interceptors.response.use(
            (response) => {
                setIsLoading(false);
                return response;
            },
            (error) => {
                setIsLoading(false);
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        };

    }, [blockLoaderOnApiActions]);

    useEffect(() => {
        import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(err =>
            console.error("Bootstrap JS failed to load", err)
        );
    }, []);


    if (!isLoading) return null;

    return (
        <LoaderTemplate />
    );
}
