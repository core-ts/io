"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var fs = require("fs");
var readline = require("readline");
var resources = (function () {
  function resources() {
  }
  resources.regex = /[^\d](\d{14})\.csv$/g;
  resources.escape = '""';
  return resources;
}());
exports.resources = resources;
function getDate(fileName) {
  var r = new RegExp(resources.regex);
  var nm = r.exec(fileName);
  if (!nm || nm.length < 2) {
    return undefined;
  }
  var v = nm[1];
  var ft = v.slice(0, 4) + "-" + v.slice(4, 6) + "-" + v.slice(6, 8) + "T" + v.slice(8, 10) + ":" + v.slice(10, 12) + ":" + v.slice(12, 14);
  var d = new Date(ft);
  var num = d.getTime();
  if (!num || isNaN(num)) {
    return undefined;
  }
  return d;
}
exports.getDate = getDate;
var Delimiter = (function () {
  function Delimiter(delimiter, attrs) {
    this.delimiter = delimiter;
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  Delimiter.prototype.parse = function (data) {
    return this.transform(data);
  };
  Delimiter.prototype.transform = function (data) {
    var keys = Object.keys(this.attrs);
    var rs = {};
    var list = data.split(this.delimiter);
    var l = Math.min(list.length, keys.length);
    for (var i = 0; i < l; i++) {
      var attr = this.attrs[keys[i]];
      var v = list[i];
      rs = parse(rs, v, keys[i], attr);
    }
    return Promise.resolve(rs);
  };
  return Delimiter;
}());
exports.Delimiter = Delimiter;
var DelimiterTransformer = (function (_super) {
  __extends(DelimiterTransformer, _super);
  function DelimiterTransformer() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return DelimiterTransformer;
}(Delimiter));
exports.DelimiterTransformer = DelimiterTransformer;
var DelimiterParser = (function (_super) {
  __extends(DelimiterParser, _super);
  function DelimiterParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return DelimiterParser;
}(Delimiter));
exports.DelimiterParser = DelimiterParser;
var CSVParser = (function (_super) {
  __extends(CSVParser, _super);
  function CSVParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return CSVParser;
}(Delimiter));
exports.CSVParser = CSVParser;
var FixedLengthTransformer = (function () {
  function FixedLengthTransformer(attrs) {
    this.attrs = attrs;
    this.transform = this.transform.bind(this);
    this.parse = this.parse.bind(this);
  }
  FixedLengthTransformer.prototype.parse = function (data) {
    return this.transform(data);
  };
  FixedLengthTransformer.prototype.transform = function (data) {
    var keys = Object.keys(this.attrs);
    var rs = {};
    var i = 0;
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      var attr = this.attrs[key];
      var len = attr.length ? attr.length : 10;
      var v = data.substring(i, i + len);
      rs = parse(rs, v.trim(), key, attr);
      i = i + len;
    }
    return Promise.resolve(rs);
  };
  return FixedLengthTransformer;
}());
exports.FixedLengthTransformer = FixedLengthTransformer;
var FixedLengthParser = (function (_super) {
  __extends(FixedLengthParser, _super);
  function FixedLengthParser() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return FixedLengthParser;
}(FixedLengthTransformer));
exports.FixedLengthParser = FixedLengthParser;
function parse(rs, v, key, attr) {
  if (attr.default !== undefined && v.length === 0) {
    rs[key] = attr.default;
    return rs;
  }
  switch (attr.type) {
    case 'number':
    case 'integer':
      var parsed = parseInt(v);
      if (!isNaN(parsed) || !Number(parsed)) {
        rs[key] = parsed;
      }
      break;
    case 'datetime':
    case 'date':
      var d = new Date(v);
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
  var res = [];
  for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    res.push(file.toString());
  }
  return res;
}
exports.buildStrings = buildStrings;
function getFiles(files, check) {
  var res = [];
  for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
    var file = files_2[_i];
    var v = check(file);
    if (v === true) {
      res.push(file);
    }
  }
  return res;
}
exports.getFiles = getFiles;
var NameChecker = (function () {
  function NameChecker(prefix, suffix) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.check = this.check.bind(this);
  }
  NameChecker.prototype.check = function (name) {
    if (name.startsWith(this.prefix) && name.endsWith(this.suffix)) {
      return true;
    }
    return false;
  };
  return NameChecker;
}());
exports.NameChecker = NameChecker;
function getPrefix(v, date, offset, separator) {
  if (offset !== undefined) {
    var d = addDays(date, offset);
    return v + dateToString(d, separator);
  }
  else {
    return v + dateToString(date, separator);
  }
}
exports.getPrefix = getPrefix;
function dateToString(date, separator) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dt = date.getDate();
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
  var hh = date.getHours();
  var mm = date.getMinutes();
  var ss = date.getSeconds();
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
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
exports.addDays = addDays;
function mkdirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
exports.mkdirSync = mkdirSync;
function createReader(filename, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var c, stream, read;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          c = (opts !== undefined ? opts : 'utf-8');
          stream = fs.createReadStream(filename, c);
          return [4, Promise.all([events_1.once(stream, 'open')])];
        case 1:
          _a.sent();
          read = readline.createInterface({ input: stream, crlfDelay: Infinity });
          return [2, read];
      }
    });
  });
}
exports.createReader = createReader;
exports.options = { flags: 'a', encoding: 'utf-8' };
var FileWriter = (function () {
  function FileWriter(writer) {
    this.writer = writer;
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.end = this.end.bind(this);
  }
  FileWriter.prototype.write = function (chunk) {
    var b1 = this.writer.write(chunk);
    return b1;
  };
  FileWriter.prototype.flush = function (cb) {
    this.writer.end(cb);
  };
  FileWriter.prototype.end = function (cb) {
    this.writer.end(cb);
  };
  return FileWriter;
}());
exports.FileWriter = FileWriter;
var LogWriter = (function () {
  function LogWriter(filename, dir, opts, suffix) {
    var o = (opts ? opts : exports.options);
    this.suffix = (suffix ? suffix : '\n');
    this.writer = createWriteStream(dir, filename, o);
    this.writer.cork();
    this.write = this.write.bind(this);
    this.flush = this.flush.bind(this);
    this.uncork = this.uncork.bind(this);
    this.end = this.end.bind(this);
  }
  LogWriter.prototype.write = function (data) {
    this.writer.write(data + this.suffix);
  };
  LogWriter.prototype.flush = function () {
    this.writer.uncork();
  };
  LogWriter.prototype.uncork = function () {
    this.writer.uncork();
  };
  LogWriter.prototype.end = function () {
    this.writer.end();
  };
  return LogWriter;
}());
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
var re = /"/g;
var e = '';
var s = 'string';
var n = 'number';
function toDelimiter(obj, separator, end) {
  var o = obj;
  var keys = Object.keys(o);
  var cols = [];
  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var v = o[name];
    if (!v) {
      cols.push(e);
    }
    else {
      if (typeof v === s) {
        if (s.indexOf(',') >= 0) {
          cols.push('"' + v.replace(re, resources.escape) + '"');
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
  var o = obj;
  var keys = Object.keys(attrs);
  var cols = [];
  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var v = o[name];
    var attr = attrs[name];
    if (!v) {
      cols.push(e);
    }
    else {
      if (attr.getString) {
        var v2 = attr.getString(v);
        cols.push(v2);
      }
      else {
        if (typeof v === s) {
          if (s.indexOf(separator) >= 0) {
            cols.push('"' + v.replace(re, resources.escape) + '"');
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
  var ss = cols.join(separator);
  if (end && end.length > 0) {
    return ss + end;
  }
  else {
    return ss;
  }
}
exports.toDelimiterWithSchema = toDelimiterWithSchema;
var DelimiterFormatter = (function () {
  function DelimiterFormatter(separator, attributes, end) {
    this.separator = separator;
    this.attributes = attributes;
    this.end = (end && end.length > 0 ? end : '\n');
    this.format = this.format.bind(this);
  }
  DelimiterFormatter.prototype.format = function (v) {
    return toDelimiterWithSchema(v, this.separator, this.attributes, this.end);
  };
  return DelimiterFormatter;
}());
exports.DelimiterFormatter = DelimiterFormatter;
function pad(v, l, p) {
  if (v.length > l) {
    return v;
  }
  else {
    var c = l - v.length;
    var a = [];
    for (var i = 0; i < c; i++) {
      a.push(p);
    }
    return a.join('') + v;
  }
}
exports.pad = pad;
function toFixedLength(obj, attrs, p, end) {
  var o = obj;
  var keys = Object.keys(attrs);
  var cols = [];
  for (var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var v = o[name];
    var attr = attrs[name];
    var v2 = '';
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
    var l = (attr.length && attr.length > 0 ? attr.length : 10);
    cols.push(pad(v2, l, p));
  }
  if (end && end.length > 0) {
    cols.push(end);
  }
  return cols.join('');
}
exports.toFixedLength = toFixedLength;
var FixedLengthFormatter = (function () {
  function FixedLengthFormatter(attributes, p, end) {
    this.attributes = attributes;
    this.end = (end && end.length > 0 ? end : '\n');
    this.pad = (p && p.length > 0 ? p : ' ');
    this.format = this.format.bind(this);
  }
  FixedLengthFormatter.prototype.format = function (v) {
    return toFixedLength(v, this.attributes, this.pad, this.end);
  };
  return FixedLengthFormatter;
}());
exports.FixedLengthFormatter = FixedLengthFormatter;
