import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "823551D",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};
console.log(TYPE_COLORS["grass"]);

const statTitleWidth = 2;
const statBarWidth = 10;

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
  // const [gender, setGender] = useState();
  const [genderRatioMale, setGenderRatioMale] = useState();
  const [genderRatioFemale, setGenderRatioFemale] = useState();
  const [evs, setEvs] = useState();
  const [hatchSteps, setHatchSteps] = useState();
  const [catchRate, setCatchRate] = useState();
  const [themeColor, setThemeColor] = useState();

  const location = useLocation();
  const { index } = location.state;
  useEffect(() => {
    getPokemonDetails(index.pokemonIndex);
    // console.log(index.pokemonIndex);
  });

  const getPokemonDetails = async (index) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}`;

    const result = await axios.get(url);
    // console.log(result.data);

    setImageUrl(result.data.sprites.front_default);

    const name = result.data.name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");
    setName(name);

    //Convert Decimeter to Feet
    const height =
      Math.round((result.data.height * 0.328084 + 0.0001) * 100) / 100;
    setHeight(height);

    // Convert Hectogram to Kilogram
    const weight = Math.round(result.data.weight / 10);
    setWeight(weight);

    // console.log("height: ", height);
    // console.log("weight: ", weight);
    // console.log(imageUrl, weight);

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

    //   const types_var = result.data.types.map((type) => type.type.name.toLowerCase()
    //     .split("-")
    //     .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
    //     .join(" ");
    // }).join(" ");

    // get the type of pokemon
    const types_var = result.data.types.map((type) => {
      return type.type.name
        .toLowerCase()
        .split("-")
        .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
        .join(" ");
    });
    // .join(", ");
    setTypes(types_var);

    const themeColor = TYPE_COLORS[types_var[types_var.length - 1]];
    setThemeColor(themeColor);

    // get the abilities of pokemon
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
    // .join(", ");
    setEvs(evs_var);

    //to Get pokemon Description, catch rate, eggGroups, gendor and other
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

      const femaleRate = res.data["gender_rate"];
      const genderRatioFemale_var = 12.5 * femaleRate;
      const genderRatioMale_var = 12.5 * (8 - femaleRate);

      const catchRate_var = Math.round((100 / 255) * res.data["capture_rate"]);

      const eggGroups_var = res.data["egg_groups"]
        .map((ele) => {
          return ele.name
            .toLowerCase()
            .split(" ")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        })
        .join(", ");

      const hatchSteps_var = 255 * (res.data["hatch_counter"] + 1);

      setDescription(description_var);
      setHatchSteps(hatchSteps_var);
      setEggGroup(eggGroups_var);
      setGenderRatioFemale(genderRatioFemale_var);
      setGenderRatioMale(genderRatioMale_var);
      setCatchRate(catchRate_var);
    });
    // console.log("Weight - ", weight);
    // console.log("height - ", height);
    // console.log("types - ", types);
    // console.log("description - ", description);
    // console.log("hatchSteps - ", hatchSteps);
    // console.log("eggGroup - ", eggGroup);
    // console.log("genderRatioFemale - ", genderRatioFemale);
    // console.log("genderRatioMale - ", genderRatioMale);
    // console.log("catchRate - ", catchRate);
    // console.log("attack - ", attack);
    // console.log("hp - ", hp);
    // console.log("defense - ", defense);
    // console.log("speed - ", speed);
    // console.log("specialAttack - ", specialAttack);
    // console.log("specialDefense - ", specialDefense);
    // console.log("abilities - ", abilities);
    // console.log("evs - ", evs);
    // {types.map((type) => (
    //   console.log("color  ", TYPE_COLORS[type])
    // )

    types.map((type) => console.log("color  ", TYPE_COLORS[type]));
  };

  return (
    <>
      {/* <h5>index: {index.pokemonIndex}</h5>
      <h5>Weight: {weight}</h5>
      <h5>height: {height}</h5>
      <h5>types: {types}</h5>
      <h5>description: {description}</h5>
      <h5>hatchSteps: {hatchSteps}</h5>
      <h5>Egg Group: {eggGroup}</h5>
      <h5>gender Ratio Female: {genderRatioFemale}</h5>
      <h5>gender Ratio Male: {genderRatioMale}</h5>
      <h5>Catch Rate: {catchRate}</h5>
      <h5>attack: {attack}</h5>
      <h5>hp: {hp}</h5>
      <h5>defense: {defense}</h5>
      <h5>speed: {speed}</h5>
      <h5>specialAttack: {specialAttack}</h5>
      <h5>specialDefense: {specialDefense}</h5>
      <h5>abilities: {abilities}</h5>
      <h5>evs: {evs}</h5>

      <img
        className="card-img-top rounded mx-auto mt-2"
        // onLoad={() => setImageLoading(() => false)}
        src={imageUrl}
        // style={imageLoading ? { display: "none" } : { display: "block" }}
      ></img> */}
      {/* <div className="col">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-5">
                <h5>{index.pokemonIndex}</h5>
              </div>
              <div className="col-7">
                <div className="float-right">
                  {types.map((type) => (
                    <span
                      key={type}
                      className="badge badge-pill mr-1 float-right"
                      style={{
                        backgroundColor: `{TYPE_COLORS[type]}`,
                        color: "#000",
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
        </div>
      </div> */}
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
                      className="badge badge-pill mr-1"
                      style={{
                        backgroundColor: `#${TYPE_COLORS[`${type}`]}`,
                        color: "#000",
                      }}
                    >
                      {TYPE_COLORS[type]}
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
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    HP {themeColor}
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${hp}%`,
                          // backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{hp}</small>
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
                          backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{attack}</small>
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
                          backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{defense}</small>
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
                          backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{speed}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Sp Atk
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialAttack}%`,
                          backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow={specialAttack}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{specialAttack}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>
                    Sp Def
                  </div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${specialDefense}%`,
                          backgroundColor: `#${themeColor}`,
                        }}
                        aria-valuenow={specialDefense}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <small>{specialDefense}</small>
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
            <h5 className="card-title text-center">Profile</h5>
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
                    <h6 className="float-end">EVs:</h6>
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
