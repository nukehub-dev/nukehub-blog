// Ambient type declarations for packages without built-in types.

declare module "*.yml" {
  const content: Record<string, unknown>;
  export default content;
}

declare module "*.yaml" {
  const content: Record<string, unknown>;
  export default content;
}
