import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";


export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: username
    });

    if (!user.emailVerified) {
      await doSendEmailVerification();
    }
    
    return userCredential;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  try{
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // console.log(`user: ${JSON.stringify(user)}`);
    if(user && user.emailVerified){
      // console.log(`email is verified`);
      // console.log(auth.currentUser.photoURL);
      // console.log(`emailverified: ${user.emailVerified}`);
    }
    else{
      // console.log("email is not verified!");
      await doSendEmailVerification();
    }
  }
  catch(err){
    console.log(err);
  }
};
export const doSignOut  = async() => {
  try{
    await signOut(auth);
  }catch(error){
    console.log(error);
  }
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/`,
  });
};