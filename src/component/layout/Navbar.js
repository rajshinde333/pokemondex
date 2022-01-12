import React from "react";
import pikachuface from "./pikachuface.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  let history = useNavigate();

  function GoBack() {
    history("/");
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center text-white"
          href="/"
        >
          PokeDex
          <img
            src={pikachuface}
            style={{ width: "1.5em", height: "1.8em" }}
            alt="Pikachu"
          />
        </a>
        {window.location.pathname.match("/pokemon/") ? (
          <div className="float-end">
            <button className="btn btn-primary" type="button" onClick={GoBack}>
              Go Back
            </button>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
