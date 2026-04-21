import React from 'react';
import Link from 'next/link';

const Button = ({ children, variant = 'primary', className = '', href, ...props }) => {
    const baseStyle = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500",
        secondary: "bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-200 hover:bg-blue-50 focus:ring-blue-200",
        outline: "bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 focus:ring-white/50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-blue-600 focus:ring-slate-200"
    };

    const classes = `${baseStyle} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;
