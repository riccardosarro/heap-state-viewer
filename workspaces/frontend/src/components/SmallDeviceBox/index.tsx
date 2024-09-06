// imports
import React from "react";
import "./styles.css";

// types
import type { SmallDeviceBoxProps } from "./types";
// ui
import { Box, Divider, IconButton, Typography } from "@mui/material";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

const SmallDeviceBox: React.FC<SmallDeviceBoxProps> = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "78vh",
        padding: "0 10rem",
        width: "100%",
        fontSize: "1.5rem",
      }}
    >
      <IconButton size="small" disableRipple>
        <SentimentDissatisfiedOutlinedIcon fontSize="large" />
      </IconButton>
      <Typography variant="h4" gutterBottom>
        Oops!
      </Typography>
      <br />
      <Divider
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          margin: "1rem 0",
        }}
      />
      <br />
      <Typography variant="h5">
        Sorry, but this application is not meant for small screens.<br/>
        Please use another device or enlarge your window.
      </Typography>
    </Box>
  );
};

export default SmallDeviceBox;
