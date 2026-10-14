/* tslint:disable */

declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

// Hermes and Node provide these globals, but the RN tsconfig has no DOM lib
declare function atob(data: string): string
declare function btoa(data: string): string
