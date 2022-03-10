// import './App.css';
import AddArticle from "./components/AddArticle";
import Articles from "./components/Articles";
import SignUp from "./components/Auth/SignUp";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Article from './components/Article';

function App() {
  // let location = useLocation();
  // console.log("this is url id", location);
  return (
    <>
      <div className="container">
        <Router>
      <Navbar />
          <Routes>
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/article/:id" element={<Article />} />
            <Route
              exact
              path="/"
              element={
                <div className="row mt-5">
                  <div className="col-md-8">
                    <Articles />
                  </div>
                  <div className="col-md-4 ">
                    <AddArticle />
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
