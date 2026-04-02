import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const unlockDoor = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  const { door_id } = req.body;

  if (!door_id) {
    res.status(400).json({ success: false, message: 'door_id is required' });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    if (!userData?.subscription_status) {
      res.status(403).json({ success: false, message: 'No active subscription' });
      return;
    }

    const doorDoc = await db.collection('doors').doc(door_id).get();
    if (!doorDoc.exists) {
      res.status(404).json({ success: false, message: 'Door not found' });
      return;
    }

    console.log(`Door ${door_id} unlocked by user ${uid}`);
    res.json({ success: true, message: `Door ${door_id} unlocked` });

  } catch (err: any) {
    if (err.code === 'auth/id-token-expired') {
      res.status(401).json({ success: false, message: 'Token expired' });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to unlock door' });
  }
});