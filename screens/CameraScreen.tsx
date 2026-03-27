import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AppUser } from '../types/auth';


type BarcodeScanResult = {
  type: string;
  data: string;
};


type CameraScreenProps = {
  user: AppUser;
};


const CameraScreen = ({ user }: CameraScreenProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedDoorId, setScannedDoorId] = useState<string | null>(null);

  const handleScan = ({ data }: BarcodeScanResult) => {
    if (!scanned) {
      setScanned(true);
      setScannedDoorId(data);

      // Reset scan after 3 seconds
      setTimeout(() => setScanned(false), 3000);
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
        onBarcodeScanned={scanned ? undefined : handleScan}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      
      <View style={styles.resultBox}>
        {scannedDoorId ? (
          user.subscription_status ? (
            <>
              <Text style={styles.resultText}>
                Access granted for door {scannedDoorId}!
              </Text>
              <Button
                title="Open Door"
                onPress={() => {
                  // oven aukasu ehkä automaattiseksi myöhemmin
                  console.log(`Unlocking door ${scannedDoorId} for user ${user.id}`);
                }}
              />
            </>
          ) : (
            <Text style={styles.resultText}>
              Access Denied. Subscription inactive.
            </Text>
          )
        ) : (
          <Text style={styles.resultText}>Scan a door QR code</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 3 },
  resultBox: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: { color: 'white', fontSize: 18, marginBottom: 10 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: { color: 'white', fontSize: 16, marginBottom: 10, textAlign: 'center' },
});

export default CameraScreen;