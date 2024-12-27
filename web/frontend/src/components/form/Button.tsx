import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    styleType?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, styleType = 'primary' }) => {
    const className = `btn btn-${styleType}`;
    return (
        <button onClick={onClick} disabled={disabled} className={className}>
            {label}
        </button>
    );
};

export default Button;
