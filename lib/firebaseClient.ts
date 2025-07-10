// lib/firebaseClient.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// Importar getFirestore se formos usar Firestore diretamente do cliente para algo além de auth.
// Por enquanto, focaremos na autenticação.
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdWzf45GmW58N7sy7WMT9MG9G4Jy3wjsg", // Substitua pela sua API Key real se for diferente
  authDomain: "planeta-projeto.firebaseapp.com",
  projectId: "planeta-projeto",
  storageBucket: "planeta-projeto.appspot.com", // Verifique se este é o correto no seu console Firebase
  messagingSenderId: "1060342659751",
  appId: "1:1060342659751:web:fbd4c421de3a02db8cb982", // App ID do seu script.js antigo
  measurementId: "G-NHT649Q6SQ" // Opcional, do seu primeiro post
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
// const firestore = getFirestore(app); // Se precisarmos do Firestore client-side

export { app, auth }; // Exportar firestore se necessário
// Se for usar Analytics, como no seu exemplo inicial:
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);
