"use client";

import classes from "./image-picker.module.css";
import { useRef, useState } from "react";
import Image from "next/image";

const ImagePicker = ({ label, name }) => {
  const [pickedImage, setPickedImage] = useState(null);
  const imageInput = useRef();

  const handlePickImageClick = () => imageInput.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return null;

    const fileReader = new FileReader();
    fileReader.onload = () => setPickedImage(fileReader.result);
    fileReader.readAsDataURL(file);
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage ? (
            <p>No image picked yet.</p>
          ) : (
            <Image src={pickedImage} alt="The picked image" fill />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/webp"
          required
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickImageClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
