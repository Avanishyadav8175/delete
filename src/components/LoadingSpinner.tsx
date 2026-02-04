import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-6 w-6',
        large: 'h-8 w-8'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white border-t-transparent`}></div>
        </div>
    );
};

export default LoadingSpinner; 