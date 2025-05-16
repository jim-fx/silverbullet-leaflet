import z from "zod";

export const MarkerDataSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  iconBackground: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.iconBackground && !data.icon) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "iconBackground can only be used when icon is set",
      path: ["iconBackground"],
    });
  }
});

export type MarkerData = z.infer<typeof MarkerDataSchema>;

export const LineDataSchema = z.object({
  name: z.string(),
  points: z.array(z.tuple([z.number(), z.number()])),
});

export const MapDataSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(20),
  markers: z.array(MarkerDataSchema).optional(),
  polylines: z.array(LineDataSchema).optional(),
});

export type MapData = z.infer<typeof MapDataSchema>;
