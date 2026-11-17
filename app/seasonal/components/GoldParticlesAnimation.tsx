import React from 'react';
import { useSeasonalTheme } from '../SeasonalThemeProvider';
import ParticleField from './ParticleField';

const COUNT = { low: 12, medium: 20, high: 30 } as const;

/** Slowly falling, softly glowing gold particles (New Year golden theme). */
const GoldParticlesAnimation: React.FC = () => {
    const { config } = useSeasonalTheme();
    return (
        <ParticleField
            kind="gold"
            count={COUNT[config.decoration_intensity]}
            opacity={0.85 * config.background_effect_opacity}
        />
    );
};

export default GoldParticlesAnimation;

