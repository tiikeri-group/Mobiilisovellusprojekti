import { useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { AppUser } from '../types/auth';
import { auth } from '../firebaseConfig';

type BarcodeScanResult = {
  type: string;
  data: string;
};

type CameraScreenProps = {
  user: AppUser;
};

const CameraScreen = ({ user }: CameraScreenProps) => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedDoorId, setScannedDoorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [failMessage, setFailMessage] = useState<string>('');

  const handleScan = async ({ data }: BarcodeScanResult) => {
    if (scanned) return;

    setScanned(true);
    setScannedDoorId(data);
    setLoading(true);
    setSuccess(null);
    setFailMessage('');

        if (!user.subscription_status) {
      setLoading(false);
      setSuccess(false);
      setFailMessage('Et ole asiakas');

      setTimeout(() => {
        setScanned(false);
        setScannedDoorId(null);
        setSuccess(null);
        setFailMessage('');
      }, 1500);

      return;
    }

    let unlocked = false;

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('https://unlockdoor-5hvgj6tc5a-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ door_id: data }),
      });

      const rawText = await res.text();
      const response = JSON.parse(rawText);

      if (response.success) {
        unlocked = true;
        setSuccess(true);
      } else {
        setFailMessage(res.status === 403 ? 'Door unlock failed: no active subscription' : 'Door unlock failed');
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setFailMessage('Door unlock failed');
      setSuccess(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (unlocked) navigation.navigate('Home' as never);
        setScanned(false);
        setScannedDoorId(null);
        setSuccess(null);
      }, 1500);
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
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={handleScan}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        {scannedDoorId && (
          <View style={styles.resultBox}>
            {loading ? (
              <>
                <Text style={styles.loadingText}>Unlocking...</Text>
                <ActivityIndicator size="large" color="lime" />
              </>
            ) : success === true ? (
              <Text style={[styles.feedbackText, { color: 'lime' }]}>
                Door Unlocked
              </Text>
            ) : (
              <Text style={[styles.feedbackText, { color: 'red' }]}>
                {failMessage}
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
    pointerEvents: 'none',
  },
  resultBox: {
    position: 'absolute',
    bottom: '15%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '80%',
  },
  scanBox: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
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