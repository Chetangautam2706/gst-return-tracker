import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  ProcessingInstruction.env.FIREBASE_SERVICE_ACCOUNT,
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
