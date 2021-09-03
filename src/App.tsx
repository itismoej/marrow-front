import { Box, ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { MainPage } from "./Components/Main";
import { PersonalityPage } from "./Components/PersonalityPage";
import { Personality, PersonalityContext } from "./Modules/personality";

function App() {
  const [personality, setPersonality] = React.useState<Personality>({
    mbti: "",
  });

  return (
    <Router>
      <ChakraProvider>
        <Box bg="#111" h="100vh">
          <Header />
          <PersonalityContext.Provider value={{ personality, setPersonality }}>
            <Switch>
              <Route exact path="/users/:username">
                <PersonalityPage />
              </Route>
              <Route path="/">
                <MainPage />
              </Route>
            </Switch>
          </PersonalityContext.Provider>
          <Footer />
        </Box>
      </ChakraProvider>
    </Router>
  );
}

export default App;
