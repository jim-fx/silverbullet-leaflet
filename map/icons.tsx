import { Marker as LeafletMarker, Popup } from "react-leaflet";
import markerContent from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MarkerData } from "./types.ts";
import React from "react";
import L, { DivIcon } from "leaflet";

export const IconMarker = L.icon({
  iconUrl: markerContent,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const existingIcons: Record<string, DivIcon> = {};
function createEmojiIcon(
  icon: string,
  backgroundColor: string = "white",
): DivIcon {
  if (existingIcons[icon]) return existingIcons[icon];
  const style = `.icon-${icon}:after{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-shadow: 0px 1px 1px rgba(3, 7, 18, 0.02),
        0px 5px 4px rgba(3, 7, 18, 0.03),
        0px 12px 9px rgba(3, 7, 18, 0.05),
        0px 20px 15px rgba(3, 7, 18, 0.06),
        0px 32px 24px rgba(3, 7, 18, 0.08);
      background: ${backgroundColor};
      content: "${icon}";
      text-align: center;
      font-size: 20px;
      display: block;
      text-shadow: 0px 0px 8px #0003;
    }`;
  const styleEl = document.createElement("style");
  styleEl.appendChild(document.createTextNode(style));
  document.head.appendChild(styleEl);

  const iconEl = L.divIcon({
    shadowUrl: markerShadow,
    iconSize: [30, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: `icon-${icon}`,
  });
  existingIcons[icon] = iconEl;
  return iconEl;
}

export const Marker = (
  { lat, lng, title, description, iconBackground, icon }: MarkerData,
) => {
  let iconElement: DivIcon | undefined = IconMarker;
  if (icon) {
    iconElement = createEmojiIcon(icon, iconBackground);
  }

  return (
    <LeafletMarker
      position={[lat, lng]}
      title={title}
      icon={iconElement}
    >
      {(title || description) && (
        <Popup>
          {title && <h4>{title}</h4>}
          {description && (
            <div dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </Popup>
      )}
    </LeafletMarker>
  );
};
