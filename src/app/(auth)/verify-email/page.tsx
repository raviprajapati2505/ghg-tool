"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSearchParams, useRouter } from "next/navigation";
import callApi from "@/utils/callApi";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [uid, setUid] = useState('');
    const [utoken, setUtoken] = useState('');
    const searchParams = useSearchParams();
    useEffect(() => {
        if (searchParams) {
            setUid(searchParams.get("id") || "");
            setUtoken(searchParams.get("token") || "");
        }
    }, []);

    const [loading, setLoading] = useState(true);

    const verifyUserEmail = async () => {
        try {

            const res = await callApi("/api/auth/verify-email", {
                id: uid,
                token: utoken,
            });

            if (res?.status === 200 && res?.message) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: res?.message,
                    confirmButtonColor: "#224b6bff",
                    confirmButtonText: "Login",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/login");
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    confirmButtonColor: "#224b6bff",
                    text: res?.message || "Invalid or expired link",
                }).then(() => {
                    router.push("/login");
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                confirmButtonColor: "#224b6bff",
                text: "Something went wrong, please try again",
            }).then(() => {
                router.push("/login");
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (utoken && uid) {
            verifyUserEmail();
        } else {
            setLoading(false);
        }
    }, [utoken, uid]);

    return (
        <>
            {loading && (
                <div className="flex justify-center items-center h-screen bg-image">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </>
    );
}
