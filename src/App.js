import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./component/layout/Navbar.js";
import Dashboard from "./component/layout/Dashboard";
import Pokemon from "./component/pokemon/Pokemon";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div
          className="container"
          style={
            backGroundImg
              ? {
                  backgroundImage: `url(${backGroundImg})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }
              : {}
          }
        >
          <Routes>
            <Route exact path="/" exact element={<Dashboard />} />
            <Route
              exact
              path="/pokemon/:pokemonIndex"
              exact
              element={<Pokemon />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
