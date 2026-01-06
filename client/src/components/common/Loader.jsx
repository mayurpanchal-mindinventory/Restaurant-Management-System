import React from "react";
import { ClipLoader, ClockLoader, DotLoader, GridLoader, RotateLoader } from "react-spinners";
export default function Loader({ loading = false, size = 40, className = "", color = "orange" }) {
    if (!loading) return null;
    return (
        <div className={`flex justify-center items-center h-full w-full py-6 ${className}`}>
            <ClockLoader loading={loading} size={size} color={color} />
        </div>
    );
}
