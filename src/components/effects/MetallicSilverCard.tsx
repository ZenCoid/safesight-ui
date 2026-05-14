import React from 'react';

interface MetallicSilverCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const MetallicSilverCard: React.FC<MetallicSilverCardProps> = ({
    children,
    className = '',
    style,
}) => {
    return (
        <div className={`static-silver-card ${className}`} style={style}>
            <div className="static-silver-card-content">
                {children}
            </div>
        </div>
    );
};

export default MetallicSilverCard;