import React from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LikeArticle({ id, likes }) {
  const [user] = useAuthState(auth);
  const likesRef = doc(db, "Articles", id);
  const handleLike = () => {
    if (likes?.includes(user.uid)) {
      updateDoc(likesRef, {
        likes: arrayRemove(user.uid),
      })
        .then(() => {
          console.log("disliked");
        })
        .catch((err) => console.log(err));
    } else {
      updateDoc(likesRef, {
        likes: arrayUnion(user.uid),
      })
        .then(() => {
          console.log("Liked");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div>
      <i
        className={`fa fa-heart${!likes?.includes(user.uid) ? "-o" : ""} fa-lg`}
        style={{
          cursor: "pointer",
          color: likes?.includes(user.uid) ? "red" : null,
        }}
        onClick={handleLike}
      />
    </div>
  );
}
