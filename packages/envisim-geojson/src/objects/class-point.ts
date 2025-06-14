import { distance } from "@envisim/geojson-utils/geodesic";
import type * as GJ from "@envisim/geojson-utils/geojson";
import { ValidationError, type OptionalParam } from "@envisim/utils";
import { type BufferOptions } from "../buffer/index.js";
import { AbstractPointObject } from "./abstract-point-object.js";
import { Circle } from "./class-circle.js";

export class Point extends AbstractPointObject<GJ.Point> implements GJ.Point {
  static isObject(obj: unknown): obj is Point {
    return obj instanceof Point;
  }

  static assert(obj: unknown): asserts obj is Point {
    if (!this.isObject(obj))
      throw ValidationError.create["geojson-incorrect"]({ arg: "obj", type: "Point" });
  }

  static create(coordinates: GJ.Point["coordinates"], shallow: boolean = true): Point {
    return new Point({ coordinates }, shallow);
  }

  constructor(obj: OptionalParam<GJ.Point, "type">, shallow: boolean = true) {
    super({ ...obj, type: "Point" }, shallow);
  }

  copy(shallow: boolean = true): Point {
    return new Point(this, shallow);
  }

  // SINGLE TYPE OBJECT
  setBBox(): GJ.BBox {
    this.bbox = [...this.coordinates, ...this.coordinates] as GJ.BBox;
    return this.bbox;
  }

  getCoordinateArray(): GJ.Position[] {
    return [this.coordinates];
  }

  distanceToPosition(position: GJ.Position): number {
    return distance(position, this.coordinates);
  }

  centroid(): GJ.Position {
    return [...this.coordinates];
  }

  // POINTOBJECTS
  // POINT
  buffer(options: BufferOptions): Circle | null {
    const distance = options.distance ?? 0.0;
    if (distance <= 0.0) return null;
    return Circle.create(this.coordinates, distance, false);
  }
}
