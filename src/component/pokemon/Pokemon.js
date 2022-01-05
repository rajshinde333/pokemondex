import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Pokemon.css";

//todo Some Common constants
const statTitleWidth = 3;
const statBarWidth = 9;

export default function Pokemon() {
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState();
  const [hp, setHp] = useState();
  const [attack, setAttack] = useState();
  const [defense, setDefense] = useState();
  const [speed, setSpeed] = useState();
  const [specialAttack, setSpecialAttack] = useState();
  const [specialDefense, setSpecialDefense] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [eggGroup, setEggGroup] = useState();
  const [abilities, setAbilities] = useState();
  const [genderRatioMale, setGenderRatioMale] = useState();
  const [genderRatioFemale, setGenderRatioFemale] = useState();
  const [evs, setEvs] = useState();
  const [hatchSteps, setHatchSteps] = useState();
  const [catchRate, setCatchRate] = useState();

  const location = useLocation();
  const { index } = location.state;

  useEffect(() => {
    getPokemonDetails(index.pokemonIndex);
  });

  const getPokemonDetails = async (index) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}`;

    const result = await axios.get(url);

    setImageUrl(result.data.sprites.front_default);

    const name = result.data.name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");
    setName(name);

    //! Convert Decimeter to Feet
    const height =
      Math.round((result.data.height * 0.328084 + 0.0001) * 100) / 100;
    setHeight(height);

    //! Convert Hectogram to Kilogram
    const weight = Math.round(result.data.weight / 10);
    setWeight(weight);

    //! To get Hp, Attack, Defense, Special-Attact, Special-Defense, Speed
    result.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          setHp(stat["base_stat"]);
          break;
        case "attack":
          setAttack(stat["base_stat"]);
          break;
        case "defense":
          setDefense(stat["base_stat"]);
          break;
        case "special-attack":
          setSpecialAttack(stat["base_stat"]);
          break;
        case "special-defense":
          setSpecialDefense(stat["base_stat"]);
          break;
        case "speed":
          setSpeed(stat["base_stat"]);
          break;
        default:
          console.log("default");
      }
    });

    //! get the type of pokemon
    const types_var = result.data.types.map((type) => {
      return type.type.name
        .toLowerCase()
        .split("-")
        .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
        .join(" ");
    });
    setTypes(types_var);

    //! get the abilities of pokemon
    const abilities_var = result.data.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split("-")
          .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
          .join(" ");
      })
      .join(", ");
    setAbilities(abilities_var);

    //! To get Evs of Pokemon
    const evs_var = result.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name}`
          .toLowerCase()
          .split("-")
          .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
          .join(" ");
      });
    setEvs(evs_var);

    //! to Get pokemon Description/information
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${index}`;
    await axios.get(speciesUrl).then((res) => {
      var description_var = "";
      var description_var1 = "";
      var description_var2 = "";
      var description_var3 = "";
      res.data.flavor_text_entries.some((ele) => {
        if (ele.language.name === "en") {
          description_var1 = ele.flavor_text;
          return;
        }
      });
      res.data.flavor_text_entries.some((ele) => {
        if (
          ele.language.name === "en" &&
          description_var1 !== ele.flavor_text
        ) {
          description_var2 = ele.flavor_text;
          return;
        }
      });
      res.data.flavor_text_entries.some((ele) => {
        if (
          ele.language.name === "en" &&
          description_var1 !== ele.flavor_text &&
          description_var2 !== ele.flavor_text
        ) {
          description_var3 = ele.flavor_text;
          return;
        }
      });

      description_var = description_var1 + description_var2 + description_var3;
      setDescription(description_var);

      //! to get femaleGenderRation, and MaleGenderRatio
      const femaleRate = res.data["gender_rate"];
      const genderRatioFemale_var = 12.5 * femaleRate;
      const genderRatioMale_var = 12.5 * (8 - femaleRate);
      setGenderRatioFemale(genderRatioFemale_var);
      setGenderRatioMale(genderRatioMale_var);

      //! to get the catchRate of Pokemon
      const catchRate_var = Math.round((100 / 255) * res.data["capture_rate"]);
      setCatchRate(catchRate_var);

      //! to get the eggGroups of Pokemon
      const eggGroups_var = res.data["egg_groups"]
        .map((ele) => {
          return ele.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        })
        .join(", ");
      setEggGroup(eggGroups_var);

      //! to get the hatchSteps of Pokemon
      const hatchSteps_var = 255 * (res.data["hatch_counter"] + 1);
      setHatchSteps(hatchSteps_var);
    });
  };

  return (
    <>
      <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h5>{index.pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-end">
                  {types.map((type) => (
                    <span
                      key={type}
                      className={`badge rounded-pill ml-4 ${type}`}
                      style={{
                        color: "#000",
                        fontSize: 14,
                      }}
                    >
                      {type
                        .toLowerCase()
                        .split(" ")
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(" ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  className="card-img-top rounded mx-auto mt-2 image-fluid"
                  src={imageUrl}
                ></img>
              </div>
              <div className="col-md-9">
                <h4 className="mx-auto mb-4">{name}</h4>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>HP</div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${hp}%`,
                          backgroundColor: `#00FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{hp}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Attack
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${attack}%`,
                          backgroundColor: `#ff0000`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{attack}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Defense
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${defense}%`,
                          backgroundColor: `#02D1FF`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{defense}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>Speed</div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${speed}%`,
                          backgroundColor: `#F7FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{speed}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Special Attack
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialAttack}%`,
                          backgroundColor: `#790000`,
                        }}
                        aria-valuenow={specialAttack}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-white">{specialAttack}</big>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Special Defense
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialDefense}%`,
                          backgroundColor: `#0247FF`,
                        }}
                        aria-valuenow={specialDefense}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{specialDefense}</big>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <p className="">{description}</p>
              </div>
            </div>
          </div>
          <hr />
          <div className="card-body">
            <h5 className="card-title text-center">
              <b>Profile</b>
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-end">Height:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{height} ft.</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Weight:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{weight} lbs</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Catch Rate:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-left">{catchRate}%</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Gender Ratio:</h6>
                  </div>
                  <div className="col-6">
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioFemale}%`,
                          backgroundColor: "#c2185b",
                        }}
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioFemale}</small>
                      </div>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${genderRatioMale}%`,
                          backgroundColor: "#1976d2",
                        }}
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{genderRatioMale}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-6">
                    <h6 className="float-end">Egg Groups:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{eggGroup} </h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Hatch Steps:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{hatchSteps}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Abilities:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{abilities}</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-end">Evs:</h6>
                  </div>
                  <div className="col-6">
                    <h6 className="float-start">{evs}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer text-muted">
            Data From{" "}
            <a href="https://pokeapi.co/" target="_blank" className="card-link">
              PokeAPI.co
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
