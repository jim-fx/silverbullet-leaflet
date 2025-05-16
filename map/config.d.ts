declare module "virtual:config" {
  interface Config {
    name: string;
    version: string;
    assets: string[];
  }

  const config: Config;
  export default config;
}
