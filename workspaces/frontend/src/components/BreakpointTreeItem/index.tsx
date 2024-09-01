// imports
import React from "react";
import "./styles.css";
// ui
import { TreeItem2, TreeItem2Label, TreeItem2Props, treeItemClasses, UseTreeItem2LabelInputSlotOwnProps, UseTreeItem2LabelSlotOwnProps, useTreeItem2Utils } from '@mui/x-tree-view';
import { alpha, IconButton, styled } from '@mui/material';
import { TreeItem2LabelInput } from "@mui/x-tree-view/TreeItem2LabelInput";
// icons
import CheckIcon from "@mui/icons-material/Check";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// components
import MemoryViewerDialog from "../MemoryViewerDialog";
// types

const ThemedTreeItem2 = styled(TreeItem2)(({ theme }) => ({
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



interface CustomLabelProps extends UseTreeItem2LabelSlotOwnProps {
  isChunkItem: boolean;
}

function CustomLabel({
  isChunkItem,
  children,
  ...other
}: CustomLabelProps) {
  const addr = children?.toString().split(' ')[0];
  return (
    <TreeItem2Label
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '0.5rem',
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      {children}
      {isChunkItem && (
        <MemoryViewerDialog addr={addr} />
      )}
    </TreeItem2Label>
  );
}

interface CustomLabelInputProps extends UseTreeItem2LabelInputSlotOwnProps {
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  value: string;
}

function CustomLabelInput(props: Omit<CustomLabelInputProps, 'ref'>) {
  const { handleCancelItemLabelEditing, handleSaveItemLabel, value, ...other } =
    props;

  return (
    <React.Fragment>
      <TreeItem2LabelInput {...other} value={value} />
      <IconButton
        color="success"
        size="small"
        onClick={(event: React.MouseEvent) => {
          handleSaveItemLabel(event, value);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton color="error" size="small" onClick={handleCancelItemLabelEditing}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
}

const BreakpointTreeItem = React.forwardRef(function CustomTreeItem2(
  props: TreeItem2Props,
  ref: React.Ref<HTMLLIElement>,
) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentDoubleClick: UseTreeItem2LabelSlotOwnProps['onDoubleClick'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputBlur: UseTreeItem2LabelInputSlotOwnProps['onBlur'] = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputKeyDown: UseTreeItem2LabelInputSlotOwnProps['onKeyDown'] = (
    event,
  ) => {
    event.defaultMuiPrevented = true;
  };

  // check if item is a chunk item (has children)
  const isChunkItem = !!props.children;

  return (
    <ThemedTreeItem2
      {...props}
      ref={ref}
      slots={{ label: CustomLabel, labelInput: CustomLabelInput }}
      slotProps={{
        label: {
          onDoubleClick: handleContentDoubleClick,
          isChunkItem,
        } as CustomLabelProps,
        labelInput: {
          onBlur: handleInputBlur,
          onKeyDown: handleInputKeyDown,
          handleCancelItemLabelEditing: interactions.handleCancelItemLabelEditing,
          handleSaveItemLabel: interactions.handleSaveItemLabel,
        } as CustomLabelInputProps,
      }}
    />
  );
});



export default BreakpointTreeItem;
