import { asset, YAML } from "@silverbulletmd/silverbullet/syscalls";
import { WidgetContent } from "@silverbulletmd/silverbullet/types";

function checkValues(data: any): string | null {
  if (data["id"] === undefined) {
    return 'missing value "id"';
  }

  return null;
}

export async function widget(bodyText: string): Promise<WidgetContent> {
  const data = await YAML.parse(bodyText);
  const error = checkValues(data);

  if (error != null) {
    return { html: `<p>${error}</p>` };
  }

  const editor = await asset.readAsset("leaflet", "assets/editor.js");

  return Promise.resolve({
    html: `<div id="${data.id}"></div>`,
    script: editor,
  });
}
