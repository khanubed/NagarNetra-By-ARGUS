import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, type MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapShellProps extends MapContainerProps {
  children?: React.ReactNode;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const MapShell: React.FC<MapShellProps> = ({ 
  children, 
  theme = 'auto',
  className = "w-full h-full",
  ...props 
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (theme === 'auto') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);

      // Listen for class changes on html element
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            setIsDark(document.documentElement.classList.contains('dark'));
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme]);

  // Using standard OpenStreetMap to avoid "API Key Required" errors.
  // We simulate a dark theme map using CSS filters when in dark mode.
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className={`relative z-0 ${className}`}>
      <MapContainer 
        zoomControl={false} 
        style={{ width: '100%', height: '100%', zIndex: 0 }} 
        {...props}
      >
        <div className={isDark ? "map-dark-theme" : ""}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />
        </div>
        {children}
      </MapContainer>
    </div>
  );
};
