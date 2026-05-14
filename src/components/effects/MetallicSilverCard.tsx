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
        <div className={`metallic-card-wrapper ${className}`} style={style}>
            <div className="metallic-card-inner">
                <div className="metallic-card-border-outer">
                    <div className="metallic-card-main" />
                </div>
                <div className="metallic-card-glow-1" />
                <div className="metallic-card-glow-2" />
            </div>
            <div className="metallic-card-overlay-1" />
            <div className="metallic-card-overlay-2" />
            <div className="metallic-card-bg-glow" />
            <div className="metallic-card-content">
                {children}
            </div>
        </div>
    );
};

export default MetallicSilverCard;