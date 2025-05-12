import React from "react";
import { useState } from "react";
import sun from "./sun.png";
import moon from "./moon.png";

function Nav(props) {
  return (
    <div className="dark:text-myfont bg-navlight dark:bg-navdark m-2 flex items-center justify-center gap-15 rounded-sm pt-4 pb-4 pl-6 ring-1 shadow-md [transition:background-color_0.1s]">
      <div className="absolute left-0 ml-6 text-xl font-semibold [transition:color_0.9s]">
        TestGenie
      </div>
      <div className="left-0.5 flex items-center justify-center gap-12">
        <button
          onClick={props.pagehome}
          className={`${props.page == 0 ? "bg-blue-100 dark:bg-gray-700" : ""} rounded-md p-2 font-semibold ring-gray-300 transition-all [transition:scale_0.2s,color_1.3s,background-color_0.2s] hover:scale-125 hover:ring-1 active:bg-gray-100 dark:ring-gray-700 dark:active:bg-gray-600`}
        >
          Home
        </button>
        <button
          onClick={props.pagehow}
          className={`${props.page == 1 ? "bg-blue-100 dark:bg-gray-700" : ""} rounded-md p-2 font-semibold ring-gray-300 transition-all [transition:scale_0.2s,color_1.6s,background-color_0.2s] hover:scale-125 hover:ring-1 active:bg-gray-100 dark:ring-gray-700 dark:active:bg-gray-600`}
        >
          How it works?
        </button>
        <button
          onClick={props.pageteam}
          className={`${props.page == 2 ? "bg-blue-100 dark:bg-gray-700" : ""} rounded-md p-2 font-semibold ring-gray-300 transition-all [transition:scale_0.2s,color_1.9s,background-color_0.2s] hover:scale-125 hover:ring-1 active:bg-gray-100 dark:ring-gray-700 dark:active:bg-gray-600`}
        >
          WIP
        </button>
      </div>
      <button
        onClick={props.themehandler}
        className="absolute right-0 mr-6 ring-black transition-all hover:scale-125 hover:invert dark:invert"
      >
        <img src={props.theme ? sun : moon} className="h-8 w-8"></img>
      </button>
    </div>
  );
}

export default Nav;
