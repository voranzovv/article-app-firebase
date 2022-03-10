import React, { useState } from "react";
import { addDoc, Timestamp, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./../firebaseConfig";
import { Link } from "react-router-dom";

export default function AddArticle() {
  const [user, loading, error] = useAuthState(auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdAt: Timestamp.now().toDate(),
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handlePublish = () => {
    if (!formData.title || !formData.description || !formData.image) {
      console.log("fill all the fields");
      return;
    }

    //let's create the storage refference now
    const storageRef = ref(
      storage,
      `/images/${Date.now()}${formData.image.name}`
    );
    const uploadImage = uploadBytesResumable(storageRef, formData.image);

    //Listens for events on this task.
    //Events have three callback functions (referred to as next, error, and complete)
    uploadImage.on(
      //now this uploadImage going to have an event called state_changed
      "state_changed",
      // next parameter is a callback function. it takes a snapshot of the current state of the upload
      (snapshot) => {
        //now we can get the progress of the upload
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // also we dont need the decimal value.so we can round it to integer
        setProgress(progressPercent);
      },
      // next parameter is a callback function. it takes an error object
      (err) => {
        console.log(err);
      },
      // the next parameter is a callback function.
      //which will be called when the upload is complete
      () => {
        // now lets clean up the form data
        setFormData({
          title: "",
          description: "",
          image: "",
        });

        // now lets get the download url of the image
        getDownloadURL(uploadImage.snapshot.ref)
          //it returns a promise
          .then((url) => {
            const articleCollectionRef = collection(db, "Articles");
            addDoc(articleCollectionRef, {
              title: formData.title,
              description: formData.description,
              imageUrl: url,
              createdAt: Timestamp.now().toDate(),
              createdBy: user.displayName,
              userId: user.uid,
              likes:[],
              comments:[]
            }).then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
            });
          })
          .catch((err) => {
            toast("Error", { type: "error" });
          });
      }
    );
  };
  return (
    <div className=" border p-3 mt-3 bg-light" style={{ position: "fixed" }}>
      {!user ? (
        <>
          <h2>
            <Link to="/login">Login to create article</Link>
          </h2>
          Don't have an account? <Link to="/register">Signup</Link>
        </>
      ) : (
        <>
          <h2>Create article</h2>
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            onChange={(e) => handleChange(e)}
            value={formData.title}
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="description"
            cols="30"
            rows="2"
            className="form-control"
            onChange={(e) => handleChange(e)}
            value={formData.description}
          ></textarea>

          <label>Image</label>

          <input
            type="file"
            name="image"
            accept="image/*"
            className="form-control"
            onChange={(e) => handleImageChange(e)}
          />

          {/* progress bar */}
          {progress === 0 ? null : (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped mt-2"
                style={{ width: `${progress}%` }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )}
          <button
            className="form-control btn-primary mt-2"
            onClick={handlePublish}
          >
            Publish
          </button>
        </>
      )}
    </div>
  );
}
