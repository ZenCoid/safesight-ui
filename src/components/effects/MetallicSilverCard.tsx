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
            <svg className="metallic-svg">
                <defs>
                    <filter
                        id="turbulent-displace"
                        colorInterpolationFilters="sRGB"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.02"
                            numOctaves="10"
                            result="noise1"
                            seed="1"
                        />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                            <animate
                                attributeName="dy"
                                values="700; 0"
                                dur="6s"
                                repeatCount="indefinite"
                                calcMode="linear"
                            />
                        </feOffset>
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.02"
                            numOctaves="10"
                            result="noise2"
                            seed="1"
                        />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                            <animate
                                attributeName="dy"
                                values="0; -700"
                                dur="6s"
                                repeatCount="indefinite"
                                calcMode="linear"
                            />
                        </feOffset>
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.02"
                            numOctaves="10"
                            result="noise1"
                            seed="2"
                        />
                        <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                            <animate
                                attributeName="dx"
                                values="490; 0"
                                dur="6s"
                                repeatCount="indefinite"
                                calcMode="linear"
                            />
                        </feOffset>
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.02"
                            numOctaves="10"
                            result="noise2"
                            seed="2"
                        />
                        <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                            <animate
                                attributeName="dx"
                                values="0; -490"
                                dur="6s"
                                repeatCount="indefinite"
                                calcMode="linear"
                            />
                        </feOffset>
                        <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
                        <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
                        <feBlend
                            in="part1"
                            in2="part2"
                            mode="color-dodge"
                            result="combinedNoise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="combinedNoise"
                            scale="30"
                            xChannelSelector="R"
                            yChannelSelector="B"
                        />
                    </filter>
                </defs>
            </svg>

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