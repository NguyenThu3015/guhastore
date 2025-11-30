
import React from 'react';


const baseStyles = 'w-full md:w-auto px-6 py-2 rounded-lg transition-colors duration-200 ease-in-out text-sm font-semibold uppercase tracking-wider disabled:opacity-50';

const variants = {
    
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300', 
    
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300',
    
    secondary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300',
    
    warning: 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300',
    
    outline: 'bg-transparent text-gray-700 border border-gray-400 hover:bg-gray-100',
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    
    const classNames = `${baseStyles} ${variants[variant]} ${className}`;

    return (
        <button className={classNames} {...props}>
            {children}
        </button>
    );
};

export default Button;
