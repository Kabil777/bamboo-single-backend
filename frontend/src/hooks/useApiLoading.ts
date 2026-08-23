import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function useApiLoading(apiLoading?: boolean | Boolean) {
    const status = useSelector((s: RootState) => s.userReducer.status);
    return (
        status === "loading" ||
        (status === "authorized" && Boolean(apiLoading)) ||
        Boolean(apiLoading)
    );
}
