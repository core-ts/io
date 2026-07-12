import { once } from "events"
import * as fs from "fs"
import { WriteStream } from "fs"
import * as promises from "node:fs/promises"
import path from "node:path"
import * as readline from "readline"

// tslint:disable-next-line:class-name
export class resources {
  static regex = /[^\d](\d{14})\.csv$/
  static escape = '""'
}
export function getDate(fileName: string): Date | undefined {
  const r = new RegExp(resources.regex)
  const nm = r.exec(fileName)
  if (!nm || nm.length < 2) {
    return undefined
  }
  const v = nm[1]
  const ft = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}`
  const d = new Date(ft)
  const num = d.getTime()
  if (!num || isNaN(num)) {
    return undefined
  }
  return d
}

export interface SimpleMap {
  [key: string]: string | number | boolean | Date
}
export type DataType =
  | "ObjectId"
  | "date"
  | "datetime"
  | "time"
  | "boolean"
  | "number"
  | "integer"
  | "string"
  | "text"
  | "object"
  | "array"
  | "binary"
  | "primitives"
  | "booleans"
  | "numbers"
  | "integers"
  | "strings"
  | "dates"
  | "datetimes"
  | "times"

export interface BaseAttribute {
  type?: DataType
  default?: string | number | Date | boolean
  getString?: (v: any) => string
}
export interface Attribute extends BaseAttribute {
  length?: number
}
export interface FixedLengthAttribute extends BaseAttribute {
  length: number
}
export interface Attributes {
  [key: string]: Attribute
}
export interface FixedLengthAttributes {
  [key: string]: FixedLengthAttribute
}
export interface Parser<T> {
  parse: (data: string) => Promise<T>
}
export interface Transformer<T> {
  transform: (data: string) => Promise<T>
}

// tslint:disable-next-line:ban-types
export function buildStrings(files: string[]): string[] {
  const res: string[] = []
  for (const file of files) {
    res.push(file.toString())
  }
  return res
}
export function getFiles(files: string[], check: (s: string) => boolean): string[] {
  const res: string[] = []
  for (const file of files) {
    const v = check(file)
    if (v === true) {
      res.push(file)
    }
  }
  return res
}
// tslint:disable-next-line:max-classes-per-file
export class NameChecker {
  constructor(
    private prefix: string,
    private suffix: string,
  ) {
    this.check = this.check.bind(this)
  }
  check(name: string): boolean {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true
    }
    return false
  }
}
export function getPrefix(v: string, date: Date, offset?: number, separator?: string): string {
  if (offset !== undefined) {
    const d = addDays(date, offset)
    return v + dateToString(d, separator)
  } else {
    return v + dateToString(date, separator)
  }
}
export function dateToString(date: Date, separator?: string): string {
  const year = date.getFullYear()
  let month: number | string = date.getMonth() + 1
  let dt: number | string = date.getDate()

  if (dt < 10) {
    dt = "0" + dt.toString()
  }
  if (month < 10) {
    month = "0" + month
  }
  if (separator !== undefined) {
    return "" + year + separator + month + separator + dt
  } else {
    return "" + year + month + dt
  }
}
export function timeToString(date: Date, separator?: string): string {
  let hh: number | string = date.getHours()
  let mm: number | string = date.getMinutes()
  let ss: number | string = date.getSeconds()
  if (hh < 10) {
    hh = "0" + hh.toString()
  }
  if (ss < 10) {
    ss = "0" + ss.toString()
  }
  if (mm < 10) {
    mm = "0" + mm
  }
  if (separator !== undefined) {
    return "" + hh + separator + mm + separator + ss
  } else {
    return "" + hh + mm + ss
  }
}
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
export function mkdirSync(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
export async function createReader(filename: string, opts?: BufferEncoding): Promise<AsyncIterable<string>> {
  const c: BufferEncoding = opts !== undefined ? opts : "utf-8"
  const stream = fs.createReadStream(filename, c)
  await Promise.all([once(stream, "open")])
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity })
  return read
}
export interface StreamOptions {
  flags?: string | undefined
  encoding?: BufferEncoding | undefined
  fd?: number | promises.FileHandle | undefined
  mode?: number | undefined
  autoClose?: boolean | undefined
  /**
   * @default false
   */
  emitClose?: boolean | undefined
  start?: number | undefined
  highWaterMark?: number | undefined
}
export const options: StreamOptions = { flags: "a", encoding: "utf-8" }
// tslint:disable-next-line:max-classes-per-file
export class FileWriter {
  // suffix: string;
  constructor(protected writer: WriteStream) {
    // this.suffix = (suffix ? suffix : '\n');
    this.write = this.write.bind(this)
    this.flush = this.flush.bind(this)
    this.end = this.end.bind(this)
  }
  write(chunk: any): boolean {
    const b1 = this.writer.write(chunk)
    // const b2 = this.writer.write(this.suffix);
    return b1
  }
  flush(cb?: () => void): void {
    this.writer.end(cb)
  }
  end(cb?: () => void): void {
    this.writer.end(cb)
  }
}
// tslint:disable-next-line:max-classes-per-file
export class LogWriter {
  private writer: WriteStream
  suffix: string
  constructor(filename: string, dir: string, opts?: BufferEncoding | StreamOptions, suffix?: string) {
    const o = opts ? opts : options
    this.suffix = suffix ? suffix : "\n"
    this.writer = createWriteStream(dir, filename, o)
    this.writer.cork()
    this.write = this.write.bind(this)
    this.flush = this.flush.bind(this)
    this.uncork = this.uncork.bind(this)
    this.end = this.end.bind(this)
  }
  write(data: string): void {
    this.writer.write(data + this.suffix)
  }
  flush(): void {
    this.writer.uncork()
  }
  uncork(): void {
    this.writer.uncork()
  }
  end(): void {
    this.writer.end()
  }
}
export function createWriteStream(dir: string, filename: string, opts?: BufferEncoding | StreamOptions): WriteStream {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (dir.endsWith("/") || dir.endsWith("\\")) {
    return fs.createWriteStream(dir + filename, opts)
  } else {
    return fs.createWriteStream(path.join(dir, filename), opts)
  }
}
const re = /"/g
const e = ""
const s = "string"
const n = "number"
export function toDelimiter<T>(obj: T, separator: string, end?: string): string {
  const o: any = obj
  const keys = Object.keys(o)
  const cols: string[] = []
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const v = o[name]
    if (v == null) {
      cols.push(e)
    } else {
      if (typeof v === s) {
        cols.push(escapeDelimiter(v, separator))
      } else if (v instanceof Date) {
        cols.push(v.toISOString())
      } else if (typeof v === n) {
        cols.push(v.toString())
      } else {
        cols.push("" + v)
      }
    }
  }
  if (end && end.length > 0) {
    cols.push(end)
  }
  return cols.join(separator)
}
export function toDelimiterWithSchema<T>(obj: T, separator: string, attrs: Attributes, end?: string): string {
  const o: any = obj
  const keys = Object.keys(attrs)
  const cols: string[] = []
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const v = o[name]
    const attr = attrs[name]
    if (v == null) {
      cols.push(e)
    } else {
      if (attr.getString) {
        const v2 = attr.getString(v)
        cols.push(v2)
      } else {
        if (typeof v === s) {
          cols.push(escapeDelimiter(v, separator))
        } else if (v instanceof Date) {
          cols.push(v.toISOString())
        } else if (typeof v === n) {
          cols.push(v.toString())
        } else {
          cols.push("" + v)
        }
      }
    }
  }
  const ss = cols.join(separator)
  if (end && end.length > 0) {
    return ss + end
  } else {
    return ss
  }
}
export function escapeDelimiter(v: string, separator: string): string {
  const needsQuote = v.includes(separator) || v.includes('"') || v.includes("\r") || v.includes("\n")

  if (!needsQuote) return v

  return `"${v.replace(/"/g, '""')}"`
}
// tslint:disable-next-line:max-classes-per-file
export class DelimiterFormatter<T> {
  constructor(
    public separator: string,
    public attributes: Attributes,
    end?: string,
  ) {
    this.end = end && end.length > 0 ? end : "\n"
    this.format = this.format.bind(this)
  }
  end: string
  format(v: T): string {
    return toDelimiterWithSchema<T>(v, this.separator, this.attributes, this.end)
  }
}
export function pad(v: string, l: number, p: string): string {
  if (v.length > l) {
    return v.substring(0, l)
  } else {
    const c = l - v.length
    const a: string[] = []
    for (let i = 0; i < c; i++) {
      a.push(p)
    }
    return a.join("") + v
  }
}
export function toFixedLength<T>(obj: T, attrs: FixedLengthAttributes, p: string, end?: string): string {
  const o: any = obj
  const keys = Object.keys(attrs)
  const cols: string[] = []
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i]
    const v = o[name]
    const attr = attrs[name]
    let v2 = ""
    if (v != null) {
      if (attr.getString) {
        v2 = attr.getString(v)
      } else {
        if (typeof v === s) {
          v2 = v
        } else if (v instanceof Date) {
          v2 = v.toISOString()
        } else if (typeof v === n) {
          v2 = v.toString()
        } else {
          v2 = "" + v
        }
      }
    }
    cols.push(pad(v2, attr.length, p))
  }
  if (end && end.length > 0) {
    cols.push(end)
  }
  return cols.join("")
}
// tslint:disable-next-line:max-classes-per-file
export class FixedLengthFormatter<T> {
  constructor(
    public attributes: FixedLengthAttributes,
    p?: string,
    end?: string,
  ) {
    this.end = end && end.length > 0 ? end : "\n"
    this.pad = p && p.length > 0 ? p : " "
    this.format = this.format.bind(this)
  }
  end: string
  pad: string
  format(v: T): string {
    return toFixedLength<T>(v, this.attributes, this.pad, this.end)
  }
}
