import type {
  DefaultComponentProps,
  OverridableTypeMap,
} from "@mui/material/OverridableComponent";
import React from "react";

export interface CopyrightProps {
  props: DefaultComponentProps<OverridableTypeMap>;
  themeButton?: React.ReactNode;
}
