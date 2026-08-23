"use client";

import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function OAuthCallback() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAuthentication())
            .unwrap()
            .then(() => router.replace("/"))
            .catch(() => router.replace("/login"));
    }, [dispatch, router]);

    return <p>Signing you in...</p>;
}
