import React from 'react';

interface InputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = 'text', error }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} className={`form-control ${error ? 'is-invalid' : ''}`} />
            {error && <small className="text-danger">{error}</small>}
        </div>
    );
};

export default Input;
