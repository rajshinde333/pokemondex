import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./component/layout/Navbar.js";
import Dashboard from "./component/layout/Dashboard";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
