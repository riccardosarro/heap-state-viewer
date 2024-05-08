// imports
import React from "react";
import "./styles.css";
// store
import { useFlow } from "../../store/flow-context";
// ui
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Container, Grid } from "@mui/material";

// types
import type { FlowControlProps } from "./types";
import FlowControlButton from "../FlowControlButton";
import { sendCompile } from "../../hooks/backend";

const FlowControl: React.FC<FlowControlProps> = () => {
  const [flowState, flowDispatch] = useFlow();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNext = () => {
    flowDispatch({ type: "NEXT" });
  };

  const handlePrev = () => {
    flowDispatch({ type: "PREV" });
  };

  const handleReset = () => {
    flowDispatch({ type: "RESET" });
  }

  const handleInit = () => {
    setIsLoading(true);
    sendCompile(flowState.code, {})
      .then((res) => {
        if ("error" in res) {
          console.error(res.error);
          setIsLoading(false);
          return;
        }
        const breakpoints = res.breakpoints;
        flowDispatch({ type: "INIT", payload: { breakpoints } });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div>Flow Control</div>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {flowState.initialized ? (
              <>
                <Grid item xs="auto">
                  <FlowControlButton
                    icon={<ArrowBackIcon />}
                    style={{ border: "1px solid" }}
                    color="secondary"
                    size="large"
                    onClick={handlePrev}
                  />
                </Grid>
                <Grid item xs="auto">
                  {/* current step */}
                  <div>{flowState.bpIndex}</div>
                </Grid>
                <Grid item xs="auto">
                  <FlowControlButton
                    icon={<ArrowForwardIcon />}
                    color="secondary"
                    size="large"
                    onClick={handleNext}
                  />
                </Grid>
                <Grid item xs="auto">
                  <FlowControlButton isLoading={isLoading} color="primary" onClick={handleInit}>
                    COMPILE
                  </FlowControlButton>
                </Grid>
                <Grid item xs="auto">
                  <FlowControlButton color="primary" onClick={handleReset}>
                    RESET
                  </FlowControlButton>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <FlowControlButton isLoading={isLoading} color="primary" onClick={handleInit}>
                  COMPILE
                </FlowControlButton>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default FlowControl;
