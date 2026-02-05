'use client'
// components/Login.js
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const { user, googleSignIn, logOut } = UserAuth();

  const handleLogin = () => {
    googleSignIn();
  };

  const handleLogout = () => {
    logOut();
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;
