import React from "react";
import { auth } from "./../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Navbar() {
  
  const [user] = useAuthState(auth);
  

  const handleSignOut = () => {
    signOut(auth);
  };
  return (
    <div
      className="fixed-top border "
      style={{ backgroundColor: "whitesmoke" }}
    >
      <nav className="navbar">
        <div>
          <img
            src="logo192.png"
            width="30"
            height="30"
            alt=""
            className="ms-5"
          />
        </div>
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <div>
          {user && (
            <>
              <span className="pe-4">
                Signed in as {user.displayName 
                || user.email
                }
              </span>
              <button
                className="btn btn-primary btn-sm me-3"
                onClick={handleSignOut}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
