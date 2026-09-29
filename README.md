
# SilverBullet Leaflet Plug

Embedded Leaflet map for SilverBullet. Inspired by [skeetcha/silverbullet-leaflet](https://github.com/skeetcha/silverbullet-leaflet).

## Usage

Example snippet:

````markdown
```leaflet
lat: 59.025009
lng: 12.225037
zoom: 10
markers:
  - lat: 59.025009
    lng: 12.225037
    title: STARTPUNKT
    description: Das ist meine </br>description
polylines:
  - name: TestLine
    points:
      - [59.025009, 12.225037]
      - [59.025109, 12.225337]
      - [59.025209, 12.224837]
```
````

You can also add emojis to your markers like in the following example:
````markdown
```leaflet
markers:
  - lat: 59.025009
    lng: 12.225037
    icon: 🛶
    iconBackground: brown
    title: MyCanoe
```
````

## Build

```bash
# Install dependencies (requires Node.js and pnpm)
pnpm install-deps
# Build the plug
pnpm build
```

Or to watch for changes and rebuild automatically

```shell
pnpm watch
```

Then, copy the resulting `.plug.js` file into your space. Or build and copy in one command:

```shell
pnpm build && cp leaflet.plug.js /my/space/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.


## Installation

### SilverBullet v2

Run the `Library: Install` command and enter the URI of `PLUG.md` in this repo:

```
ghr:jim-fx/silverbullet-leaflet/PLUG.md
```

Alternatively, copy `leaflet.plug.js` anywhere into your space and run `Plugs: Reload`.

### SilverBullet v1

Add

```
- "github:jim-fx/silverbullet-leaflet/leaflet.plug.js"
```

to your `Space-Config` file and run the `Plugs: Update` command.

