import React from 'react';

const FormContainer = ({ title, children, className = '' }) => {
  return (
    
    <div className={`bg-white/90 p-8 rounded-xl shadow-2xl space-y-6 max-w-3xl mx-auto mt-8 backdrop-blur-md ${className}`}>
      <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-6 border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default FormContainer;
