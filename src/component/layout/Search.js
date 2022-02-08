import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import pokemonData from "../../search-data.json";
import "../../css/Search.css";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover,
  &:active {
    color: #000;
  }
`;

const StyledLi = styled.li`
  padding: 0.5em 1.3em;
  color: #000;
  &:hover {
    background-color: #d3d3d3;
    text-decoration: none;
  }
  transition: ease-out 0.2s;
`;

function Search(props) {
  const [name, setName] = useState("");

  let filtered = pokemonData.filter((item) => item.name.includes(name));

  const handleChange = (e) => {
    setName(e.target.value.toLowerCase());
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header className="bg-primary text-white" closeButton>
          Search for your Favourite Pokemon
        </Modal.Header>
        <Modal.Body className="bg-danger">
          <input
            id="search"
            type="search"
            value={name}
            placeholder="Search a Pokemon by name..."
            onChange={handleChange}
            autoComplete="off"
          />
        </Modal.Body>
        {filtered && name && (
          <ul className="list">
            {filtered.map((item) => (
              <StyledLink
                key={item.id}
                to={{
                  pathname: `/pokemon/${item.id}`,
                }}
                state={{
                  index: { pokemonIndex: item.id },
                }}
              >
                <StyledLi>
                  {item.name
                    .toLowerCase()
                    .split("-")
                    .map(
                      (string) =>
                        string.charAt(0).toUpperCase() + string.substring(1)
                    )
                    .join(" ")}
                </StyledLi>
              </StyledLink>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}

export default Search;

// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";

// function Search(props) {
//   const [data, setData] = useState([]);

//   function filterPokemonsByName(filterName) {
//     return (pokemon) => {
//       const lowerCasePokemonName = pokemon.name.toLowerCase();
//       const lowerCaseFilterName = filterName.toLowerCase();

//       return lowerCasePokemonName.includes(lowerCaseFilterName);
//     };
//   }
//   return (
//     <div>
//       <Modal show={props.show} onHide={props.handleClose}>
//         <Modal.Header className="bg-primary text-white" closeButton>
//           Search for your Favourite Pokemon
//         </Modal.Header>
//         <Modal.Body className="bg-danger">
//           <input
//             id="search"
//             type="search"
//             // value={this.state.search}
//             placeholder="Search a Pokemon by name..."
//             // onChange={this.onInput}
//             autoComplete="off"
//           />
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// }

// export default Search;
