import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SnackCloseAction = (handleClose: () => void) => {
  return (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export {SnackCloseAction};