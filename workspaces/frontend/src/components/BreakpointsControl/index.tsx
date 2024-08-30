// imports
import React from "react";
import "./styles.css";
// ui
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
// store
import { useFlow } from "../../store/flow-context";

// types
import type { BreakpointsControlProps } from "./types";
import { alpha, Divider, Icon, Paper, Stack, styled, SvgIcon, SvgIconProps } from "@mui/material";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import { Chunk } from "../../hooks/types";


// const CustomTreeItem = styled(TreeItem)({
//   [`& .${treeItemClasses.iconContainer}`]: {
//     '& .close': {
//       opacity: 0.3,
//     },
//   },
// });


const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '1.10rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

function CloseSquare(props: SvgIconProps) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}



const BreakpointsControl: React.FC<BreakpointsControlProps> = () => {
  const [flowState, flowDispatch] = useFlow();
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
          item: CustomTreeItem,
        }}
        items={breakpoints}
      />
        )}
      </Stack>
    </>
  );
};

export default BreakpointsControl;
