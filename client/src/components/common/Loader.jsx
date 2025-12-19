import React from "react";
import { ClipLoader } from "react-spinners";
export default function Loader({ loading = false, size = 40, className = "", color = "#2196F3" }) {
    if (!loading) return null;
    return (
        <div className={`flex justify-center items-center h-full w-full py-6 ${className}`}>
            <ClipLoader loading={loading} size={size} color={color} />
        </div>
    );
}
