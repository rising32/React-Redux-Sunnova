import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-H"
               changePositionKey="ctrl-Q"
               defaultPosition="left"
               fluid={false}
               defaultSize={340}
               defaultIsVisible={false}>
    <LogMonitor />
  </DockMonitor>
);

// gMaxBen427o
// App ID: a8885317-4d77-47a9-95ce-cc6ab0d3ed09
// App Key: 4f2ebc3f-48c7-4d2a-b982-ec376db47afd
