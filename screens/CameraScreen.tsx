import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

type BarcodeScanResult = {
  type: string;
  data: string;
};

type User = {
  id: string;
};

type CameraScreenProps = {
  user: User;
};

const CameraScreen = ({ user }: CameraScreenProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedDoorId, setScannedDoorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleScan = async ({ data }: BarcodeScanResult) => {

  // prevent multiple scans
  if (scanned) return;

  setScanned(true);
  setScannedDoorId(data);
  setLoading(true);
  setSuccess(null);

  try {
    const res = await fetch('http://192.168.1.124:3000/api/doors/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ door_id: data }), // make sure 'data' is a valid door ID
    });

    const response = await res.json();
    console.log('Unlock response:', response);

    if (response.success) setSuccess(true);
    else setSuccess(false);
  } catch (err) {
    console.error(err);
    setSuccess(false);
  } finally {
    setLoading(false);
    // reset for next scan after 3s
    setTimeout(() => {
      setScanned(false);
      setScannedDoorId(null);
      setSuccess(null);
    }, 3000);
  }


  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        style={styles.camera}
        onBarcodeScanned={handleScan} // always active
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay result */}
      <View style={styles.overlay}>
        {scannedDoorId && (
          <View style={styles.resultBox}>
            {loading ? (
              <>
                <Text style={styles.loadingText}>
                  Unlocking door {scannedDoorId}...
                </Text>
                <ActivityIndicator size="large" color="lime" />
              </>
            ) : success === true ? (
              <Text style={[styles.feedbackText, { color: 'lime' }]}>
                Door {scannedDoorId} unlocked!
              </Text>
            ) : (
              <Text style={[styles.feedbackText, { color: 'red' }]}>
                Failed to unlock door.
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // allow touches to pass to camera
  },

  resultBox: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '80%',
  },

  feedbackText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  loadingText: { color: 'white', fontSize: 18, marginBottom: 10, textAlign: 'center' },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  permissionText: { color: 'white', fontSize: 16, marginBottom: 10, textAlign: 'center' },
});

export default CameraScreen;
