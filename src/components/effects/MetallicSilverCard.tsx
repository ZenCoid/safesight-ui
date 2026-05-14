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
        <div className={`metallic-card-root ${className}`} style={style}>
            {/* No inline SVG – filter is in index.html */}

            <div className="metallic-card-container">
                <div className="metallic-inner-container">
                    <div className="metallic-border-outer">
                        <div className="metallic-main-card" />
                    </div>
                    <div className="metallic-glow-layer-1" />
                    <div className="metallic-glow-layer-2" />
                </div>
                <div className="metallic-overlay-1" />
                <div className="metallic-overlay-2" />
                <div className="metallic-background-glow" />
                <div className="metallic-content-container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MetallicSilverCard;