import { asset, YAML } from "@silverbulletmd/silverbullet/syscalls";
import { WidgetContent } from "@silverbulletmd/silverbullet/types";

export async function widget(bodyText: string): Promise<WidgetContent> {
  const data = await YAML.parse(bodyText);
  const mapJs = await asset.readAsset("leaflet", "assets/map.js");
  const mapCss = await asset.readAsset("leaflet", "assets/map.css");
  return Promise.resolve({
    html: `
      <style>${mapCss}</style>
      <script type="application/json" id="map-content">
        ${JSON.stringify(data)}
      </script>
      <div id="app"></div>
    `,
    script: mapJs,
  });
}
