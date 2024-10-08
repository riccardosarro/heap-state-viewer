import React, { useEffect, useState } from "react";
import "./App.css";
// store
import { loadTheme, saveTheme } from "./hooks/localStorage";
// ui
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
// components
import CodeEditor from "./components/CodeEditor";
import FlowControl from "./components/FlowControl";
import BreakpointsControl from "./components/BreakpointsControl";
import Copyright from "./components/Copyright";
import Item from "./components/Item";
import SmallDeviceBox from "./components/SmallDeviceBox";
// types
import type { Theme } from "@mui/material";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme | undefined>();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const checkScreenSize = () => {
    if (window.innerWidth < 1100) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  useEffect(() => {
    // init
    const savedTheme = loadTheme({});
    const defaultTheme = createTheme({palette: {mode: savedTheme || "light"}});
    setTheme(defaultTheme);

    // check screen size
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = createTheme({
        palette: {
          mode: prevTheme?.palette.mode === "dark" ? "light" : "dark",
        },
      });
      saveTheme(newTheme.palette.mode, {});
      return newTheme;
    });
  };

  const actualTheme = theme || createTheme();

  return (
    <ThemeProvider theme={actualTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Stack
              spacing={{ xs: 4, sm: 3 }}
              direction="row"
              sx={{ width: "100%" }}
            >
              {!isSmallScreen ? (
                <>
                  <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="column"
                    useFlexGap
                    sx={{ flexWrap: "wrap", width: "50%" }}
                  >
                    {/* CodeEditor */}
                    <Item>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <CodeEditor theme={actualTheme} />
                      </Paper>
                    </Item>
                    {/* FlowControl */}
                    <Item>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FlowControl />
                      </Paper>
                    </Item>
                  </Stack>
                  <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="column"
                    useFlexGap
                    sx={{ flexWrap: "wrap", width: "50%" }}
                  >
                    <Item>
                      {/* Breakpoints Control */}
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <BreakpointsControl />
                      </Paper>
                    </Item>
                  </Stack>
                </>
              ) : (
                <SmallDeviceBox />
              )}
            </Stack>
            <Copyright
              props={{ sx: { pt: 6 } }}
              themeButton={
                <IconButton onClick={handleChangeTheme}>
                  {actualTheme.palette.mode === "dark" ? (
                    <DarkModeIcon />
                  ) : (
                    <LightModeIcon />
                  )}
                </IconButton>
              }
            />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
