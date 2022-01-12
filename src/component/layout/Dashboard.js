import React from "react";
import PokemonList from "../pokemon/PokemonList.js";

export default function Dashboard() {
  // window.location.reload();
  // window.onload = function () {
  //   if (!window.location.hash) {
  //     window.location = window.location + "#Pokemons";
  //     window.location.reload();
  //   }
  // };
  return (
    <div>
      <div className="row">
        <div className="col">
          <PokemonList />
        </div>
      </div>
    </div>
  );
}
