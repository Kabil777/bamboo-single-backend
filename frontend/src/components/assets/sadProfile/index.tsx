import React from "react";

interface sizeIcon {
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export const SadProfile = (props: sizeIcon) => {
    const { width = 42, height = 42, color = "foreground", className } = props;
    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Login</title>
            <rect width={width} height={height} rx="4" fill={color} />
            <circle
                cx="21"
                cy="21"
                r="16.75"
                stroke="background"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M14.2832 28.9941C15.0391 28.3394 16.067 27.8417 17.2227 27.5081C18.3862 27.1723 19.6875 27 21 27C22.3125 27 23.6138 27.1723 24.7774 27.5081C25.933 27.8417 26.9609 28.3394 27.7168 28.9941"
                stroke="background"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle
                cx="15.75"
                cy="17.5"
                r="2"
                fill="background"
                stroke="background"
                strokeWidth="0.5"
                strokeLinecap="round"
            />
            <circle
                cx="26.25"
                cy="17.5"
                r="2"
                fill="background"
                stroke="background"
                strokeWidth="0.5"
                strokeLinecap="round"
            />
        </svg>
    );
};
