
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    
    const defaultClasses = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300';

    return (
        <div className={`${defaultClasses} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
