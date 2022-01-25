import React from "react";
import pikachuface from "./pikachuface.png";
import pokeDex from "./PokeDex.png";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  let history = useNavigate();

  function GoBack() {
    history("/");
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top d-flex justify-content-between">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center text-white"
          href="/"
        >
          <img
            src={pokeDex}
            style={{ width: "8em", height: "2.5em" }}
            alt="Pikachu"
          />
          <img
            src={pikachuface}
            style={{ width: "2em", height: "3em" }}
            alt="Pikachu"
          />
        </a>
        {window.location.pathname.match("/pokemon/") ? (
          <Link
            to={{
              pathname: "/",
            }}
          >
            <button className="btn btn-primary" type="button">
              Go Back
            </button>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
