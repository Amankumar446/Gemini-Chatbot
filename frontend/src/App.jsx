import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleButtonClick = async () => {
    if (!question.trim()) return;

    setResponses((prevResponses) => [
      ...prevResponses,
      { type: 'question', content: question },
    ]);

    setQuestion('');

    setResponses((prevResponses) => [
      ...prevResponses,
      { type: 'loading' },
    ]);

    try {
      const response = await axios.post(
        'http://localhost:5000/ask', // Updated endpoint
        { prompt: question },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const { data } = response;

      setResponses((prevResponses) =>
        prevResponses.map((res) =>
          res.type === 'loading' ? { type: 'answer', content: data.data } : res
        )
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponses((prevResponses) => [
        ...prevResponses,
        { type: 'error', content: 'An error occurred. Please try again later.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans">
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-4xl mb-6 font-extrabold text-center text-blue-500">
          Gemini AI Model - Free Chatbot
        </h1>

        <div className="overflow-y-auto space-y-4">
          {responses.map((response, index) => (
            <div key={index} className="space-y-2">
              {response.type === 'question' ? (
                <div className="bg-blue-600 p-3 rounded-lg flex items-center space-x-3">
                  <img
                    src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                  <p>{response.content}</p>
                </div>
              ) : response.type === 'loading' ? (
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              ) : response.type === 'answer' ? (
                <div className="bg-gray-800 p-3 rounded-lg flex items-center space-x-3">
                  <img
                    src='./public/vite.svg'
                    alt="Bot"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-white">{response.content}</p>
                </div>
              ) : (
                <div className="bg-red-600 p-3 rounded-lg">{response.content}</div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 p-4 fixed bottom-0 left-0 w-full">
        <div className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="Ask Gemini"
            className="flex-1 p-3 rounded-l bg-gray-700 text-white border border-gray-600 outline-none"
          />
          <button
            onClick={handleButtonClick}
            className="bg-blue-500 p-3 rounded-r text-white font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            Ask Gemini
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
