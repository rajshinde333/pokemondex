import React, { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "./Pokemon.css";
import loader from "./pokeball-16841.png";

//todo Some Common constants
const statTitleWidth = 3;
const statBarWidth = 9;

const Sprite = styled.img`
  width: 13em;
  height: 13em;
  display: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover,
  &:active {
    color: #000;
  }
`;

export default function Pokemon(props) {
  function GoBack() {
    return <Navigate to="/" />;
  }

  window.addEventListener("popstate", (event) => {
    GoBack();
  });

  const onNavigate = (history, locationDescriptor) =>
    history.replace(locationDescriptor);

  const [imageLoading, setImageLoading] = useState(true);
  const [imageLoading1, setImageLoading1] = useState(true);
  const [imageLoading2, setImageLoading2] = useState(true);
  const [imageLoading3, setImageLoading3] = useState(true);
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
  const [evoImage1, setEvoImage1] = useState();
  const [evoImage2, setEvoImage2] = useState();
  const [evoImage3, setEvoImage3] = useState();
  const [evoName1, setEvoName1] = useState();
  const [evoName2, setEvoName2] = useState();
  const [evoName3, setEvoName3] = useState();
  const [evoId1, setEvoId1] = useState();
  const [evoId2, setEvoId2] = useState();
  const [evoId3, setEvoId3] = useState();

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

    const speciesRes = await axios.get(speciesUrl);

    var description_var = "";
    var description_var1 = "";
    var description_var2 = "";
    var description_var3 = "";

    speciesRes.data.flavor_text_entries.some((ele) => {
      if (ele.language.name === "en") {
        description_var1 = ele.flavor_text;
        return;
      }
    });
    speciesRes.data.flavor_text_entries.some((ele) => {
      if (ele.language.name === "en" && description_var1 !== ele.flavor_text) {
        description_var2 = ele.flavor_text;
        return;
      }
    });
    speciesRes.data.flavor_text_entries.some((ele) => {
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
    const femaleRate = speciesRes.data["gender_rate"];
    const genderRatioFemale_var = 12.5 * femaleRate;
    const genderRatioMale_var = 12.5 * (8 - femaleRate);
    setGenderRatioFemale(genderRatioFemale_var);
    setGenderRatioMale(genderRatioMale_var);

    //! to get the catchRate of Pokemon
    const catchRate_var = Math.round(
      (100 / 255) * speciesRes.data["capture_rate"]
    );
    setCatchRate(catchRate_var);

    //! to get the eggGroups of Pokemon
    const eggGroups_var = speciesRes.data["egg_groups"]
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
    const hatchSteps_var = 255 * (speciesRes.data["hatch_counter"] + 1);
    setHatchSteps(hatchSteps_var);

    //!to get the evolution images of this pokemon
    const evoUrl = speciesRes.data["evolution_chain"].url;
    // console.log(evoUrl);
    const evoRes = await axios.get(evoUrl);
    var evoData = evoRes.data.chain;
    var EvoChain = [];
    do {
      EvoChain.push({
        name: evoData.species.name,
      });
      evoData = evoData["evolves_to"][0];
    } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

    const EvoName1 = EvoChain[0].name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");

    setEvoName1(EvoName1);

    const EvoName2 = EvoChain[1].name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");

    setEvoName2(EvoName2);

    const EvoName3 = EvoChain[2].name
      .toLowerCase()
      .split("-")
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(" ");

    setEvoName3(EvoName3);

    const GetImageUrl1 = `https://pokeapi.co/api/v2/pokemon/${EvoChain[0].name}`;
    const evolutionRes1 = await axios.get(GetImageUrl1);
    setEvoImage1(evolutionRes1.data.sprites.front_default);
    setEvoId1(evolutionRes1.data.id);

    const GetImageUrl2 = `https://pokeapi.co/api/v2/pokemon/${EvoChain[1].name}`;
    const evolutionRes2 = await axios.get(GetImageUrl2);
    setEvoImage2(evolutionRes2.data.sprites.front_default);
    setEvoId2(evolutionRes2.data.id);

    const GetImageUrl3 = `https://pokeapi.co/api/v2/pokemon/${EvoChain[2].name}`;
    const evolutionRes3 = await axios.get(GetImageUrl3);
    setEvoImage3(evolutionRes3.data.sprites.front_default);
    setEvoId3(evolutionRes3.data.id);

    console.log(evoId1, evoId2, evoId3);

    // const EvolutionImages = EvoChain.map((ele) => {
    //   const GetImageUrl = `https://pokeapi.co/api/v2/pokemon/${ele.name}`;
    //   const evoImageRes = axios.get(GetImageUrl);
    //   console.log(evoImageRes);
    //   return evoImageRes.data.sprites.front_default;
    // });

    // console.log(EvolutionImages);

    // EvoChain;

    // const SecondEvolution = evoRes.data["chain"].evolves_to["species"].name;
    // console.log(SecondEvolution);

    // await axios.get(speciesUrl).then((res) => {
    // var description_var = "";
    // var description_var1 = "";
    // var description_var2 = "";
    // var description_var3 = "";
    // res.data.flavor_text_entries.some((ele) => {
    //   if (ele.language.name === "en") {
    //     description_var1 = ele.flavor_text;
    //     return;
    //   }
    // });
    // res.data.flavor_text_entries.some((ele) => {
    //   if (
    //     ele.language.name === "en" &&
    //     description_var1 !== ele.flavor_text
    //   ) {
    //     description_var2 = ele.flavor_text;
    //     return;
    //   }
    // });
    // res.data.flavor_text_entries.some((ele) => {
    //   if (
    //     ele.language.name === "en" &&
    //     description_var1 !== ele.flavor_text &&
    //     description_var2 !== ele.flavor_text
    //   ) {
    //     description_var3 = ele.flavor_text;
    //     return;
    //   }
    // });

    // description_var = description_var1 + description_var2 + description_var3;
    // setDescription(description_var);

    // //! to get femaleGenderRation, and MaleGenderRatio
    // const femaleRate = res.data["gender_rate"];
    // const genderRatioFemale_var = 12.5 * femaleRate;
    // const genderRatioMale_var = 12.5 * (8 - femaleRate);
    // setGenderRatioFemale(genderRatioFemale_var);
    // setGenderRatioMale(genderRatioMale_var);

    //! to get the catchRate of Pokemon
    //   const catchRate_var = Math.round((100 / 255) * res.data["capture_rate"]);
    //   setCatchRate(catchRate_var);

    //   //! to get the eggGroups of Pokemon
    //   const eggGroups_var = res.data["egg_groups"]
    //     .map((ele) => {
    //       return ele.name
    //         .toLowerCase()
    //         .split(" ")
    //         .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    //         .join(" ");
    //     })
    //     .join(", ");
    //   setEggGroup(eggGroups_var);

    //   //! to get the hatchSteps of Pokemon
    //   const hatchSteps_var = 255 * (res.data["hatch_counter"] + 1);
    //   setHatchSteps(hatchSteps_var);
    // });
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
              <div className="col-md-3 text-center">
                {imageLoading ? (
                  <img
                    src={loader}
                    style={{ width: "3em", height: "3em" }}
                    id="poke"
                    className="card-img-top rounded mx-auto mt-4"
                    alt="pokemon Images"
                  ></img>
                ) : null}
                <Sprite
                  className="card-img-top rounded mx-auto mt-2 image-fluid"
                  onLoad={() => setImageLoading(() => false)}
                  src={imageUrl}
                  style={
                    imageLoading ? { display: "none" } : { display: "block" }
                  }
                ></Sprite>
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
            <div className="row mt-4">
              <div className="col">
                <p className="">{description}</p>
              </div>
            </div>
          </div>
          <div className="card-body">
            <hr />
            <h5 className="card-title text-center">
              <b>Profile</b>
            </h5>
            <hr />
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
            <hr />
            <h5 className="card-title text-center">
              <b>Evolution Chain</b>
            </h5>
            <hr />
            <div className="row align-items-center">
              <div className="col-md-4 text-center">
                {imageLoading1 ? (
                  <>
                    <img
                      src={loader}
                      style={{ width: "3em", height: "3em" }}
                      id="poke"
                      className="card-img-top rounded mx-auto mt-4"
                      alt="pokemon Images"
                    ></img>
                    <br />
                    <br />
                    <span className="text-danger">
                      <b>Loading</b>
                    </span>
                  </>
                ) : null}
                <StyledLink
                  to={{
                    pathname: `/pokemon/${evoId1}`,
                  }}
                  state={{
                    index: { pokemonIndex: evoId1 },
                  }}
                  // onNavigate={onNavigate}
                >
                  <Sprite
                    className="card-img-top rounded mx-auto mt-2 image-fluid"
                    onLoad={() => setImageLoading1(() => false)}
                    src={evoImage1}
                    style={
                      imageLoading1 ? { display: "none" } : { display: "block" }
                    }
                  ></Sprite>
                  <br />
                  <span>
                    <b>{evoName1}</b>
                  </span>
                </StyledLink>
              </div>
              <div className="col-md-4 text-center">
                {imageLoading2 ? (
                  <>
                    <img
                      src={loader}
                      style={{ width: "3em", height: "3em" }}
                      id="poke"
                      className="card-img-top rounded mx-auto mt-4"
                      alt="pokemon Images"
                    ></img>
                    <br />
                    <br />
                    <span className="text-danger">
                      <b>Loading</b>
                    </span>
                  </>
                ) : null}
                <StyledLink
                  to={{
                    pathname: `/pokemon/${evoId2}`,
                  }}
                  state={{
                    index: { pokemonIndex: evoId2 },
                  }}
                  // onNavigate={onNavigate}
                >
                  <Sprite
                    className="card-img-top rounded mx-auto mt-2 image-fluid"
                    onLoad={() => setImageLoading2(() => false)}
                    src={evoImage2}
                    style={
                      imageLoading2 ? { display: "none" } : { display: "block" }
                    }
                  ></Sprite>
                  <br />
                  <span>
                    <b>{evoName2}</b>
                  </span>
                </StyledLink>
              </div>

              <div className="col-md-4 text-center">
                {imageLoading3 ? (
                  <>
                    <img
                      src={loader}
                      style={{ width: "3em", height: "3em" }}
                      id="poke"
                      className="card-img-top rounded mx-auto mt-4"
                      alt="pokemon Images"
                    ></img>
                    <br />
                    <br />
                    <span className="text-danger">
                      <b>Loading</b>
                      <br />
                    </span>
                  </>
                ) : null}
                <StyledLink
                  to={{
                    pathname: `/pokemon/${evoId3}`,
                  }}
                  state={{
                    index: { pokemonIndex: evoId3 },
                  }}
                  // onNavigate={onNavigate}
                >
                  <Sprite
                    className="card-img-top rounded mx-auto mt-2 image-fluid"
                    onLoad={() => setImageLoading3(() => false)}
                    src={evoImage3}
                    style={
                      imageLoading3 ? { display: "none" } : { display: "block" }
                    }
                  ></Sprite>
                  <span>
                    <b>{evoName3}</b>
                  </span>
                </StyledLink>
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
