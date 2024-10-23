import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";

const NewPrompt = () => {
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="loading">Uploading...</div>}
      {img.dbData?.filePath && ( // If the image has been uploaded, display it
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath} // Path to the uploaded image
          width={380} // Resize the image to 380px width on the client side
          transformation={[{ width: 380 }]} // Resize the image to 380px width on the server side
        />
      )}
      {/* {console.log(img.dbData)} */}
      <div className="endChat"></div>
      <form className="newForm">
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" placeholder="Ask me anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
      <div ref={endRef}></div>
    </>
  );
};

export default NewPrompt;
