import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard.js";
import styled from "styled-components";

const Button = styled.span`
  position: relative;
  display: inline-flex;
  width: 180px;
  height: 55px;
  margin: 0 15px;
  perspective: 1000px;
`;

const Span = styled.span`
  font-size: 19px;
  letter-spacing: 1px;
  transform-style: preserve-3d;
  transform: translateZ(-25px);
  transition: transform 0.25s;
  &:before,
  &:after {
    position: absolute;
    content: "Load More";
    height: 55px;
    width: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid black;
    box-sizing: border-box;
    border-radius: 5px;
  }
  &:before {
    color: #fff;
    background: #000;
    transform: rotateY(0deg) translateZ(25px);
  }
  &:after {
    color: #000;
    transform: rotateX(90deg) translateZ(25px);
  }
  &:hover {
    transform: translateZ(-25px) rotateX(-90deg);
  }
`;

export default function PokemonList() {
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [pokemon, setPokemon] = useState([]);

  const getAllPokemons = async () => {
    const res = await fetch(url);
    const data = await res.json();

    setUrl(data.next);

    function createPokemonObject(input) {
      input.forEach(async (ele) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${ele.name}`
        );
        const data = await res.json();
        setPokemon((currentList) => [...currentList, data]);
      });
    }
    createPokemonObject(data.results);
  };

  // const loadingPokemon = (data) => {
  //   setPokemon(data);
  // };

  useEffect(() => {
    getAllPokemons();
  }, []);

  console.log(pokemon);
  return (
    <>
      {pokemon ? (
        <>
          <div className="row">
            {pokemon.map((pokemon) => (
              <PokemonCard
                name={pokemon.name}
                // url={pokemon.url}
                data={pokemon}
                key={pokemon.name}
              />
            ))}
          </div>
          <div className="text-center">
            <Button onClick={() => getAllPokemons()}>
              <Span></Span>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h6>It will take Some time to Load.</h6>
          <h6 className=" text-danger p-3">
            If it takes much time. Then Please Kindly Check your Network
            Connection!
          </h6>
        </div>
      )}
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import PokemonCard from "./PokemonCard.js";

// export default function PokemonList() {
//   const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon");
//   const [pokemon, setPokemon] = useState([]);

//   const getAllPokemons = async () => {
//     const res = await fetch(url);
//     const data = await res.json();
//     loadingPokemon(data.results);
//     console.log(data.next);
//   };

//   const loadingPokemon = (data) => {
//     setPokemon(data);
//   };

//   useEffect(() => {
//     getAllPokemons();
//   }, []);

//   return (
//     <>
//       {pokemon ? (
//         <>
//           <div className="row">
//             {pokemon.map((pokemon) => (
//               <PokemonCard
//                 name={pokemon.name}
//                 url={pokemon.url}
//                 key={pokemon.name}
//               />
//             ))}
//           </div>
//           {/* <button
//             onClick={() => {
//               LoadMore({ url });
//             }}
//           >
//             Next
//           </button> */}
//         </>
//       ) : (
//         <div className="text-center">
//           <h6>It will take Some time to Load.</h6>
//           <h6 className=" text-danger p-3">
//             If it takes much time. Then Please Kindly Check your Network
//             Connection!
//           </h6>
//         </div>
//       )}
//     </>
//   );
// }
