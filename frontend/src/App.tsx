import React, { useEffect, useState } from "react";
import "./App.css";
// ui
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Button,
  Toolbar,
  IconButton,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
// components
import CodeEditor from "./components/CodeEditor";
import FlowControl from "./components/FlowControl";
import ChunkViewer from "./components/ChunkViewer";
import Copyright from "./components/Copyright";

// types
import type { Theme } from "@mui/material";
import { useFlow } from "./store/flow-context";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme | undefined>();

  useEffect(() => {
    // init
    const defaultTheme = createTheme();
    setTheme(defaultTheme);
  }, []);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = createTheme({
        palette: {
          mode: prevTheme?.palette.mode === "dark" ? "light" : "dark",
        },
      });
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
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid container direction={"column"} item xs={6} spacing={3}>
                {/* CodeEditor */}
                <Grid item>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "50vh",
                    }}
                  >
                    <CodeEditor theme={actualTheme} />
                  </Paper>
                </Grid>
                {/* FlowControl */}
                <Grid item>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <FlowControl />
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={6} spacing={3}>
                {/* Chunk Viewer */}
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <ChunkViewer />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
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
