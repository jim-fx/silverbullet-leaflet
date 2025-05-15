import "leaflet/dist/leaflet.css";
import "./map.css";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import React from "react";
import ReactDOM from "react-dom/client";
import { IconMarker } from "./icons.tsx";
import { MapData, MapDataSchema } from "./types.ts";
import { ZodError } from "zod";

const configRaw = JSON.parse(
  document.getElementById("map-content")?.textContent || "{}",
);

function ErrorContent({ error }: { error: ZodError<MapData> }) {
  return (
    <div>
      <p>Invalid config</p>
      {error.issues.map((issue, i) => {
        return <div key={i}>{issue.message} - {issue.path}</div>;
      })}
    </div>
  );
}

function App({ configRaw }: { configRaw: unknown }) {
  const res = MapDataSchema.safeParse(configRaw);
  if (res.error) {
    return <ErrorContent error={res.error} />;
  }
  const config = res.data;
  const position = [config.lat, config.lng] as [number, number];

  return (
    <MapContainer center={position} zoom={config.zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {config?.markers?.map((marker, i) => (
        <Marker
          key={i}
          position={[marker.lat, marker.lng]}
          title={marker.title}
          icon={IconMarker}
        >
          {(marker.title || marker.description) && (
            <Popup>
              {marker.title && <h4>{marker.title}</h4>}
              {marker.description && (
                <div dangerouslySetInnerHTML={{ __html: marker.description }} />
              )}
            </Popup>
          )}
        </Marker>
      ))}
      {config?.polylines?.map((line, i) => (
        <Polyline
          key={i}
          color="red"
          positions={line.points}
        />
      ))}
    </MapContainer>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App configRaw={configRaw} />);
