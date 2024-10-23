import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";

import model from "../../lib/openai";

const NewPrompt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const add = async (text) => {
    setQuestion(text);
    console.log("text", text);

    const result = await model(text);
    const response = result.choices[0].message.content;
    console.log(response);
    setAnswer(response);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;
    add(text);
  };

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
      {question && <div className="message user">{question}</div>}
      {answer && <div className="message">{answer}</div>}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask me anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
