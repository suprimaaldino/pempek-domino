import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const setupAdmin = async () => {
  const user = auth.currentUser;
  if (!user || user.email !== 'allmight@pempekdomino.com') {
    return false;
  }

  try {
    // Cek apakah admin sudah ada
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (!adminDoc.exists()) {
      // Buat dokumen admin baru
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        displayName: user.displayName || 'Admin Pempek Domino',
      });
      console.log('✅ Admin user created successfully');
      return true;
    }
    
    console.log('ℹ️ Admin user already exists');
    return true;
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    return false;
  }
};