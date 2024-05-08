// imports
import React from 'react';
import "./styles.css";

// types
import type { ChunkViewerProps } from './types';

const ChunkViewer: React.FC<ChunkViewerProps> = () => {
  return (
    <div style={{height: '75vh'}}>
      Chunk Viewer
    </div>

  );
}

export default ChunkViewer;
