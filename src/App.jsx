import { BrowserRouter as Router, Routes, Route , useLocation } from "react-router-dom";
import { DarkModeProvider } from "./context/DarkModeContext";
import { useDarkMode } from "./context/DarkModeContext";
import { AnimatePresence, motion } from "framer-motion";
import Moontheme from "./assets/night.jpg";
import Suntheme from "./assets/sun.jpg";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/sigin";
import "./App.css";



const pageVariants = {
  home: {
    initial: { opacity: 0 },      
    animate: { opacity: 1 },      
    exit: { opacity: 0 }          
  },
  login: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  },
  signup: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  }
};

const pageTransitionhome = { duration: 1, ease: "easeOut" };
const pageTransition = { duration: 1, ease: "easeOut" };


function AnimatedRoutes() {
  const location = useLocation();
  const { darkMode } = useDarkMode();
  return (
    <AnimatePresence mode="wait" initial={true}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              key={darkMode}
              variants={pageVariants.home}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransitionhome}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
            path="/login"
            element={
              <motion.div
                variants={pageVariants.login}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/signup"
            element={
              <motion.div
                variants={pageVariants.signup}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <Signup />
              </motion.div>
            }
          />
      </Routes>
    </AnimatePresence>
  );
}

function Theme() {
  const { darkMode } = useDarkMode();
  return (
    <div >
      <div className="app-container"></div>
      <motion.img key={darkMode} initial="initial" variants={pageVariants.home} animate="animate" exit="exit" transition={pageTransitionhome} src={darkMode === true ? Moontheme : Suntheme} alt="theme" className="theme" />
    <div >
        <Router>
          <AnimatedRoutes />
        </Router>
      </div>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
        <Theme /> 
    </DarkModeProvider>
  );
}

export default App;
