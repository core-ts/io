# io-one

> A lightweight TypeScript library for building enterprise import/export and batch-processing applications.

`io-one` provides the infrastructure required to generate structured files, including CSV, delimiter-separated, and fixed-length records, together with a carefully selected set of workflow utilities that eliminate repetitive code found in real production projects.

Unlike general-purpose utility libraries, **io-one** intentionally includes only the helper functions that are repeatedly needed when working with files, exports, logs, and batch jobs.

### Examples:
- [postgres-export-sample](https://github.com/typescript-sample/postgres-export-sample): export data from Postgres to CSV.
- [mssql-export-sample](https://github.com/typescript-sample/mssql-export-sample): export data from MS SQL to CSV.
- [oracle-export-sample](https://github.com/typescript-sample/oracle-export-sample): export data from Oracle to CSV.
- [mysql-export-sample](https://github.com/typescript-sample/mysql-export-sample): export data from MySql to CSV.

---

# Installation

```bash
npm install io-one
```

or

```bash
yarn add io-one
```

---

# Why io-one?

In most production projects, developers eventually create a structure like this:

```text
src
├── modules
│   ├── customer
│   ├── product
│   └── order
└── common
    ├── file.ts
    ├── date.ts
    ├── export.ts
    ├── log.ts
    └── utils.ts
```

After several projects, these helper functions become almost identical.

Typical examples include:

- Creating timestamped filenames
- Creating log filenames
- Formatting dates
- Creating directories
- Scanning import/export directories
- Escaping CSV fields
- Reading and writing text files

Instead of rewriting these helpers in every application, **io-one** provides the ones that naturally belong to file-processing workflows.

The goal is **not** to become another utility library.

The goal is to eliminate duplicated infrastructure code while keeping the library small and focused.

---

# Design Philosophy

`io-one` follows three simple principles.

## 1. Keep the library simple

Only include features that are commonly needed in production projects.

No unnecessary abstractions.

No framework.

No hidden magic.

---

## 2. Eliminate duplicated application code

Instead of every project implementing:

```ts
function createExportFilename(...)
function createLogFilename(...)
function createDirectory(...)
function checkFileName(...)
```

these common workflow utilities are already available.

Examples include:

- `getPrefix()`
- `dateToString()`
- `timeToString()`
- `NameChecker`
- `mkdirSync()`

---

## 3. Focus on output

`io-one` is responsible for converting objects into structured files.

It intentionally does **not** perform:

- SQL queries
- Database streaming
- Database access
- ORM functionality

Those responsibilities belong to database-specific libraries.

---

# Position in the Ecosystem

```text
          SQL Server
          PostgreSQL
            Oracle
            SQLite
             MySQL
               │
               ▼
        sql-core adapters
               │
               ▼
        Application Objects
               │
               ▼
             io-one
               │
      ┌────────┴────────┐
      ▼                 ▼
 Delimiter         Fixed-Length
 Formatter          Formatter
      │                 │
      └────────┬────────┘
               ▼
             Files
```

`io-one` is the **output layer** of the ecosystem.

Database streaming belongs to provider libraries (such as `mysql2-core`) because every database driver has its own streaming implementation.

---

# Features

- CSV formatter
- TSV formatter
- Custom delimiter formatter
- Fixed-length formatter
- Async file reader
- File writer
- Log writer
- Automatic directory creation
- Schema-driven serialization
- Custom field formatting
- Batch filename utilities
- File scanning utilities
- Zero runtime dependencies

---

# Read Files

```ts
import { createReader } from "io-one"

const reader = await createReader("customers.csv")

for await (const line of reader) {
    console.log(line)
}
```

---

# Write Files

```ts
import { createWriteStream, FileWriter } from "io-one"

const stream = createWriteStream("./output", "customers.csv")

const writer = new FileWriter(stream)

writer.write("Hello")
writer.end()
```

---

# CSV Export

```ts
import { DelimiterFormatter } from "io-one"

const formatter = new DelimiterFormatter(",", customerAttributes)

writer.write(formatter.format(customer))
```

Generated output

```text
1,john,john@example.com
```

---

# Fixed-Length Export

```ts
import { FixedLengthFormatter } from "io-one"

const formatter = new FixedLengthFormatter(customerAttributes)

writer.write(formatter.format(customer))
```

Suitable for:

- Banking
- Government systems
- Legacy integrations
- Batch interfaces

---

# Schema-Driven Formatting

```ts
const attributes = {
    createdAt: {
        getString: value =>
            value.toISOString()
    }
}
```

Each field can define its own formatter.

No switch statements.

No custom formatter classes.

---

# Generate Batch File Names

```ts
import { getPrefix, timeToString } from "io-one"

const now = new Date()

const filename = getPrefix("CUSTOMER_", now) + "_" + timeToString(now) + ".csv"
```

Example

```text
CUSTOMER_20260716_143010.csv
```

---

# Generate Log File Names

```ts
const logFile = getPrefix("EXPORT_", new Date()) + "_" + timeToString(new Date()) + ".log"
```

Output

```text
EXPORT_20260716_143010.log
```

---

# Scan Import Directory

```ts
const checker = new NameChecker("CUSTOMER_", ".csv")

const files = getFiles(fileNames, checker.check)
```

Useful when processing incoming batch files.

---

# Create Directory

```ts
mkdirSync("./exports")
```

Creates the directory recursively if it does not already exist.

---

# Typical Workflow

```text
Application Objects
         │
         ▼
 DelimiterFormatter
         │
         ▼
    CSV Record
         │
         ▼
    FileWriter
         │
         ▼
   customers.csv
```

---

# Typical Use Cases

- CSV export
- TSV export
- Fixed-length file generation
- Batch processing
- ETL
- Report generation
- Scheduled jobs
- Legacy system integration
- Banking interfaces
- Import/Export applications

---

# API Overview

## Readers

- `createReader()`

## Writers

- `createWriteStream()`
- `FileWriter`
- `LogWriter`

## Formatters

- `DelimiterFormatter`
- `FixedLengthFormatter`

## Serialization

- `toDelimiter()`
- `toDelimiterWithSchema()`
- `toFixedLength()`

## File Utilities

- `mkdirSync()`
- `getFiles()`
- `NameChecker`

## Date Utilities

- `dateToString()`
- `timeToString()`
- `getPrefix()`
- `getDate()`
- `addDays()`

---

# Why io-one?

`io-one` is designed for developers building real production applications.

Instead of forcing every project to create its own `common/utils` folder, it provides a carefully selected set of workflow utilities that are repeatedly required when processing files.

The library remains intentionally **small**, **dependency-free**, and **focused on structured file generation**, making it an excellent foundation for enterprise import/export and batch-processing systems.

---

# License

MIT
