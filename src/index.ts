import { once } from 'events';
import { WriteStream } from 'fs';
import * as fs from 'fs';
import * as promises from 'node:fs/promises';
import * as readline from 'readline';

// tslint:disable-next-line:class-name
export class resources {
  static regex = /[^\d](\d{14})\.csv$/g;
}
export function getDate(fileName: string): Date | undefined {
  const nm = resources.regex.exec(fileName);
  if (!nm || nm.length < 2) {
    return undefined;
  }
  const v = nm[1];
  const ft = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}`;
  const d = new Date(ft);
  const num = d.getTime();
  if (!num || isNaN(num)) {
    return undefined;
  }
  return d;
}

export interface SimpleMap {
  [key: string]: string | number | boolean | Date;
}
export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
  | 'boolean' | 'number' | 'integer' | 'string' | 'text'
  | 'object' | 'array' | 'binary'
  | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface BaseAttribute {
  name?: string;
  field?: string;
  column?: string;
  type?: DataType;
  format?: FormatType;
  required?: boolean;
  match?: MatchType;
  default?: string | number | Date | boolean;
  key?: boolean;
  unique?: boolean;
  enum?: string[] | number[];
  q?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  nopatch?: boolean;
  version?: boolean;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  precision?: number;
  scale?: number;
  exp?: RegExp | string;
  code?: string;
  noformat?: boolean;
  ignored?: boolean;
  jsonField?: string;
  link?: string;
  typeof?: Attributes;
  true?: string | number;
  false?: string | number;
  getString?: (v: any) => string;
}
export interface Attribute extends BaseAttribute {
  length?: number;
}
export interface FixedLengthAttribute extends BaseAttribute {
  length: number;
}
export interface Attributes {
  [key: string]: Attribute;
}
export interface FixedLengthAttributes {
  [key: string]: FixedLengthAttribute;
}
export interface Parser<T> {
  parse: (data: string) => Promise<T>;
}
export interface Transformer<T> {
  transform: (data: string) => Promise<T>;
}
// tslint:disable-next-line:max-classes-per-file
export class Delimiter<T> {
  constructor(private delimiter: string, private attrs: Attributes) {
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data: string): Promise<T> {
    return this.transform(data);
  }
  transform(data: string): Promise<T> {
    const keys = Object.keys(this.attrs);
    let rs: any = {};
    const list: string[] = data.split(this.delimiter);
    const l = Math.min(list.length, keys.length);
    for (let i = 0; i < l; i++) {
      const attr = this.attrs[keys[i]];
      const v = list[i];
      rs = parse(rs, v, keys[i], attr);
    }
    return Promise.resolve(rs);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class DelimiterTransformer<T> extends Delimiter<T> {
}
// tslint:disable-next-line:max-classes-per-file
export class DelimiterParser<T> extends Delimiter<T> {
}
// tslint:disable-next-line:max-classes-per-file
export class CSVParser<T> extends Delimiter<T> {
}
// tslint:disable-next-line:max-classes-per-file
export class FixedLengthTransformer<T> {
  constructor(private attrs: Attributes) {
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data: string): Promise<T> {
    return this.transform(data);
  }
  transform(data: string): Promise<T> {
    const keys = Object.keys(this.attrs);
    let rs: any = {};
    let i = 0;
    for (const key of keys) {
      const attr = this.attrs[key];
      const len = attr.length ? attr.length : 10;
      const v = data.substring(i, i + len);
      rs = parse(rs, v.trim(), key, attr);
      i = i + len;
    }
    return Promise.resolve(rs);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class FixedLengthParser<T> extends FixedLengthTransformer<T> {
}
export function parse(rs: any, v: string, key: string, attr: Attribute): any {
  if (attr.default !== undefined && v.length === 0) {
    rs[key] = attr.default;
    return rs;
  }
  switch (attr.type) {
    case 'number':
    case 'integer':
      // tslint:disable-next-line:radix
      const parsed = parseInt(v);
      if (!isNaN(parsed) || !Number(parsed)) {
        rs[key] = parsed;
      }
      break;
    case 'datetime':
    case 'date':
      const d = new Date(v);
      if (d instanceof Date && !isNaN(d.valueOf())) {
        rs[key] = d;
      }
      break;
    case 'boolean':
      if (v === '1' || v === 'Y' || v === 'T') {
        rs[key] = true;
      } else if (v.length > 0) {
        rs[key] = false;
      }
      break;
    default:
      rs[key] = v;
      break;
  }
  return rs;
}
// tslint:disable-next-line:ban-types
export function buildStrings(files: String[]): string[] {
  const res: string[] = [];
  for (const file of files) {
    res.push(file.toString());
  }
  return res;
}
export function getFiles(files: string[], check: (s: string) => boolean): string[] {
  const res: string[] = [];
  for (const file of files) {
    const v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
// tslint:disable-next-line:max-classes-per-file
export class NameChecker {
  constructor(private prefix: string, private suffix: string) {
    this.check = this.check.bind(this);
  }
  check(name: string): boolean {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  }
}
export function getPrefix(v: string, date: Date, offset?: number, separator?: string): string {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return v + dateToString(d, separator);
  } else {
    return v + dateToString(date, separator);
  }
}
export function dateToString(date: Date, separator?: string): string {
  const year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let dt: number | string = date.getDate();

  if (dt < 10) {
    dt = '0' + dt.toString();
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (separator !== undefined) {
    return '' + year + separator + month + separator + dt;
  } else {
    return '' + year + month + dt;
  }
}
export function timeToString(date: Date, separator?: string): string {
  let hh: number | string = date.getHours();
  let mm: number | string = date.getMinutes();
  let ss: number | string = date.getSeconds();
  if (hh < 10) {
    hh = '0' + hh.toString();
  }
  if (ss < 10) {
    ss = '0' + ss.toString();
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (separator !== undefined) {
    return '' + hh + separator + mm + separator + ss;
  } else {
    return '' + hh + mm + ss;
  }
}
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export async function createReader(filename: string, opts?: BufferEncoding): Promise<readline.Interface> {
  const c: BufferEncoding = (opts !== undefined ? opts : 'utf-8');
  const stream = fs.createReadStream(filename, c);
  await Promise.all([once(stream, 'open')]);
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity });
  return read;
}
export interface StreamOptions {
  flags?: string | undefined;
  encoding?: BufferEncoding | undefined;
  fd?: number | promises.FileHandle | undefined;
  mode?: number | undefined;
  autoClose?: boolean | undefined;
  /**
   * @default false
   */
  emitClose?: boolean | undefined;
  start?: number | undefined;
  highWaterMark?: number | undefined;
}
export const options: StreamOptions = { flags: 'a', encoding: 'utf-8' };
// tslint:disable-next-line:max-classes-per-file
export class FileWriter {
  // suffix: string;
  constructor(public writer: WriteStream) {
    // this.suffix = (suffix ? suffix : '\n');
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.end = this.end.bind(this);
  }
  write(chunk: any): boolean {
    const b1 = this.writer.write(chunk);
    // const b2 = this.writer.write(this.suffix);
    return b1;
  }
  flush(cb?: () => void): void {
    this.writer.end(cb);
  }
  end(cb?: () => void): void {
    this.writer.end(cb);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class LogWriter {
  private writer: WriteStream;
  suffix: string;
  constructor(filename: string, dir: string, opts?: BufferEncoding | StreamOptions, suffix?: string) {
    const o = (opts ? opts : options);
    this.suffix = (suffix ? suffix : '\n');
    this.writer = createWriteStream(dir, filename, o);
    this.writer.cork();
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.uncork = this.uncork.bind(this);
    this.end = this.end.bind(this);
  }
  write(data: string): void {
    this.writer.write(data + this.suffix);
  }
  flush(): void {
    this.writer.uncork();
  }
  uncork(): void {
    this.writer.uncork();
  }
  end(): void {
    this.writer.end();
  }
}
export function createWriteStream(dir: string, filename: string, opts?: BufferEncoding | StreamOptions): WriteStream {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (dir.endsWith('/') || dir.endsWith('\\')) {
    return fs.createWriteStream(dir + filename, opts);
  } else {
    return fs.createWriteStream(dir + '/' + filename, opts);
  }
}
const re = /"/g;
const e = '';
const s = 'string';
const n = 'number';
const b = '\"';
export function toDelimiter<T>(obj: T, separator: string, end?: string): string {
  const o: any = obj;
  const keys = Object.keys(o);
  const cols: string[] = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    if (!v) {
      cols.push(e);
    } else {
      if (typeof v === s) {
        if (s.indexOf(',') >= 0) {
          cols.push('"' + v.replace(re, b) + '"');
        } else {
          cols.push(v);
        }
      } else if (v instanceof Date) {
        cols.push(v.toISOString());
      } else if (typeof v === n) {
        cols.push(v.toString());
      } else {
        cols.push('' + v);
      }
    }
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join(separator);
}
export function toDelimiterWithSchema<T>(obj: T, separator: string, attrs: Attributes, end?: string): string {
  const o: any = obj;
  const keys = Object.keys(attrs);
  const cols: string[] = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    if (!v) {
      cols.push(e);
    } else {
      if (attr.getString) {
        const v2 = attr.getString(v);
        cols.push(v2);
      } else {
        if (typeof v === s) {
          if (s.indexOf(separator) >= 0) {
            cols.push('"' + v.replace(re, b) + '"');
          } else {
            cols.push(v);
          }
        } else if (v instanceof Date) {
          cols.push(v.toISOString());
        } else if (typeof v === n) {
          cols.push(v.toString());
        } else {
          cols.push('' + v);
        }
      }
    }
  }
  const ss = cols.join(separator);
  if (end && end.length > 0) {
    return ss + end;
  } else {
    return ss;
  }
}
// tslint:disable-next-line:max-classes-per-file
export class DelimiterFormatter<T> {
  constructor(public separator: string, public attributes: Attributes, end?: string) {
    this.end = (end && end.length > 0 ? end : '\n');
    this.format = this.format.bind(this);
  }
  end: string;
  format(v: T): string {
    return toDelimiterWithSchema<T>(v, this.separator, this.attributes, this.end);
  }
}
export function pad(v: string, l: number, p: string): string {
  if (v.length > l) {
    return v;
  } else {
    const c = l - v.length;
    const a: string[] = [];
    for (let i = 0; i < c; i++) {
      a.push(p);
    }
    return a.join('') + v;
  }
}
export function toFixedLength<T>(obj: T, attrs: Attributes, p: string, end?: string): string {
  const o: any = obj;
  const keys = Object.keys(attrs);
  const cols: string[] = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    let v2 = '';
    if (v) {
      if (attr.getString) {
        v2 = attr.getString(v);
      } else {
        if (typeof v === s) {
          v2 = v;
        } else if (v instanceof Date) {
          v2 = v.toISOString();
        } else if (typeof v === n) {
          v2 = v.toString();
        } else {
          v2 = '' + v;
        }
      }
    }
    const l = (attr.length && attr.length > 0 ? attr.length : 10);
    cols.push(pad(v2, l, p));
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join('');
}
// tslint:disable-next-line:max-classes-per-file
export class FixedLengthFormatter<T> {
  constructor(public attributes: Attributes, p?: string, end?: string) {
    this.end = (end && end.length > 0 ? end : '\n');
    this.pad = (p && p.length > 0 ? p : ' ');
    this.format = this.format.bind(this);
  }
  end: string;
  pad: string;
  format(v: T): string {
    return toFixedLength<T>(v, this.attributes, this.pad, this.end);
  }
}
