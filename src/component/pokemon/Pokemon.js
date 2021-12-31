import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Pokemon() {
  const [imageUrl, setImageUrl] = useState();
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState();
  const [stats, setStats] = useState();
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
  const [gender, setGender] = useState();
  const [genderRatioMale, setGenderRatioMale] = useState();
  const [genderRatioFemale, setGenderRatioFemale] = useState();
  const [evs, setEvs] = useState();
  const [hatchSteps, setHatchSteps] = useState();
  const [catchRate, setCatchRate] = useState();

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
    const types_var = result.data.types
      .map((type) => {
        return type.type.name
          .toLowerCase()
          .split("-")
          .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
          .join(" ");
      })
      .join(", ");
    setTypes(types_var);

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
      })
      .join(", ");
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
  };

  return (
    <div>
      <h5>index: {index.pokemonIndex}</h5>
      <h5>Weight: {weight}</h5>
      <h5>height: {height}</h5>
      <h5>types: {types}</h5>
      <h5>description: {description}</h5>
      <h5>hatchSteps: {hatchSteps}</h5>
      <h5>Egg Group: {eggGroup}</h5>
      <h5>gender Ratio Female: {genderRatioFemale}</h5>
      <h5>gender Ratio Male: {genderRatioMale}</h5>
      <h5>Catch Rate: {catchRate}</h5>
      <h5>stats: {stats}</h5>
      <h5>attack: {attack}</h5>
      <h5>hp: {hp}</h5>
      <h5>defense: {defense}</h5>
      <h5>speed: {speed}</h5>
      <h5>specialAttack: {specialAttack}</h5>
      <h5>specialDefense: {specialDefense}</h5>
      <h5>abilities: {abilities}</h5>
      <h5>gender: {gender}</h5>
      <h5>evs: {evs}</h5>

      <img
        className="card-img-top rounded mx-auto mt-2"
        // onLoad={() => setImageLoading(() => false)}
        src={imageUrl}
        // style={imageLoading ? { display: "none" } : { display: "block" }}
      ></img>
    </div>
  );
}
