import React from 'react';
import { useSeasonalTheme } from '../SeasonalThemeProvider';
import ParticleField from './ParticleField';

const COUNT = { low: 14, medium: 22, high: 32 } as const;

/** Golden confetti (New Year). Density follows the fireworks/decoration intensity chosen by the admin. */
const ConfettiAnimation: React.FC = () => {
    const { config } = useSeasonalTheme();
    return (
        <ParticleField
            kind="confetti"
            count={COUNT[config.fireworks_intensity]}
            opacity={0.9 * config.background_effect_opacity}
        />
    );
};

export default ConfettiAnimation;

