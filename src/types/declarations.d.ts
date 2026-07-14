// Ambient type declarations for packages without built-in types.

declare module "*.yml" {
  const content: Record<string, unknown>;
  export default content;
}

declare module "*.yaml" {
  const content: Record<string, unknown>;
  export default content;
}

declare module "plotly.js-dist-min" {
  import * as Plotly from "plotly.js";
  export default Plotly;
}

declare module "turndown-plugin-gfm" {
  import type TurndownService from "turndown";
  export const gfm: TurndownService.Plugin;
  export const tables: TurndownService.Plugin;
  export const strikethrough: TurndownService.Plugin;
  export const taskListItems: TurndownService.Plugin;
}
