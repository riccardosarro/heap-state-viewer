// imports
import React, { useEffect } from "react";
import "./styles.css";
// ui
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { Avatar, Divider, Stack } from "@mui/material";
// icons
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
// store
import { useFlow } from "../../store/flow-context";
// components
import BreakpointTreeItem from "../BreakpointTreeItem";
import BinsStateTreeItem from "../BinsStateTreeItem";
// types
import type { TreeViewBaseItem } from "@mui/x-tree-view";
import type { BreakpointsControlProps } from "./types";
import type { Chunk } from "../../hooks/types";
import type { BinsTreeViewItem } from "../BinsStateTreeItem/types";

const BreakpointsControl: React.FC<BreakpointsControlProps> = () => {
  const flowState = useFlow();
  const [currentChunks, setCurrentChunks] = React.useState<TreeViewBaseItem[]>(
    []
  );
  const [currentBins, setCurrentBins] = React.useState<BinsTreeViewItem[]>([]);


  const isItemDisabled = (item: BinsTreeViewItem) => !!item.disabled;

  useEffect(() => {
    const bp = flowState.breakpoints[flowState.bpIndex];
    if (bp) {
      setCurrentChunks(
        bp.chunks.map((chunk) => {
          const chunkInfoKeys = Object.keys(chunk).filter(
            (key) => key !== "allocated" && key !== "addr"
          ) as (keyof Chunk)[];
          return {
            id: chunk.addr + "",
            label: `${chunk.addr} - ${chunk.allocated}`,
            children: chunkInfoKeys.map((key) => ({
              id: chunk.addr + "." + key,
              label: key + " - " + chunk[key],
            })),
          };
        })
      );
      setCurrentBins(
        Object.keys(bp.bins).map((key) => {
          const bins = bp.bins[key as keyof typeof bp.bins];
          return {
            id: key,
            disabled: bins.length === 0,
            label: key,
            children: bins.map((bin, i) => ({
              id: key + "." + i,
              label: bin,
            })),
          };
        })
      );
    }
  }, [flowState.bpIndex, flowState.breakpoints]);

  return (
    <>
      <div>
        {flowState.bpIndex > -1 && (
          <Avatar
            sx={(theme) => ({
              background: theme.palette.primary.main,
              width: 28,
              height: 28,
              fontSize: "1rem",
              fontWeight: "bold",
              float: "left",
            })}
          >
            {flowState.bpIndex}
          </Avatar>
        )}
        Breakpoint Control
      </div>
      <Divider style={{ padding: "4px" }} />
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="column"
        useFlexGap
        sx={{
          flexWrap: "wrap",
          height: "100%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {flowState.breakpoints.length === 0 ? (
          <div>
            {flowState.initialized ? (
              <>
                <WarningIcon fontSize="large" />
                <br />
                Could not find any breakpoints, try another code and compile
                again!
              </>
            ) : (
              <>
                <InfoIcon fontSize="large" />
                <br />
                Such empty, much wow!
              </>
            )}
          </div>
        ) : (
          <>
            <RichTreeView
              defaultExpandedItems={["grid"]}
              slots={{
                expandIcon: AddIcon,
                collapseIcon: CloseIcon,
                item: BreakpointTreeItem,
              }}
              items={currentChunks}
              expansionTrigger="iconContainer"
            />
            <Divider style={{ padding: "4px" }} />

            <RichTreeView
              isItemDisabled={isItemDisabled}
              defaultExpandedItems={["grid"]}
              slots={{ item: BinsStateTreeItem }}
              items={currentBins}
            />
          </>
        )}
      </Stack>
    </>
  );
};

export default BreakpointsControl;
