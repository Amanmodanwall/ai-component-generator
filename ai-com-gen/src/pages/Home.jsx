import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext'; // ✅ Import Theme Context
import ReactMarkdown from "react-markdown";


const Home = () => {
  const { theme } = useTheme(); // ✅ Get current theme

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [explanation, setExplanation] = useState("");
const [explainLoading, setExplainLoading] = useState(false);


  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({
    apiKey: "YOUR_GOOGLE_API_KEY_HERE", // ✅ Replace with your actual API key
  });

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in Markdown fenced code blocks.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Explain Code
async function explainCode() {
  if (!code.trim()) return toast.error("Generate some code first!");

  // ✅ If we already have an explanation, just open the tab
  if (explanation.trim()) {
    setTab(3);
    return;
  }

  try {
    setExplainLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a senior web developer and teacher.
Explain this code in a clear, beginner-friendly way.
Break it into sections (HTML, CSS, JS if applicable).
Avoid unnecessary jargon.

Code:
${code}
      `,
    });

    setExplanation(response.text);
    setTab(3); // open the Explain tab
  } catch (error) {
    console.error(error);
    toast.error("Couldn't get explanation");
  } finally {
    setExplainLoading(false);
  }
}


  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />

      {/* ✅ Smooth theme transition */}
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-gray-50 text-black' : 'bg-[#0B0B0E] text-white'}`}>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
          {/* Left Section */}
          <div className={`w-full py-6 rounded-xl mt-5 p-5 transition-all duration-300 
            ${theme === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#141319]'}`}>
            <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
            <p className={`mt-2 text-[16px] ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Describe your component and let AI code it for you.
            </p>

            <p className='text-[15px] font-[700] mt-4'>Framework</p>
            <Select
              className='mt-2'
              options={options}
              value={frameWork}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: theme === 'light' ? '#fff' : '#111',
                  borderColor: theme === 'light' ? '#ccc' : '#333',
                  color: theme === 'light' ? '#000' : '#fff',
                  boxShadow: "none",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: theme === 'light' ? '#fff' : '#111',
                  color: theme === 'light' ? '#000' : '#fff',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? (theme === 'light' ? '#eee' : '#333')
                    : state.isFocused
                      ? (theme === 'light' ? '#f3f3f3' : '#222')
                      : (theme === 'light' ? '#fff' : '#111'),
                  color: theme === 'light' ? '#000' : '#fff',
                }),
                singleValue: (base) => ({ ...base, color: theme === 'light' ? '#000' : '#fff' }),
                placeholder: (base) => ({ ...base, color: theme === 'light' ? '#888' : '#aaa' }),
              }}
              onChange={(selected) => setFrameWork(selected)}
            />

            <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className={`w-full min-h-[200px] rounded-xl mt-3 p-3 outline-none focus:ring-2 resize-none transition-all duration-300 
                ${theme === 'light' 
                  ? 'bg-gray-100 text-black placeholder-gray-500 focus:ring-purple-400' 
                  : 'bg-[#09090B] text-white placeholder-gray-400 focus:ring-purple-500'}`}
              placeholder="Describe your component in detail and AI will generate it..."
            ></textarea>

            <div className="flex items-center justify-between mt-3">
              <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                Click on generate button to get your code
              </p>
              <button
                onClick={getResponse}
                className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
              >
                {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
                Generate
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className={`relative mt-2 w-full h-[80vh] rounded-xl overflow-hidden transition-all duration-300 
            ${theme === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-[#141319]'}`}>
            {
              !outputScreen ? (
                <div className="w-full h-full flex items-center flex-col justify-center">
                  <div className="p-5 w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                    <HiOutlineCode />
                  </div>
                  <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-[16px] mt-3`}>
                    Your component & code will appear here.
                  </p>
                </div>
              ) : (
                <>
                 <div className={`w-full h-[50px] flex items-center gap-3 px-3 transition-all duration-300 
  ${theme === 'light' ? 'bg-gray-100' : 'bg-[#17171C]'}`}>
  <button
    onClick={() => setTab(1)}
    className={`w-1/3 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : theme === 'light' ? "bg-gray-200 text-gray-700" : "bg-zinc-800 text-gray-300"}`}
  >
    Code
  </button>
  <button
    onClick={() => setTab(2)}
    className={`w-1/3 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : theme === 'light' ? "bg-gray-200 text-gray-700" : "bg-zinc-800 text-gray-300"}`}
  >
    Preview
  </button>
  <button
    onClick={explainCode}
    disabled={explainLoading}
    className={`w-1/3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 
      ${tab === 3 ? "bg-purple-600 text-white" : theme === 'light' ? "bg-gray-200 text-gray-700" : "bg-zinc-800 text-gray-300"} 
      ${explainLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-80"}`}
  >
    {explainLoading ? <ClipLoader size={16} color="white" /> : "Explain"}
  </button>
</div>


                  {/* Toolbar */}
                  <div className={`w-full h-[50px] flex items-center justify-between px-4 transition-all duration-300 
                    ${theme === 'light' ? 'bg-gray-100' : 'bg-[#17171C]'}`}>
                    <p className='font-bold'>Code Editor</p>
                    <div className="flex items-center gap-2">
                      {tab === 1 ? (
                        <>
                          <button onClick={copyCode} className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:opacity-80 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-200' : 'border-zinc-800 hover:bg-[#333]'}`}><IoCopy /></button>
                          <button onClick={downnloadFile} className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:opacity-80 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-200' : 'border-zinc-800 hover:bg-[#333]'}`}><PiExportBold /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setIsNewTabOpen(true)} className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:opacity-80 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-200' : 'border-zinc-800 hover:bg-[#333]'}`}><ImNewTab /></button>
                          <button onClick={() => setRefreshKey(prev => prev + 1)} className={`w-10 h-10 rounded-xl border flex items-center justify-center hover:opacity-80 ${theme === 'light' ? 'border-gray-300 hover:bg-gray-200' : 'border-zinc-800 hover:bg-[#333]'}`}><FiRefreshCcw /></button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Editor / Preview */}
                  <div className="h-full">
                    {tab === 1 ? (
  <Editor value={code} height="100%" theme='vs-dark' language="html" />
) : tab === 2 ? (
  <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
) : (
  <div className={`p-5 h-full overflow-auto text-sm transition-all duration-300 
    ${theme === 'light' ? 'bg-gray-50 text-black' : 'bg-[#111] text-gray-200'}`}>
   {explainLoading ? (
  <div className="flex items-center justify-center h-full">
    <ClipLoader color={theme === 'light' ? 'black' : 'white'} size={25} />
  </div>
) : explanation ? (
  <div className={`prose max-w-none overflow-y-auto h-full px-2 ${
    theme === 'light' ? 'prose-gray' : 'prose-invert'
  }`}>
    <ReactMarkdown>{explanation}</ReactMarkdown>
  </div>
) : (
  <p className="text-gray-400">Click the Explain button to get AI’s breakdown of your code.</p>
)}

  </div>
)}

                  </div>
                </>
              )
            }
          </div>
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home
