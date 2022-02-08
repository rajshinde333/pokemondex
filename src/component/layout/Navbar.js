import React, { useState, useEffect } from "react";
import pikachuface from "../../images/pikachuface.png";
import pokeDex from "../../images/PokeDex.png";
import "../../css/Navbar.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Search from "./Search";

export default function Navbar() {
  const location = useLocation();

  const [show, setShow] = useState(false);

  const onToggle = () => {
    setShow(!show);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg fixed-top text-center">
        {/* <nav className="navbar navbar-expand-lg fixed-top d-flex justify-content-between"></nav> */}
        <a className="navbar-brand col-sm-3 col-md-2 mr-0  text-white" href="/">
          <img
            src={pokeDex}
            id="pokedeximg"
            // style={{ width: "8em", height: "2.5em" }}
            className="pokedeximg"
            alt="Pikachu"
          />
          <img
            src={pikachuface}
            style={{ width: "2em", height: "3em" }}
            alt="Pikachu"
          />
        </a>
        <div className="buttons">
          <button className="btn btn-warning" type="button" onClick={onToggle}>
            Search
          </button>
          <Search show={show} handleClose={onToggle} />
          {location.pathname.includes("pokemon") ? (
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
        </div>
      </nav>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import pikachuface from "../../images/pikachuface.png";
// import pokeDex from "../../images/PokeDex.png";
// import "../../css/Navbar.css";
// import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { Modal } from "react-bootstrap";
// // import pokemon_json from "../../search-data.json";

// export default function Navbar() {
//   const location = useLocation();
//   const [show, setShow] = useState(false);
//   const [data, setData] = useState([]);

//   const handleOpen = () => {
//     setShow(true);
//   };
//   const handleClose = () => {
//     setShow(false);
//   };

//   function filterPokemonsByName(filterName) {
//     return (pokemon) => {
//       const lowerCasePokemonName = pokemon.name.toLowerCase();
//       const lowerCaseFilterName = filterName.toLowerCase();
//       //Da beide Seiten lowerCase werden, nicht mehr case sensitiv

//       return lowerCasePokemonName.includes(lowerCaseFilterName);
//       //includes beschreibt eine Volltextsuche
//     };
//   }

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg fixed-top d-flex justify-content-between">
//         <a
//           className="navbar-brand col-sm-3 col-md-2 mr-0 align-items-center text-white"
//           href="/"
//         >
//           <img
//             src={pokeDex}
//             id="pokedeximg"
//             // style={{ width: "8em", height: "2.5em" }}
//             className="pokedeximg"
//             alt="Pikachu"
//           />
//           <img
//             src={pikachuface}
//             style={{ width: "2em", height: "3em" }}
//             alt="Pikachu"
//           />
//         </a>
//         <div>
//           <button
//             className="btn btn-warning"
//             type="button"
//             onClick={handleOpen}
//           >
//             Search
//           </button>

//           {location.pathname.includes("pokemon") ? (
//             <Link
//               to={{
//                 pathname: "/",
//               }}
//             >
//               <button className="btn btn-primary" type="button">
//                 Go Back
//               </button>
//             </Link>
//           ) : null}
//         </div>
//         <Modal show={show} onHide={handleClose}>
//           <Modal.Header className="bg-primary text-white" closeButton>
//             Search for your Favourite Pokemon
//           </Modal.Header>
//           <Modal.Body className="bg-danger">
//             <input
//               id="search"
//               type="search"
//               // value={this.state.search}
//               placeholder="Search a Pokemon by name..."
//               // onChange={this.onInput}
//               // autocomplete="off"
//             />
//           </Modal.Body>
//         </Modal>
//       </nav>
//     </div>
//   );
// }
