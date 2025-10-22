// To parse this data:
//
//   import { Convert, WpPageFeaturedMedia } from "./file";
//
//   const wpPageFeaturedMedia = Convert.toWpPageFeaturedMedia(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface WpPageFeaturedMedia {
  id:             number;
  date:           Date;
  date_gmt:       Date;
  guid:           Caption;
  modified:       Date;
  modified_gmt:   Date;
  slug:           string;
  status:         string;
  type:           string;
  link:           string;
  title:          Caption;
  author:         number;
  featured_media: number;
  comment_status: string;
  ping_status:    string;
  template:       string;
  meta:           any[];
  class_list:     string[];
  description:    Caption;
  caption:        Caption;
  alt_text:       string;
  media_type:     string;
  mime_type:      string;
  media_details:  MediaDetails;
  post:           number;
  source_url:     string;
  _links:         Links;
}

export interface Links {
  self:       About[];
  collection: About[];
  about:      About[];
  author:     Author[];
  replies:    Author[];
}

export interface About {
  href: string;
}

export interface Author {
  embeddable: boolean;
  href:       string;
}

export interface Caption {
  rendered: string;
}

export interface MediaDetails {
  width:      number;
  height:     number;
  file:       string;
  filesize:   number;
  sizes:      Sizes;
  image_meta: ImageMeta;
}

export interface ImageMeta {
  aperture:          string;
  credit:            string;
  camera:            string;
  caption:           string;
  created_timestamp: string;
  copyright:         string;
  focal_length:      string;
  iso:               string;
  shutter_speed:     string;
  title:             string;
  orientation:       string;
  keywords:          any[];
}

export interface Sizes {
  medium:       Full;
  thumbnail:    Full;
  medium_large: Full;
  full:         Full;
}

export interface Full {
  file:       string;
  width:      number;
  height:     number;
  mime_type:  string;
  source_url: string;
  filesize?:  number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWpPageFeaturedMedia(json: string): WpPageFeaturedMedia {
      return cast(JSON.parse(json), r("WpPageFeaturedMedia"));
  }

  public static wpPageFeaturedMediaToJson(value: WpPageFeaturedMedia): string {
      return JSON.stringify(uncast(value, r("WpPageFeaturedMedia")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
      if (typ.length === 2 && typ[0] === undefined) {
          return `an optional ${prettyTypeName(typ[1])}`;
      } else {
          return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
      }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
      return typ.literal;
  } else {
      return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
          const typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue(l("Date"), val, key, parent);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue(l(ref || "object"), val, key, parent);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps, key, ref);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps, key, ref);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
      ref = typ.ref;
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "WpPageFeaturedMedia": o([
      { json: "id", js: "id", typ: 0 },
      { json: "date", js: "date", typ: Date },
      { json: "date_gmt", js: "date_gmt", typ: Date },
      { json: "guid", js: "guid", typ: r("Caption") },
      { json: "modified", js: "modified", typ: Date },
      { json: "modified_gmt", js: "modified_gmt", typ: Date },
      { json: "slug", js: "slug", typ: "" },
      { json: "status", js: "status", typ: "" },
      { json: "type", js: "type", typ: "" },
      { json: "link", js: "link", typ: "" },
      { json: "title", js: "title", typ: r("Caption") },
      { json: "author", js: "author", typ: 0 },
      { json: "featured_media", js: "featured_media", typ: 0 },
      { json: "comment_status", js: "comment_status", typ: "" },
      { json: "ping_status", js: "ping_status", typ: "" },
      { json: "template", js: "template", typ: "" },
      { json: "meta", js: "meta", typ: a("any") },
      { json: "class_list", js: "class_list", typ: a("") },
      { json: "description", js: "description", typ: r("Caption") },
      { json: "caption", js: "caption", typ: r("Caption") },
      { json: "alt_text", js: "alt_text", typ: "" },
      { json: "media_type", js: "media_type", typ: "" },
      { json: "mime_type", js: "mime_type", typ: "" },
      { json: "media_details", js: "media_details", typ: r("MediaDetails") },
      { json: "post", js: "post", typ: 0 },
      { json: "source_url", js: "source_url", typ: "" },
      { json: "_links", js: "_links", typ: r("Links") },
  ], false),
  "Links": o([
      { json: "self", js: "self", typ: a(r("About")) },
      { json: "collection", js: "collection", typ: a(r("About")) },
      { json: "about", js: "about", typ: a(r("About")) },
      { json: "author", js: "author", typ: a(r("Author")) },
      { json: "replies", js: "replies", typ: a(r("Author")) },
  ], false),
  "About": o([
      { json: "href", js: "href", typ: "" },
  ], false),
  "Author": o([
      { json: "embeddable", js: "embeddable", typ: true },
      { json: "href", js: "href", typ: "" },
  ], false),
  "Caption": o([
      { json: "rendered", js: "rendered", typ: "" },
  ], false),
  "MediaDetails": o([
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "file", js: "file", typ: "" },
      { json: "filesize", js: "filesize", typ: 0 },
      { json: "sizes", js: "sizes", typ: r("Sizes") },
      { json: "image_meta", js: "image_meta", typ: r("ImageMeta") },
  ], false),
  "ImageMeta": o([
      { json: "aperture", js: "aperture", typ: "" },
      { json: "credit", js: "credit", typ: "" },
      { json: "camera", js: "camera", typ: "" },
      { json: "caption", js: "caption", typ: "" },
      { json: "created_timestamp", js: "created_timestamp", typ: "" },
      { json: "copyright", js: "copyright", typ: "" },
      { json: "focal_length", js: "focal_length", typ: "" },
      { json: "iso", js: "iso", typ: "" },
      { json: "shutter_speed", js: "shutter_speed", typ: "" },
      { json: "title", js: "title", typ: "" },
      { json: "orientation", js: "orientation", typ: "" },
      { json: "keywords", js: "keywords", typ: a("any") },
  ], false),
  "Sizes": o([
      { json: "medium", js: "medium", typ: r("Full") },
      { json: "thumbnail", js: "thumbnail", typ: r("Full") },
      { json: "medium_large", js: "medium_large", typ: r("Full") },
      { json: "full", js: "full", typ: r("Full") },
  ], false),
  "Full": o([
      { json: "file", js: "file", typ: "" },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "mime_type", js: "mime_type", typ: "" },
      { json: "source_url", js: "source_url", typ: "" },
      { json: "filesize", js: "filesize", typ: u(undefined, 0) },
  ], false),
};
