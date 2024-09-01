// imports
import React, { useCallback, useEffect } from "react";
import "./styles.css";
// store
import { useFlow, useFlowDispatch } from "../../store/flow-context";
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
  const flowState = useFlow();
  const flowDispatch = useFlowDispatch();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNext = useCallback(() => {
    // console.log("Next", flowState.bpIndex, flowState.breakpoints.length, {
    //   flowState,
    // });
    if (flowState.bpIndex < flowState.breakpoints.length - 1) {
      flowDispatch({ type: "NEXT" });
    }
  }, [flowState, flowDispatch]);

  const handlePrev = useCallback(() => {
    // console.log("Prev", flowState.bpIndex, {
    //   flowState,
    // });
    if (flowState.bpIndex > 0) {
      flowDispatch({ type: "PREV" });
    }
  }, [flowState, flowDispatch]);

  const handleReset = () => {
    flowDispatch({ type: "RESET" });
  };

  const handleInit = useCallback(() => {
    setIsLoading(true);
    // console.log("Compiling code..., ", flowState);
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
  }, [flowState, flowDispatch]);

  const handleSave = useCallback(() => {
    // console.log("CTRL+S pressed");
    handleInit();
  }, [handleInit]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // console.log("Key pressed", event.key);
      if (event.ctrlKey) {
        if (event.key === "s") {
          event.preventDefault();
          handleSave();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          // console.log("ArrowLeft pressed");
          handlePrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          // console.log("ArrowRight pressed");
          handleNext();
        }
      }
    },
    [handlePrev, handleNext, handleSave]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div>Flow Control</div>
      <Divider sx={{ width: "100%", padding: "4px" }} />
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          {flowState.initialized ? (
            <>
              <Grid container spacing={3}>
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
                  <div style={{ padding: "10px", fontWeight: "550" }}>
                    {flowState.bpIndex} / {flowState.breakpoints.length - 1}
                  </div>
                </Grid>
                <Grid item xs="auto">
                  <FlowControlButton
                    icon={<ArrowForwardIcon />}
                    color="secondary"
                    size="large"
                    disabled={
                      flowState.bpIndex === flowState.breakpoints.length - 1
                    }
                    onClick={handleNext}
                  />
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={3}>
                <Grid item xs="auto">
                  <FlowControlButton
                    isLoading={isLoading}
                    color="primary"
                    onClick={handleInit}
                  >
                    COMPILE
                  </FlowControlButton>
                </Grid>
                <Grid item xs="auto">
                  <FlowControlButton color="primary" onClick={handleReset}>
                    RESET
                  </FlowControlButton>
                </Grid>
              </Grid>
            </>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FlowControlButton
                  isLoading={isLoading}
                  color="primary"
                  onClick={handleInit}
                >
                  COMPILE
                </FlowControlButton>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default FlowControl;
