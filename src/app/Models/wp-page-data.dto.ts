// To parse this data:
//
//   import { Convert, WpPage } from "./file";
//
//   const wpPage = Convert.toWpPage(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface WpPage {
  id:             number;
  date:           Date;
  date_gmt:       Date;
  guid:           GUID;
  modified:       Date;
  modified_gmt:   Date;
  slug:           string;
  status:         string;
  type:           string;
  link:           string;
  title:          GUID;
  content:        Content;
  excerpt:        Content;
  author:         number;
  featured_media: number;
  parent:         number;
  menu_order:     number;
  comment_status: string;
  ping_status:    string;
  template:       string;
  meta:           Meta;
  class_list:     string[];
  _links:         Links;
}

export interface Links {
  self:                  About[];
  collection:            About[];
  about:                 About[];
  author:                Author[];
  replies:               Author[];
  "version-history":     VersionHistory[];
  "predecessor-version": PredecessorVersion[];
  "wp:featuredmedia":    Author[];
  "wp:attachment":       About[];
  curies:                Cury[];
}

export interface About {
  href: string;
}

export interface Author {
  embeddable: boolean;
  href:       string;
}

export interface Cury {
  name:      string;
  href:      string;
  templated: boolean;
}

export interface PredecessorVersion {
  id:   number;
  href: string;
}

export interface VersionHistory {
  count: number;
  href:  string;
}

export interface Content {
  rendered:  string;
  protected: boolean;
}

export interface GUID {
  rendered: string;
}

export interface Meta {
  footnotes: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWpPage(json: string): WpPage {
      return cast(JSON.parse(json), r("WpPage"));
  }

  public static wpPageToJson(value: WpPage): string {
      return JSON.stringify(uncast(value, r("WpPage")), null, 2);
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
  "WpPage": o([
      { json: "id", js: "id", typ: 0 },
      { json: "date", js: "date", typ: Date },
      { json: "date_gmt", js: "date_gmt", typ: Date },
      { json: "guid", js: "guid", typ: r("GUID") },
      { json: "modified", js: "modified", typ: Date },
      { json: "modified_gmt", js: "modified_gmt", typ: Date },
      { json: "slug", js: "slug", typ: "" },
      { json: "status", js: "status", typ: "" },
      { json: "type", js: "type", typ: "" },
      { json: "link", js: "link", typ: "" },
      { json: "title", js: "title", typ: r("GUID") },
      { json: "content", js: "content", typ: r("Content") },
      { json: "excerpt", js: "excerpt", typ: r("Content") },
      { json: "author", js: "author", typ: 0 },
      { json: "featured_media", js: "featured_media", typ: 0 },
      { json: "parent", js: "parent", typ: 0 },
      { json: "menu_order", js: "menu_order", typ: 0 },
      { json: "comment_status", js: "comment_status", typ: "" },
      { json: "ping_status", js: "ping_status", typ: "" },
      { json: "template", js: "template", typ: "" },
      { json: "meta", js: "meta", typ: r("Meta") },
      { json: "class_list", js: "class_list", typ: a("") },
      { json: "_links", js: "_links", typ: r("Links") },
  ], false),
  "Links": o([
      { json: "self", js: "self", typ: a(r("About")) },
      { json: "collection", js: "collection", typ: a(r("About")) },
      { json: "about", js: "about", typ: a(r("About")) },
      { json: "author", js: "author", typ: a(r("Author")) },
      { json: "replies", js: "replies", typ: a(r("Author")) },
      { json: "version-history", js: "version-history", typ: a(r("VersionHistory")) },
      { json: "predecessor-version", js: "predecessor-version", typ: a(r("PredecessorVersion")) },
      { json: "wp:featuredmedia", js: "wp:featuredmedia", typ: a(r("Author")) },
      { json: "wp:attachment", js: "wp:attachment", typ: a(r("About")) },
      { json: "curies", js: "curies", typ: a(r("Cury")) },
  ], false),
  "About": o([
      { json: "href", js: "href", typ: "" },
  ], false),
  "Author": o([
      { json: "embeddable", js: "embeddable", typ: true },
      { json: "href", js: "href", typ: "" },
  ], false),
  "Cury": o([
      { json: "name", js: "name", typ: "" },
      { json: "href", js: "href", typ: "" },
      { json: "templated", js: "templated", typ: true },
  ], false),
  "PredecessorVersion": o([
      { json: "id", js: "id", typ: 0 },
      { json: "href", js: "href", typ: "" },
  ], false),
  "VersionHistory": o([
      { json: "count", js: "count", typ: 0 },
      { json: "href", js: "href", typ: "" },
  ], false),
  "Content": o([
      { json: "rendered", js: "rendered", typ: "" },
      { json: "protected", js: "protected", typ: true },
  ], false),
  "GUID": o([
      { json: "rendered", js: "rendered", typ: "" },
  ], false),
  "Meta": o([
      { json: "footnotes", js: "footnotes", typ: "" },
  ], false),
};
