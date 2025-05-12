import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import micicon from "./assets/mic_icon.png";

function App() {
  const [inputpara, changeinputpara] = useState("Blank");
  const [para, changepara] = useState("Void");

  const [geminipara, changegeminipara] = useState("DefaultApiResponse");

  const [toggle, setToggle] = useState(false);
  //To see whether we are currently recording or not
  const [audioURL, setAudioURL] = useState(null);
  //In Startrecord we create a url that points to the audio, so that we can later use it to show audio in
  //the page itself, for the user.
  const [waveformImg, setWaveformimg] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  function inputhandling(e) {
    changeinputpara(e.target.value);
  }

  async function geminiresponse() {
    try {
      const response = await axios.get("/end/geminiaccess");
      changegeminipara(response.data.text);
    } catch (err) {
      console.log("Error in gemini response");
    }
  }

  async function AxiosGetHandler() {
    try {
      const response = await axios.get("/api/getstring");
      changepara(response.text);
    } catch (err) {
      console.log("Error caught in AxiosGetHandler");
    }
  }

  async function AxiosPostHandler() {
    try {
      const response = await axios.post(
        "end/poststring",
        { message: inputpara },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      changepara(response.data);
    } catch (err) {
      console.log("Error caught in AxiosPostHandler");
    }
  }

  const uploadAudio = (audioBlob) => {
    console.log("First message");

    const fdat = new FormData();
    fdat.append("file", audioBlob, "recorded.webm");
    //fdat.append("Name using which we access it ie request.files['name']",value/ actual dataitem,"name of the data item")

    //Change this to work like the default response = await objects

    axios
      .post("end/upload-audio", fdat, {
        headers: {
          "Content-Type": "multipart/form-data",
          //this means that the request can now support file uploads
        },
      })
      .then((res) => {
        console.log("Upload successful =>", res.data);
        changepara(res.data.key);
        //set waveformimage
        //setWaveformImg(data:image/png;base64,${res.data.waveform});
      })
      .catch((err) => {
        alert("error");
        console.error("Upload failed:", err);
      });
  };

  const startRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
          //"push" for a state variable?
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        uploadAudio(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.start();
      setToggle(true);
      //why
    } catch (err) {
      console.error("err");
    }
  };

  const stopRecord = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setToggle(false);
    }
  };

  return (
    <div className="relative flex h-[100vh] items-center justify-center gap-10 bg-blue-950">
      <div className="transition:all relative flex h-64 w-xl flex-col items-center justify-center gap-2 rounded-4xl bg-blue-100 p-3.5 outline-0 outline-blue-400 transition-all duration-100 hover:p-5 hover:outline-4">
        {/*While toggle is disabled the button will say start Record */}
        {!toggle && (
          <button
            className="m-1 size-15 rounded-2xl bg-blue-300 p-0.5 ring-1 ring-blue-400 [transition:height_0.2s,width_0.2s,background-color_0.3s,border-radius_0.4s] hover:size-20 hover:rounded-xl hover:bg-green-300 hover:ring-blue-600"
            onClick={startRecord}
          >
            <img src={micicon} alt="plsfix this shi"></img>
          </button>
        )}

        {/*While toggle is enabled the button will say stop recording*/}
        {toggle && (
          <button
            className="m-1 size-15 rounded-2xl bg-green-300 p-0.5 ring-1 ring-green-600 [transition:height_0.2s,width_0.2s,background-color_0.3s,border-radius_0.4s] hover:size-20 hover:rounded-xl hover:bg-red-200 hover:ring-red-600"
            onClick={stopRecord}
          >
            <img src={micicon} alt="plsfix this shi"></img>
          </button>
        )}

        {/*Shows the audio we recorded
        {audioURL && <audio src={audioURL} controls></audio>}
        */}
        {/*Shows us the toggle statuc
        {toggle ? <p>Toggle active</p> : <p>Toggle Inactive</p>}
        */}
        {/*Shows us the backend response
        <p className="font-bold text-blue-700 italic">
          Backend Response : {para}
        </p>
        */}

        <button
          className="rounded-md bg-blue-300 p-2 font-bold text-blue-100 italic ring-1 ring-blue-400"
          onClick={geminiresponse}
        >
          Generate
        </button>

        <div className="flex h-10 w-1/1 items-center justify-center rounded-md bg-blue-950 align-middle font-bold text-blue-500 italic ring-2 ring-blue-600">
          {geminipara}
        </div>
      </div>
    </div>
  );
}

export default App;
