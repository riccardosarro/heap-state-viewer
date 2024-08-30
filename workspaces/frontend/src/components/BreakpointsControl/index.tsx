// imports
import React from "react";
import "./styles.css";
// ui
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { Divider, Stack } from "@mui/material";
import { TreeViewBaseItem } from "@mui/x-tree-view";
// icons
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
// store
import { useFlow } from "../../store/flow-context";
// components
import BreakpointTreeItem from "../BreakpointTreeItem";

// types
import type { BreakpointsControlProps } from "./types";
import type { Chunk } from "../../hooks/types";

const BreakpointsControl: React.FC<BreakpointsControlProps> = () => {
  const [flowState, ] = useFlow();
  const breakpoints: TreeViewBaseItem[] = flowState.breakpoints.map((bp) => ({
    id: bp.id + "",
    label: bp.id + " - " + bp.function,
    children: bp.chunks.map((chunk) => ({
      id: bp.id + "." + chunk.addr,
      label: `${chunk.addr} - ${chunk.allocated}`,
      children: (Object.keys(chunk) as (keyof Chunk)[]).map((key) => ({
        id: bp.id + "." + chunk.addr + "." + key,
        label: key + " - " + chunk[key],
      }))
    })
    )
  }));
  
  return (
    <>
      <div>Breakpoints</div>
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
                Could not find any breakpoints, try another code and compile again!
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
          <RichTreeView
        defaultExpandedItems={['grid']}
        
        slots={{
          expandIcon: AddIcon,
          collapseIcon: CloseIcon,
          // endIcon: CloseSquare,
          item: BreakpointTreeItem,
        }}
        items={breakpoints}
      />
        )}
      </Stack>
    </>
  );
};

export default BreakpointsControl;
