// imports
import React, { useEffect, useRef } from "react";
import "./styles.css";
// store
import { useFlow } from "../../store/flow-context";
// ui
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Container, Divider, Grid } from "@mui/material";
// components
import FlowControlButton from "../FlowControlButton";
// backend api hooks
import { sendCompile } from "../../hooks/backend";

// types
import type { FlowControlProps } from "./types";

const FlowControl: React.FC<FlowControlProps> = () => {
  const [flowState, flowDispatch] = useFlow();
  const [isLoading, setIsLoading] = React.useState(false);

  const flowStateRef = useRef(flowState);

  // Keep ref updated with the latest flowState
  useEffect(() => {
    flowStateRef.current = flowState;
  }, [flowState]);

  const handleNext = () => {
    flowDispatch({ type: "NEXT" });
  };

  const handlePrev = () => {
    flowDispatch({ type: "PREV" });
  };

  const handleReset = () => {
    flowDispatch({ type: "RESET" });
  };

  const handleInit = () => {
    setIsLoading(true);
    console.log("Compiling code..., ", flowStateRef.current);
    sendCompile(flowStateRef.current.code, {})
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

  const handleSave = () => {
    console.log("CTRL+S pressed");
    handleInit(); // This should now have access to the latest context state
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div>Flow Control</div>
      <Divider sx={{width: "100%",  padding: "4px" }}/>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={3}>
            {flowState.initialized ? (
              <>
                <Grid item xs="auto">
                  <FlowControlButton
                    icon={<ArrowBackIcon />}
                    style={{ border: "1px solid" }}
                    color="secondary"
                    size="large"
                    disabled={flowState.bpIndex === 0}
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
                    disabled={flowState.bpIndex === flowState.breakpoints.length - 1}
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
