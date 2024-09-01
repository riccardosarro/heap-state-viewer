// imports
import "./styles.css";
import { Paper, styled } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  borderRadius: 4,
  flexGrow: 1,
  ...theme.applyStyles("dark", {
    backgroundColor: "#262B32",
  }),
  ...theme.applyStyles("light", {
    backgroundColor: "#f9f9f9",
  }),
}));

export default Item;
