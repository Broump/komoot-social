import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/navigation";
import Footer from "./components/footer";
import Login from "./components/login";
import Register from "./components/register";
import KomootData from "./components/komoot-data";

function App() {
  return (
    <div className="App">
      <Navigation></Navigation>
      {/* <Login></Login> */}
      <Register></Register>
      {/* <KomootData></KomootData> */}
      <Footer></Footer>
    </div>
  );
}

export default App;
