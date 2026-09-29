import { asset } from "@silverbulletmd/silverbullet/syscalls";
import { syscall } from "@silverbulletmd/silverbullet/syscall";
import type { CodeWidgetContent } from "@silverbulletmd/silverbullet/type/client";

export async function widget(bodyText: string): Promise<CodeWidgetContent> {
  const data = await syscall("yaml.parse", bodyText);
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
