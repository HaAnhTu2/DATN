import React from 'react';

interface SelectProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, value, onChange, error }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <select value={value} onChange={onChange} className={`form-control ${error ? 'is-invalid' : ''}`}>
                <option value="" disabled>
                    Please select...
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <small className="text-danger">{error}</small>}
        </div>
    );
};

export default Select;
