import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { GrUploadOption } from "react-icons/gr";
import './App.css'

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);

  async function generateAnswer(e) {
    e.preventDefault();
    setAnswer("");
    setError("");
    setGeneratingAnswer(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.log(error);
      setError("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  function handleTyping(e) {
    if (e.target.value !== "") {
      setTyping(true);
    } else {
      setTyping(false);
    }
    setQuestion(e.target.value);
  }

  return (
    <div className="h-screen p-3 flex flex-col justify-between">
      <div className="w-full md:w-2/3 m-auto text-center">
        <a href="https://github.com/Vishesh-Pandey/chat-ai" target="_blank">
          <h1 className="text-3xl text-center text-red-500">SODA AI</h1>
        </a>
        <div className="w-full md:w-2/3 m-auto text-center mt-4">
          {answer && (
            <div className="bg-gray-100 p-4 rounded">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <div className="mt-4 relative">
        <center>
          <div className="relative">
            <textarea
              required
              className="border h-20 w-4/5 px-2 py-2 my-2 rounded-lg placeholder-middle text-right"
              value={question}
              onChange={handleTyping}
              placeholder={typing ? "" : "Ask anything"}
            />
            {!typing && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                Ask anything
              </span>
            )}
          </div>
        </center>
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center"
          onClick={generateAnswer}
          disabled={generatingAnswer}
        >
          <GrUploadOption />
          {generatingAnswer}
        </button>
      </div>
    </div>
  );
}

export default App;
