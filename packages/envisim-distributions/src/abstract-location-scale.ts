import { ValidationError } from "@envisim/utils";
import { Distribution, Interval } from "./abstract-distribution.js";

export class LocationScaleParams {
  static DEFAULTS = { location: 0.0, scale: 1.0 } as const;
  #location: number;
  #scale: number;

  /**
   * @category Parameters
   */
  constructor(
    location: number = LocationScaleParams.DEFAULTS.location,
    scale: number = LocationScaleParams.DEFAULTS.scale,
  ) {
    ValidationError.check["number-not-positive"]({ arg: "scale" }, scale)?.raise();
    this.#location = location;
    this.#scale = scale;
  }

  get location() {
    return this.#location;
  }
  get scale() {
    return this.#scale;
  }

  normalize(x: number): number {
    return (x - this.#location) / this.#scale;
  }
}

export abstract class LocationScale extends Distribution {
  /** @internal */
  #params!: LocationScaleParams;

  constructor(location?: number, scale?: number) {
    super();
    this.#params = new LocationScaleParams(location, scale);
    this.support = new Interval(-Infinity, Infinity, true, true);
  }

  /** @internal */
  get params() {
    return this.#params;
  }
}
