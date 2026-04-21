import { useState, useCallback, useEffect } from 'react';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

export const useScanner = (onScan: (code: string) => void) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isScanning, setIsScanning] = useState(true);
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39'],
    onCodeScanned: (codes) => {
      if (isScanning && codes.length > 0 && codes[0].value) {
        setIsScanning(false);
        onScan(codes[0].value);
        
        // Debounce: allow scanning again after 2 seconds
        setTimeout(() => {
          setIsScanning(true);
        }, 2000);
      }
    },
  });

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return {
    device,
    hasPermission,
    codeScanner,
    isScanning,
  };
};
