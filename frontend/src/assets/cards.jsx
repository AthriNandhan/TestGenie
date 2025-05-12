import React from "react";

const Hovercard = (props) => {
  function logger() {
    console.log("Fuck you");
  }
  return (
    <div className="group relative flex min-h-[12rem] w-72 cursor-pointer overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all duration-300 ease-in-out [transition:scale_0.4s,box_shadow_2s] hover:scale-110 hover:shadow-xl">
      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center transition-transform duration-300 ease-in-out [transition:translate_0.3s] group-hover:-translate-y-15">
        <div className="p-2 text-[18px] font-semibold text-gray-800">
          {props.title}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-6 pt-2 text-center text-sm text-gray-600 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
        <p>{props.subtext}</p>
      </div>
    </div>
  );
};

export default Hovercard;
