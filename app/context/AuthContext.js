"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { doc, onSnapshot, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // EMAIL LOGIN
  const emailSignIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // 🚀 EMAIL SIGNUP — includes username + birthday
  const emailSignUp = async (email, password, username, birthday) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name in Firebase Auth
    await updateProfile(cred.user, { displayName: username });

    // Create Firestore profile
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      birthday,
      avatarUrl: "",
      bio: "",
      createdAt: Date.now(),
    });

    return cred.user;
  };

  // GOOGLE LOGIN
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    await setDoc(
      doc(db, "users", result.user.uid),
      {
        username: result.user.displayName,
        avatarUrl: result.user.photoURL,
        bio: "",
        birthday: "",
      },
      { merge: true }
    );
  };

  // LOGOUT
  const logOut = () => signOut(auth);

  // LISTEN FOR AUTH + USER PROFILE CHANGES
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }

      const userRef = doc(db, "users", fbUser.uid);

      // Real-time Firestore sync
      const unsubProfile = onSnapshot(userRef, (snap) => {
        const data = snap.data() || {};

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          username: data.username || fbUser.displayName || "User",
          avatarUrl: data.avatarUrl || "",
          bio: data.bio || "",
          birthday: data.birthday || "",
        });
      });

      return () => unsubProfile();
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        emailSignIn,
        emailSignUp,
        googleSignIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
