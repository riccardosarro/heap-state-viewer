// imports
import React, { useCallback, useEffect, useMemo } from "react";
import "./styles.css";
// store
import { useFlow, useFlowDispatch } from "../../store/flow-context";
import { useSnackbar } from "notistack";
import { SnackCloseAction } from "../../store/snacks-utils";
// ui
import { Box, Container, Divider, Grid, Slider } from "@mui/material";
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
    const marks = useMemo(() => {
      let totalMarks = 10; // Desired number of marks
      let breakpointsCount = flowState.breakpoints.length;
      let interval = Math.max(1, Math.floor(breakpointsCount / totalMarks));
      let marks = flowState.breakpoints
        .map((_, i) => ({
          value: i,
          label: i.toString(),
        }))
        .filter(
          (_, i) =>
            (i + interval <= breakpointsCount && i % interval === 0) ||
            i === breakpointsCount - 1
        );
      return marks;
    }, [flowState.breakpoints]);
  // snackbars
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // handlers
  const handleNext = useCallback(() => {
    if (flowState.bpIndex < flowState.breakpoints.length - 1) {
      flowDispatch({ type: "NEXT" });
    }
  }, [flowState, flowDispatch]);

  const handlePrev = useCallback(() => {
    if (flowState.bpIndex > 0) {
      flowDispatch({ type: "PREV" });
    }
  }, [flowState, flowDispatch]);

  const handleReset = () => {
    flowDispatch({ type: "RESET" });
  };

  const handleBpIndexChange = useCallback(
    (event: Event, value: number | number[]) => {
      if (typeof value === "number") {
        flowDispatch({ type: "SET_BP_INDEX", payload: value });
      }
    },
    [flowDispatch]
  );

  const handleInit = useCallback(() => {
    setIsLoading(true);
    const infoKey = enqueueSnackbar("Compiling code...", {
      variant: "info",
      persist: true,
    });
    sendCompile(flowState.code, {})
      .then((res) => {
        if ("error" in res) {
          throw new Error(res.error);
        }
        const breakpoints = res.breakpoints;
        flowDispatch({ type: "INIT", payload: { breakpoints } });
        enqueueSnackbar("Code compiled successfully", {
          variant: "success",
        });
        setIsLoading(false);
        closeSnackbar(infoKey);
      })
      .catch((err) => {
        console.error(err);
        const message = `${err.message}. See backend logs for more details.`;
        enqueueSnackbar(message, {
          variant: "error",
          key: "error." + infoKey,
          action: SnackCloseAction(() => closeSnackbar("error." + infoKey)),
          persist: true,
        });
        setIsLoading(false);
        closeSnackbar(infoKey);
      });
  }, [flowState, flowDispatch, enqueueSnackbar, closeSnackbar]);

  const handleSave = useCallback(() => {
    handleInit();
  }, [handleInit]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "s") {
          event.preventDefault();
          handleSave();
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          handlePrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          handleNext();
        }
      }
    },
    [handlePrev, handleNext, handleSave]
  );

  // useEffects
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // render
  return (
    <>
      <div>Flow Control</div>
      <Divider sx={{ width: "100%", padding: "4px" }} />
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}
      >
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          {flowState.initialized ? (
            <>
                <Slider
                  sx={{ width: "100%" }}
                  aria-label="Breakpoint Index"
                  value={flowState.bpIndex}
                  color="primary"
                  onChange={handleBpIndexChange}
                  getAriaValueText={(value) => "#" + value.toString()}
                  valueLabelDisplay="auto"
                  shiftStep={1}
                  step={1}
                  marks={marks}
                  min={0}
                  max={flowState.breakpoints.length - 1}
                />
              <Grid container spacing={3} sx={{display:'flex', justifyContent:'center', alignItems: 'center'}}>
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
