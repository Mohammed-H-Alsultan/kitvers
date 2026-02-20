import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Create from "./pages/Create";
import PageTranstion from "./components/animatedComponents/PageTransition";

function App() {
  const location = useLocation();
  return (
    <>
      <div className="grid-lines"></div>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTranstion>
                <Home />
              </PageTranstion>
            }
          />
          <Route
            path="/create"
            element={
              <PageTranstion>
                <Create />
              </PageTranstion>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
