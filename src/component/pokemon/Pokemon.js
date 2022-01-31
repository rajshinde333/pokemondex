import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "../../css/Pokemon.css";
import loader from "../../images/pokeball-16841.png";

//todo Some Common constants
const statTitleWidth = 3;
const statBarWidth = 9;

const Sprite = styled.img`
  width: 10em;
  height: 10em;
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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageLoading1, setImageLoading1] = useState(true);
  const [imageLoading2, setImageLoading2] = useState(true);
  const [imageLoading3, setImageLoading3] = useState(true);
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [backImageUrl, setBackImageUrl] = useState();
  const [backGroundImg, setBackGroundImg] = useState();
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState();
  const [properties, setProperties] = useState([]);
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [eggGroup, setEggGroup] = useState();
  const [abilities, setAbilities] = useState();
  const [genderRatioMale, setGenderRatioMale] = useState();
  const [genderRatioFemale, setGenderRatioFemale] = useState();
  const [evs, setEvs] = useState();
  const [hatchSteps, setHatchSteps] = useState();
  const [catchRate, setCatchRate] = useState();
  const [evoNames, setEvonames] = useState([]);
  const [evoId, setEvoid] = useState([]);
  const [evoData, setEvoData] = useState([]);

  const location = useLocation();
  const { index } = location.state;

  useEffect(() => {
    getPokemonDetails(index.pokemonIndex);
  });

  const getPokemonDetails = async (index) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${index}`;

    const result = await axios.get(url);

    //todo get Front image of pokemon
    setImageUrl(result.data.sprites.front_default);

    //todo get back image of pokemon
    setBackImageUrl(result.data.sprites.back_default);

    //todo get background image of pokemon
    setBackGroundImg(
      result.data.sprites.other["official-artwork"].front_default
    );

    //todo get nameo of the pokemon
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
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
          break;
        case "attack":
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
          break;
        case "defense":
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
          break;
        case "special-attack":
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
          break;
        case "special-defense":
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
          break;
        case "speed":
          setProperties((prevEle) => [...prevEle, stat["base_stat"]]);
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
    const evoRes = await axios.get(evoUrl);
    var evoData = evoRes.data.chain;
    var evoChain = [];
    do {
      evoChain.push({
        name: evoData.species.name,
        url: evoData.species.url,
      });
      evoData = evoData["evolves_to"][0];
    } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

    const idRegEx = /[0-9]+/g;
    // evoChain.map((ele) => {
    //   setEvonames((prevEle) => [...prevEle, ele.name]);
    //   const evoId = ele.url.match(idRegEx);
    //   setEvoid((prevEle) => [...prevEle, evoId[1]]);
    // });
    const evo = [];
    evoChain.map((ele) => {
      const evoId = ele.url.match(idRegEx);
      evo.push({ id: evoId[1], name: ele.name });
    });

    setEvoData(evo);

    // do {
    //   setEvonames((prevEle) => [...prevEle, evoData.species.name]);
    //   evoData = evoData["evolves_to"][0];
    // } while (!!evoData && evoData.hasOwnProperty("evolves_to"));
  };

  return (
    <>
      <div className="col">
        <div className="card Bground">
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
              <div className="col-md-6">
                <h4 className="mx-auto mb-4">{name}</h4>
                <div className="row align-items-center">
                  <div className={`col-12 col-md-${statTitleWidth}`}>HP</div>
                  <div className={`col-12 col-md-${statBarWidth}`}>
                    <div className="progress">
                      <div
                        className="progress-bar "
                        role="progressbar"
                        style={{
                          width: `${properties[0]}%`,
                          backgroundColor: `#00FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{properties[0]}</big>
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
                          width: `${properties[1]}%`,
                          backgroundColor: `#ff0000`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{properties[1]}</big>
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
                          width: `${properties[2]}%`,
                          backgroundColor: `#02D1FF`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{properties[2]}</big>
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
                          width: `${properties[5]}%`,
                          backgroundColor: `#F7FF00`,
                        }}
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-dark">{properties[5]}</big>
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
                          width: `${properties[3]}%`,
                          backgroundColor: `#790000`,
                        }}
                        aria-valuenow={properties[3]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big className="text-white">{properties[3]}</big>
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
                          width: `${properties[4]}%`,
                          backgroundColor: `#0247FF`,
                        }}
                        aria-valuenow={properties[4]}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <big>{properties[4]}</big>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  src={backImageUrl}
                  style={
                    imageLoading ? { display: "none" } : { display: "block" }
                  }
                ></Sprite>
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
              {evoData.map((ele) => {
                return (
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
                        pathname: `/pokemon/${ele.id}`,
                      }}
                      state={{
                        index: { pokemonIndex: ele.id },
                      }}
                    >
                      <Sprite
                        className="card-img-top rounded mx-auto mt-2 image-fluid"
                        onLoad={() => setImageLoading1(() => false)}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ele.id}.png`}
                        style={
                          imageLoading1
                            ? { display: "none" }
                            : { display: "block" }
                        }
                      ></Sprite>
                      <br />
                      <span>
                        <b>{ele.name}</b>
                      </span>
                    </StyledLink>
                  </div>
                );
              })}

              {/*  <div className="col-md-4 text-center">
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
                     pathname: `/pokemon/${evoId[0]}`,
                   }}
                   state={{
                     index: { pokemonIndex: evoId[0] },
                   }}
                 >
                   <Sprite
                     className="card-img-top rounded mx-auto mt-2 image-fluid"
                     onLoad={() => setImageLoading1(() => false)}
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId[0]}.png`}
                     style={
                       imageLoading1 ? { display: "none" } : { display: "block" }
                     }
                   ></Sprite>
                   <br />
                   <span>
                     <b>{evoNames[0]}</b>
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
                     pathname: `/pokemon/${evoId[1]}`,
                   }}
                   state={{
                     index: { pokemonIndex: evoId[1] },
                   }}
                 >
                   <Sprite
                     className="card-img-top rounded mx-auto mt-2 image-fluid"
                     onLoad={() => setImageLoading2(() => false)}
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId[1]}.png`}
                     style={
                       imageLoading2 ? { display: "none" } : { display: "block" }
                     }
                   ></Sprite>
                   <br />
                   <span>
                     <b>{evoNames[1]}</b>
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
                     pathname: `/pokemon/${evoId[2]}`,
                   }}
                   state={{
                     index: { pokemonIndex: evoId[2] },
                   }}
                 >
                   <Sprite
                     className="card-img-top rounded mx-auto mt-2 image-fluid"
                     onLoad={() => setImageLoading3(() => false)}
                     src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId[2]}.png`}
                     style={
                       imageLoading3 ? { display: "none" } : { display: "block" }
                     }
                   ></Sprite>
                   <span>
                     <b>{evoNames[2]}</b>
                   </span>
                 </StyledLink>
               </div> */}
            </div>
          </div>
          <div className="card-footer text-muted text-center">
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
