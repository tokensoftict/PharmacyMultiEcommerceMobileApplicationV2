import React from 'react';
import { SNOW_COUNT, SNOW_SPEED_FACTOR } from '../seasonalConfig';
import { useSeasonalTheme } from '../SeasonalThemeProvider';
import ParticleField from './ParticleField';

/** Continuous snowfall. Intensity / speed / opacity all come from the backend. */
const SnowfallAnimation: React.FC = () => {
    const { config } = useSeasonalTheme();
    return (
        <ParticleField
            kind="snow"
            count={SNOW_COUNT[config.snowfall_intensity]}
            speedFactor={SNOW_SPEED_FACTOR[config.snowfall_speed]}
            opacity={config.snowfall_opacity * config.background_effect_opacity}
        />
    );
};

export default SnowfallAnimation;

