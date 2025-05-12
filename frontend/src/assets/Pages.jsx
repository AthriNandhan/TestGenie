import { useState, useEffect, useRef } from "react";

import axios from "axios";
import micicon from "./mic_icon.png";

import SimpleButton from "./buttons.jsx";
import Hovercard from "./cards.jsx";

import katex from "katex";
import "katex/dist/katex.min.css";

import wallpaper from "./images/background.jpg";

//base state is base state
//recording state is when we are taking in a prompt
//

function HomePage() {
  const [status, changestatus] = useState(1);
  //1 - base state is base state
  //2 - Recording state is when mic is active and voice is being recorded
  //3 - state is where voice is converted to english which is sent to frontend for verification BEFORE prompt is sent to gemini
  //4 - Response state is where gemini was asked, and a prompt was sent to front end
  const [toggle, setToggle] = useState(null);
  //This allows us to control if the mic button starts or stops/ shows us whether recording is active or not
  const audioChunks = useRef([]);
  const mediaRecorderRef = useRef(null);
  const [OpenAIResponse, ChangeOpenAIResponse] = useState("Transcribing...");
  const [GeminiResponse, ChangeGeminiResponse] = useState("Loading..");

  //This stores a reference to the object mediarecorder in start record
  //so that we can use it outside the start record function where it is defined.

  function InlineLaTeX({ formula }) {
    const spanRef = useRef(null);

    useEffect(() => {
      if (spanRef.current) {
        katex.render(formula, spanRef.current, {
          throwOnError: false,
          displayMode: false,
        });
      }
    }, [formula]);

    return <span ref={spanRef} />;
  }

  // A component that renders block LaTeX
  function BlockLaTeX({ formula }) {
    const divRef = useRef(null);

    useEffect(() => {
      if (divRef.current) {
        katex.render(formula, divRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      }
    }, [formula]);

    return <div ref={divRef} className="my-4" />;
  }

  async function startRecord() {
    changestatus(2);
    ChangeGeminiResponse("Loading..")
    ChangeOpenAIResponse("Transcribing..")
    try {
      console.log("StartRecord function has been called");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      //Defining what to do when data is available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      //Exporting the data when
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: "audio/webm",
        });
        uploadAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      //Reference to media recorder object so we can use it in the stop record function
      audioChunks.current = [];
      mediaRecorder.start();
      setToggle(true);
    } catch (err) {
      console.error("err");
    }
  }

  function stopRecord() {
    changestatus(3);
    console.log("Stop record function has been called");
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setToggle(false);
      //allows us to change look and function of the button
    }
  }

  function uploadAudio(audioBlob) {
    const fdat = new FormData();

    fdat.append("file", audioBlob, "recorded.webm");
    //fdat.append("Name using which we access it ie request.files['name']",value/ actual dataitem,"name of the data item")

    axios
      .post("end/upload-audio", fdat, {
        headers: {
          "Content-Type": "multipart/form-data",
          //In the case of multiple part messages, in which one or more different sets of data are combined in a single body
          //Also causes the requests to support file uploads
        },
      })
      .then((res) => {
        console.log("Upload successful => ", res.data);
        ChangeOpenAIResponse(res.data.key);
        console.log("Front-end upload successful", res.data.key);
        //this can be a statevariable that is used to show output
      })
      .catch((err) => {
        alert("Error occurred while uploading audio");
        console.log("Upload failed", err);
      });
  }

  async function GR() {
    changestatus(4);
    try {
      const response = await axios.get("end/geminiaccess");
      ChangeGeminiResponse(response.data.text);
    } catch (err) {
      console.log("Error in gemini response");
    }
  }

  async function Logger() {
    console.log("Function logger called");
    try {
      const response = await axios.get("end/logger");
      console.log(response.data.key);
    } catch (err) {
      console.log("Logger failed", err);
    }
  }

  function Statushandler() {
    changestatus((status % 4) + 1);
  }

  return (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center bg-blue-200 pt-20 text-2xl italic [transition:background-color_0.5s] dark:bg-transparent`}
    >
      {/*
      <div>
        <button onClick={StatusHandler}>Status : {status}</button>
      </div>
      */}

      <div className="flex flex-row items-center justify-center gap-1">
        {/* Toggle is ONLY used to check if microphone is active or not */}
        {!toggle && (
          <button
            className={`${status == 4 ? "m-0.5 size-15 rounded-sm hover:size-15" : "m-1 size-50 rounded-2xl hover:size-55"} bg-blue-400 p-0.5 ring-1 ring-blue-400 [transition:height_0.6s,width_0.6s,background-color_0.3s,border-radius_0.4s] hover:rounded-xl hover:bg-green-300 hover:ring-blue-600`}
            onClick={startRecord}
          >
            <img src={micicon} alt="plsfix this shi"></img>
          </button>
        )}
        {toggle && (
          <button
            className="m-1 size-50 rounded-2xl bg-green-400 p-0.5 ring-1 ring-green-600 [transition:height_0.2s,width_0.2s,background-color_0.3s,border-radius_0.4s] hover:size-55  hover:rounded-xl hover:bg-red-200 hover:ring-red-600"
            onClick={stopRecord}
            >
            
            <img src={micicon} alt="plsfix this shi"></img>
          </button>
        )}
        {/* This button is to show the translated text ie stage 3*/}
        {/*[transition:translate_0.6s,height_0.6s,width_2s,margin_0.6s] for below class. Literally had to write all the transition properties twice just for opacity to work*/}

        <div
          className={`${
            status == 3
              ? "m-5 h-38 w-80 translate-y-0 opacity-100 [transition:height_0.6s,width_0.8s,margin_0.6s,opacity_0.8s,translate_0.6s]"
              : status == 4
                ? "m-0 h-15 w-80 translate-y-0 rounded-md bg-blue-200 opacity-100 ring-2 ring-blue-800 [transition:height_0.6s,width_0.8s,margin_0.6s,background-color_1s,translate_0.6s,border-color_1s]"
                : "translate-y-15 opacity-0 [transition:height_0.6s,width_0.8s,margin_0.6s,opacity_0.8s,translate_0.6s]"
          } flex size-0 translate-y-0 flex-col items-center justify-center`}
        >
          <div
            className={`${status == 3 ? "bg-blue-200" : ""} relative flex rounded-sm p-2 text-sm ring-blue-300 transition-all duration-400`}
          >
            {OpenAIResponse}
          </div>
          <div
            className={`${status == 3 ? "opacity-100" : "size-0 opacity-0"} text-sm text-gray-600 dark:text-gray-300`}
          >
            Click the microphone button again to retry
          </div>
        </div>
      </div>

      {/* Voice to text conversion done and generate button should now be visible */}
      <div
        className={`${status == 3 ? "m-0 h-15 w-35 translate-y-0 text-gray-900 opacity-100" : "m-0 h-0 w-35 translate-y-15 p-0 text-white opacity-0"} relative flex items-center justify-center rounded-md bg-white p-4 ring-1 ring-blue-500 transition-all duration-900`}
      >
        <button
          className={`${status == 3 ? "text-md" : "text-sm text-white"} transition-all duration-100`}
          onClick={GR}
        >
          Generate
        </button>
      </div>

      {/*Generate button clicked and gemini response should be shown*/}

      <h2 className={`${status==4 ? "opacity-100 mt-15" : "opacity-0 mt-0"} mb-5 dark:text-myfont font-semibold` }>Test Cases</h2>
      <div
        className={`${status == 4 ? " translate-y-0 opacity-100" : "translate-y-15 opacity-0"} text-gray h-fit w-fit rounded-md bg-white p-4 ring-2 shadow-md shadow-blue-200 ring-blue-500 transition-all duration-900 *:relative dark:shadow-blue-300`}
      >
        <BlockLaTeX formula={GeminiResponse} /> 
      </div>
      <div className="bg-myfont absolute top-24 right-0 mr-3 h-fit w-fit rounded-sm pr-3 pl-2 text-sm transition-all hover:scale-110">
        <button onClick={Statushandler}>Status : {status}</button>
      </div>
    </div>
  );
}

function Working() {
  return (
    <div>
      {/* This page is currently reserved for testing code 
        Breakpoints: sm - md - lg - xl - 2xl
        */}

      <div className="flex h-screen w-screen flex-row items-center justify-center gap-10 bg-blue-100 pt-20 text-2xl [transition:background-color_0.3s] dark:bg-gray-700">
        {/*
            <div>Testing Breakpoints</div>
            <div className="sm:hidden">Small text</div>
            <div className="md:hidden">Medium text</div>
            <div className="lg:hidden">Large text</div>
            <div className="xl:hidden">Extra Large text</div>
            */}
        <Hovercard
          title="Input microphone audio"
          subtext="The microphone is used to record audio, which is then stored as a temporary WAV file"
        />
        <Hovercard
          title="Speech to Text Conversion"
          subtext="Using light-weight but reliable whisper models, the audio file converted into text"
        />
        <Hovercard
          title="Input Modification / Processing"
          subtext="We append system instructions, and any relevant content or context necessary along with the transcribed code, before it reaches the LLMs"
        />
        <Hovercard
          title="Interaction with LLMs"
          subtext="The LLM uses it's large amount of training data, to analyse and provide test cases for the given input"
        />
        <Hovercard
          title="Output "
          subtext="The processed output is brought to the front-end for the user to view"
        />
      </div>
    </div>
  );
}

function Team() {
  return (
    <div className="text-small flex h-screen w-screen items-center justify-center bg-blue-100 pt-20 text-2xl font-bold italic [transition:background-color_0.3s] dark:bg-gray-700">
      <div>Log to be added</div>
    </div>
  );
}
export { HomePage, Working, Team };
