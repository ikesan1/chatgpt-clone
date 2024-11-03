import { useEffect, useRef } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { useState } from "react";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";

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
  }, [question, answer, img.dbData]);

  const add = async (text) => {
    setQuestion(text); // Set the question state to the text because the model.generateContent function uses the question state
    const result = await model.generateContent(text);
    const response = await result.response;
    const answerText = await response.text();
    setAnswer(answerText);
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
      {question && (
        <div className="message ">
          <Markdown>{answer}</Markdown>{" "}
        </div>
      )}
      <div className="endChat"></div>
      <form className="newForm" onSubmit={handleSubmit}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask me anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
      <div ref={endRef}></div>
    </>
  );
};

export default NewPrompt;
