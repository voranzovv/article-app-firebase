import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../firebaseConfig";
import { storage } from "./../firebaseConfig";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
const DeleteArticle = ({ id, imageUrl }) => {
  //delete function
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, "Articles", id));
        toast("Article deleted successfully", { type: "success" });
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <i
        className="fa fa-times"
        onClick={handleDelete}
        style={{ cursor: "pointer" }}
      ></i>
    </div>
  );
};

export default DeleteArticle;
