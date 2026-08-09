import * as fs from "fs";
import path from "node:path";
export class resources {
}
resources.escape = '""';
export function getPrefix(v, date, offset, separator) {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return v + dateToString(d, separator);
  }
  else {
    return v + dateToString(date, separator);
  }
}
export function dateToString(date, separator) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = "0" + dt.toString();
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (separator !== undefined) {
    return "" + year + separator + month + separator + dt;
  }
  else {
    return "" + year + month + dt;
  }
}
export function timeToString(date, separator) {
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  if (hh < 10) {
    hh = "0" + hh.toString();
  }
  if (ss < 10) {
    ss = "0" + ss.toString();
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (separator !== undefined) {
    return "" + hh + separator + mm + separator + ss;
  }
  else {
    return "" + hh + mm + ss;
  }
}
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export function mkdirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
export const options = { flags: "a", encoding: "utf-8" };
export class FileWriter {
  constructor(writer) {
    this.writer = writer;
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.end = this.end.bind(this);
  }
  write(chunk) {
    const b1 = this.writer.write(chunk);
    return b1;
  }
  flush(cb) {
    this.writer.end(cb);
  }
  end(cb) {
    this.writer.end(cb);
  }
}
export class LogWriter {
  constructor(filename, dir, opts, suffix) {
    const o = opts ? opts : options;
    this.suffix = suffix ? suffix : "\n";
    this.writer = createWriteStream(dir, filename, o);
    this.writer.cork();
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.uncork = this.uncork.bind(this);
    this.end = this.end.bind(this);
  }
  write(data) {
    this.writer.write(data + this.suffix);
  }
  flush() {
    this.writer.uncork();
  }
  uncork() {
    this.writer.uncork();
  }
  end() {
    this.writer.end();
  }
}
export function createWriteStream(dir, filename, opts) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (dir.endsWith("/") || dir.endsWith("\\")) {
    return fs.createWriteStream(dir + filename, opts);
  }
  else {
    return fs.createWriteStream(path.join(dir, filename), opts);
  }
}
const e = "";
const s = "string";
const n = "number";
export function toCSV(obj, separator, end) {
  const o = obj;
  const keys = Object.keys(o);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    if (v == null) {
      cols.push(e);
    }
    else {
      if (typeof v === s) {
        cols.push(escapeCSV(v, separator));
      }
      else if (v instanceof Date) {
        cols.push(v.toISOString());
      }
      else if (typeof v === n) {
        cols.push(v.toString());
      }
      else {
        cols.push("" + v);
      }
    }
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join(separator);
}
export function toCSVWithSchema(obj, separator, attrs, end) {
  const o = obj;
  const keys = Object.keys(attrs);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    if (v == null) {
      cols.push(e);
    }
    else {
      if (attr.getString) {
        const v2 = attr.getString(v);
        cols.push(v2);
      }
      else {
        if (typeof v === s) {
          cols.push(escapeCSV(v, separator));
        }
        else if (typeof v === n) {
          cols.push(v.toString());
        }
        else if (v instanceof Date) {
          cols.push(v.toISOString());
        }
        else {
          cols.push("" + v);
        }
      }
    }
  }
  const ss = cols.join(separator);
  if (end && end.length > 0) {
    return ss + end;
  }
  else {
    return ss;
  }
}
export function escapeCSV(v, separator) {
  const needsQuote = v.includes(separator) || v.includes('"') || v.includes("\r") || v.includes("\n");
  if (!needsQuote)
    return v;
  return `"${v.replace(/"/g, resources.escape)}"`;
}
export class CSVFormatter {
  constructor(attributes, separator, end) {
    this.attributes = attributes;
    this.separator = separator;
    this.end = end && end.length > 0 ? end : "\n";
    this.format = this.format.bind(this);
  }
  format(v) {
    return toCSVWithSchema(v, this.separator, this.attributes, this.end);
  }
}
export function pad(v, l, p) {
  if (v.length > l) {
    return v.substring(0, l);
  }
  else {
    const c = l - v.length;
    const a = [];
    for (let i = 0; i < c; i++) {
      a.push(p);
    }
    return a.join("") + v;
  }
}
export function toFixedLength(obj, attrs, p, end) {
  const o = obj;
  const keys = Object.keys(attrs);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    let v2 = "";
    if (v != null) {
      if (attr.getString) {
        v2 = attr.getString(v);
      }
      else {
        if (typeof v === s) {
          v2 = v;
        }
        else if (typeof v === n) {
          v2 = v.toString();
        }
        else if (v instanceof Date) {
          v2 = v.toISOString();
        }
        else {
          v2 = "" + v;
        }
      }
    }
    cols.push(pad(v2, attr.length, p));
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join("");
}
export class FixedLengthFormatter {
  constructor(attributes, p, end) {
    this.attributes = attributes;
    this.end = end && end.length > 0 ? end : "\n";
    this.pad = p && p.length > 0 ? p : " ";
    this.format = this.format.bind(this);
  }
  format(v) {
    return toFixedLength(v, this.attributes, this.pad, this.end);
  }
}
export function toString(v) {
  if (typeof v === "string") {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
