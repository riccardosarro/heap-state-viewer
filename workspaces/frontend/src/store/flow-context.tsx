import React, { createContext, useReducer, useContext } from "react";
// types
import type { Breakpoint } from "../hooks/types";

// Define the shape of your context state
interface FlowState {
  breakpoints: Breakpoint[];
  bpIndex: number;
  initialized: boolean;
  code: string;
}

const initialState: FlowState = {
  breakpoints: [],
  bpIndex: -1,
  initialized: false,
/*
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *a = malloc(sizeof(int));
    free(a);
    return 0;
}
*/code: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n\tint *a = malloc(sizeof(int));\n\tfree(a);\n\treturn 0;\n}',
  // to add Breakpoints Control state
};

// ACTIONS
const INIT = "INIT";
type InitAction = typeof INIT;
const NEXT = "NEXT";
type NextAction = typeof NEXT;
const PREV = "PREV";
type PrevAction = typeof PREV;
const RESET = "RESET";
type ResetAction = typeof RESET;
const SET_CODE = "SET_CODE";
type SetCodeAction = typeof SET_CODE;
const SET_BP_INDEX = "SET_BP_INDEX";
type SetBPIndexAction = typeof SET_BP_INDEX;

// Define the shape of your actions
type FlowAction =
  | { type: InitAction; payload: { breakpoints: Breakpoint[] } }
  | { type: NextAction }
  | { type: PrevAction }
  | { type: ResetAction }
  | { type: SetCodeAction; payload: string }
  | { type: SetBPIndexAction; payload: number };
// Add more actions as needed

/**
 * Define your contexts
 */ 
const FlowContext = createContext<
  FlowState | undefined
>(undefined);

const FlowDispatchContext = createContext<React.Dispatch<FlowAction> | undefined>(
  undefined
);

// Define your reducer
const flowReducer = (state: FlowState, action: FlowAction): FlowState => {
  switch (action.type) {
    // Handle your actions here
    case INIT:
      return {
        ...state,
        bpIndex: 0,
        breakpoints: action.payload.breakpoints,
        initialized: true,
      };
    case NEXT:
      const nextIndex = state.bpIndex + 1;
      if (
        nextIndex >= state.breakpoints.length ||
        state.initialized === false
      ) {
        return state;
      }
      return {
        ...state,
        bpIndex: nextIndex,
      };
    case PREV:
      const prevIndex = state.bpIndex - 1;
      if (prevIndex < 0 || state.initialized === false) {
        return state;
      }
      return {
        ...state,
        bpIndex: prevIndex,
      };
    case RESET:
      return initialState;
    case SET_CODE:
      return {
        ...state,
        code: action.payload,
      };
    case SET_BP_INDEX:
      if (action.payload < 0 || action.payload >= state.breakpoints.length) {
        return state;
      }
      return {
        ...state,
        bpIndex: action.payload
      };
    default:
      return state;
  }
};

// Define your provider
export const FlowProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(flowReducer, initialState);

  return (
    <FlowContext.Provider value={state}>
      <FlowDispatchContext.Provider value={dispatch}>
        {children}
      </FlowDispatchContext.Provider>
    </FlowContext.Provider>
  );
};


/**
 *  Define a hook for easy access to the context
 */

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};

export const useFlowDispatch = () => {
  const context = useContext(FlowDispatchContext);
  if (context === undefined) {
    throw new Error("useFlowDispatch must be used within a FlowProvider");
  }
  return context;
}