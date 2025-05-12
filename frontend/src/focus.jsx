import { useState } from "react";
import "./focus.css";
import Nav from "./assets/navbar.jsx";
import { HomePage, Working, Team } from "./assets/Pages.jsx";

function Focus() {
  const [theme, changetheme] = useState(true);
  const [page, changepage] = useState(0);
  function themehandler() {
    changetheme(!theme);
  }
  function Phome() {
    changepage(0);
  }
  function Phow() {
    changepage(1);
  }
  function Pteam() {
    changepage(2);
  }
  return (
    <div className={`${theme == 0 ? "dark" : ""}`}>
      <div className="flex">
        <div className="absolute w-screen">
          <Nav
            page={page}
            theme={theme}
            themehandler={themehandler}
            pagehome={Phome}
            pagehow={Phow}
            pageteam={Pteam}
          />
        </div>
        <div>
          {page == 0 ? <HomePage /> : ""}
          {page == 1 ? <Working /> : ""}
          {page == 2 ? <Team /> : ""}
        </div>
      </div>
    </div>
  );
}

export default Focus;
