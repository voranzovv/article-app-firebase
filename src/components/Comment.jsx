import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from "uuid";

export default function Comment({ id }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const commentRef = doc(db, "Articles", id);

  useEffect(() => {
    const docRef = doc(db, "Articles", id);
    onSnapshot(docRef, (snapshot) => {
      //   setComments({ ...snapshot.data(), id: snapshot.id });
      setComments(snapshot.data().comments);
    });
  }, []);

  const handleChangeComment = (e) => {
    if (e.key === "Enter") {
      if (comment !== "") {
        updateDoc(commentRef, {
          comments: arrayUnion({
            user: user.uid,
            userName: user.displayName,
            comment: comment,
            createdAt: new Date(),
            CommentId: uuidv4(),
          }),
        }).then(() => {
          setComment(" ");
          console.log("comment added");
        });
      }
    } else setComment(e.target.value);
  };

  //delete comments
  const handleCommentDelete = (comment) => {
    console.log(comment);
    updateDoc(commentRef, {
      comments: arrayRemove(comment),
    }).then(() => {
      console.log("comment deleted");
      setComment(" ");
    });
  };
  return (
    <div>
      comment
      <div className="container">
        {comments !== null &&
          comments.map((comment) => (
            <div key={comment.CommentId}>
              <div className="border p-2 mt-2 row">
                <div className="col-11">
                  <span
                    className={`badge ${
                      comment.user !== user?.uid ? "bg-primary" : "bg-success"
                    }`}
                  >
                    {comment.userName}
                  </span>{" "}
                  {comment.comment}
                </div>
                <div className="col-1">
                  {comment.user === user?.uid && (
                    <i
                      className="fa fa-times"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCommentDelete(comment)}
                    ></i>
                  )}
                </div>
              </div>
            </div>
          ))}
        {user && (
          <input
            type="text"
            className="form-control mt-4 mb-5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyUp={(e) => handleChangeComment(e)}
            placeholder="comment..."
          />
        )}
      </div>
    </div>
  );
}
