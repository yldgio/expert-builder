declare module "js-yaml" {
  const yaml: {
    JSON_SCHEMA: unknown;
    safeLoad(source: string, options: { schema: unknown }): unknown;
  };

  export default yaml;
}
