import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Camera, CodeScanner } from 'react-native-vision-camera';
import Typography from '@/shared/component/typography';
import { normalize } from '@/shared/helpers';

interface ScannerViewProps {
  device: any;
  codeScanner: CodeScanner;
  isScanning: boolean;
  hasPermission: boolean;
}

const { width } = Dimensions.get('window');

export const ScannerView: React.FC<ScannerViewProps> = ({ device, codeScanner, isScanning, hasPermission }) => {
  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <Typography style={styles.errorText}>Camera permission not granted.</Typography>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.errorContainer}>
        <Typography style={styles.errorText}>No camera device found.</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanning}
        codeScanner={codeScanner}
      />

      {/* Scanning Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Typography style={styles.instructionText}>
          Align barcode code within the frame
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '25%',
    backgroundColor: '#000',
    overflow: 'hidden',
    marginTop: normalize(-17),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scannerFrame: {
    width: width * 0.6,
    height: '60%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: normalize(20),
    height: normalize(20),
    borderColor: '#D32F2F',
    borderWidth: 3,
  },
  topLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: '#fff',
    marginTop: normalize(15),
    fontSize: normalize(12),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    borderRadius: normalize(4),
  },
  errorContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  errorText: {
    color: '#fff',
    fontSize: normalize(14),
  },
});
