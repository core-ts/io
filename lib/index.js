"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs = __importStar(require("fs"));
const readline = __importStar(require("readline"));
class resources {
}
exports.resources = resources;
resources.regex = /[^\d](\d{14})\.csv$/g;
function getDate(fileName) {
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
exports.getDate = getDate;
class Delimiter {
  constructor(delimiter, attrs) {
    this.delimiter = delimiter;
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data) {
    return this.transform(data);
  }
  transform(data) {
    const keys = Object.keys(this.attrs);
    let rs = {};
    const list = data.split(this.delimiter);
    const l = Math.min(list.length, keys.length);
    for (let i = 0; i < l; i++) {
      const attr = this.attrs[keys[i]];
      const v = list[i];
      rs = parse(rs, v, keys[i], attr);
    }
    return Promise.resolve(rs);
  }
}
exports.Delimiter = Delimiter;
class DelimiterTransformer extends Delimiter {
}
exports.DelimiterTransformer = DelimiterTransformer;
class DelimiterParser extends Delimiter {
}
exports.DelimiterParser = DelimiterParser;
class CSVParser extends Delimiter {
}
exports.CSVParser = CSVParser;
class FixedLengthTransformer {
  constructor(attrs) {
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  parse(data) {
    return this.transform(data);
  }
  transform(data) {
    const keys = Object.keys(this.attrs);
    let rs = {};
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
exports.FixedLengthTransformer = FixedLengthTransformer;
class FixedLengthParser extends FixedLengthTransformer {
}
exports.FixedLengthParser = FixedLengthParser;
function parse(rs, v, key, attr) {
  if (attr.default !== undefined && v.length === 0) {
    rs[key] = attr.default;
    return rs;
  }
  switch (attr.type) {
    case 'number':
    case 'integer':
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
      }
      else if (v.length > 0) {
        rs[key] = false;
      }
      break;
    default:
      rs[key] = v;
      break;
  }
  return rs;
}
exports.parse = parse;
function buildStrings(files) {
  const res = [];
  for (const file of files) {
    res.push(file.toString());
  }
  return res;
}
exports.buildStrings = buildStrings;
function getFiles(files, check) {
  const res = [];
  for (const file of files) {
    const v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
exports.getFiles = getFiles;
class NameChecker {
  constructor(prefix, suffix) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.check = this.check.bind(this);
  }
  check(name) {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  }
}
exports.NameChecker = NameChecker;
function getPrefix(v, date, offset, separator) {
  if (offset !== undefined) {
    const d = addDays(date, offset);
    return v + dateToString(d, separator);
  }
  else {
    return v + dateToString(date, separator);
  }
}
exports.getPrefix = getPrefix;
function dateToString(date, separator) {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();
  if (dt < 10) {
    dt = '0' + dt.toString();
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (separator !== undefined) {
    return '' + year + separator + month + separator + dt;
  }
  else {
    return '' + year + month + dt;
  }
}
exports.dateToString = dateToString;
function timeToString(date, separator) {
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
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
  }
  else {
    return '' + hh + mm + ss;
  }
}
exports.timeToString = timeToString;
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.addDays = addDays;
async function createReader(filename, opts) {
  const c = (opts !== undefined ? opts : 'utf-8');
  const stream = fs.createReadStream(filename, c);
  await Promise.all([events_1.once(stream, 'open')]);
  const read = readline.createInterface({ input: stream, crlfDelay: Infinity });
  return read;
}
exports.createReader = createReader;
exports.options = { flags: 'a', encoding: 'utf-8' };
class FileWriter {
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
exports.FileWriter = FileWriter;
class LogWriter {
  constructor(filename, dir, opts, suffix) {
    const o = (opts ? opts : exports.options);
    this.suffix = (suffix ? suffix : '\n');
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
exports.LogWriter = LogWriter;
function createWriteStream(dir, filename, opts) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (dir.endsWith('/') || dir.endsWith('\\')) {
    return fs.createWriteStream(dir + filename, opts);
  }
  else {
    return fs.createWriteStream(dir + '/' + filename, opts);
  }
}
exports.createWriteStream = createWriteStream;
const re = /"/g;
const e = '';
const s = 'string';
const n = 'number';
const b = '\"';
function toDelimiter(obj, separator, end) {
  const o = obj;
  const keys = Object.keys(o);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    if (!v) {
      cols.push(e);
    }
    else {
      if (typeof v === s) {
        if (s.indexOf(',') >= 0) {
          cols.push('"' + v.replace(re, b) + '"');
        }
        else {
          cols.push(v);
        }
      }
      else if (v instanceof Date) {
        cols.push(v.toISOString());
      }
      else if (typeof v === n) {
        cols.push(v.toString());
      }
      else {
        cols.push('' + v);
      }
    }
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join(separator);
}
exports.toDelimiter = toDelimiter;
function toDelimiterWithSchema(obj, separator, attrs, end) {
  const o = obj;
  const keys = Object.keys(attrs);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    if (!v) {
      cols.push(e);
    }
    else {
      if (attr.getString) {
        const v2 = attr.getString(v);
        cols.push(v2);
      }
      else {
        if (typeof v === s) {
          if (s.indexOf(separator) >= 0) {
            cols.push('"' + v.replace(re, b) + '"');
          }
          else {
            cols.push(v);
          }
        }
        else if (v instanceof Date) {
          cols.push(v.toISOString());
        }
        else if (typeof v === n) {
          cols.push(v.toString());
        }
        else {
          cols.push('' + v);
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
exports.toDelimiterWithSchema = toDelimiterWithSchema;
class DelimiterFormatter {
  constructor(separator, attributes, end) {
    this.separator = separator;
    this.attributes = attributes;
    this.end = (end && end.length > 0 ? end : '\n');
    this.format = this.format.bind(this);
  }
  format(v) {
    return toDelimiterWithSchema(v, this.separator, this.attributes, this.end);
  }
}
exports.DelimiterFormatter = DelimiterFormatter;
function pad(v, l, p) {
  if (v.length > l) {
    return v;
  }
  else {
    const c = l - v.length;
    const a = [];
    for (let i = 0; i < c; i++) {
      a.push(p);
    }
    return a.join('') + v;
  }
}
exports.pad = pad;
function toFixedLength(obj, attrs, p, end) {
  const o = obj;
  const keys = Object.keys(attrs);
  const cols = [];
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    const v = o[name];
    const attr = attrs[name];
    let v2 = '';
    if (v) {
      if (attr.getString) {
        v2 = attr.getString(v);
      }
      else {
        if (typeof v === s) {
          v2 = v;
        }
        else if (v instanceof Date) {
          v2 = v.toISOString();
        }
        else if (typeof v === n) {
          v2 = v.toString();
        }
        else {
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
exports.toFixedLength = toFixedLength;
class FixedLengthFormatter {
  constructor(attributes, p, end) {
    this.attributes = attributes;
    this.end = (end && end.length > 0 ? end : '\n');
    this.pad = (p && p.length > 0 ? p : ' ');
    this.format = this.format.bind(this);
  }
  format(v) {
    return toFixedLength(v, this.attributes, this.pad, this.end);
  }
}
exports.FixedLengthFormatter = FixedLengthFormatter;
