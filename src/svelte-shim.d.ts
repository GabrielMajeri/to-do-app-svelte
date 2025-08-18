// Fix importing of Svelte modules in TypeScript files
// (required for component testing, for example)
//
// Based on https://stackoverflow.com/a/73026268/5723188
declare module "*.svelte" {
  import type { ComponentType } from "svelte";

  const component: ComponentType;
  export default component;
}
