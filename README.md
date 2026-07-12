# io-one

> A lightweight, schema-driven I/O library for Node.js and TypeScript, designed for enterprise batch processing, import/export applications, and structured file generation.

`io-one` provides a simple and practical API for reading files, writing files, formatting objects into CSV, TSV, delimiter-separated, and fixed-length records, along with a carefully selected set of workflow utilities that eliminate repetitive code found in real production projects.

Unlike general-purpose utility libraries, `io-one` intentionally contains only the utilities that are frequently required when building file processing applications.

### Examples:
- [postgres-export-sample](https://github.com/typescript-sample/postgres-export-sample): export data from Postgres to CSV.
- [mssql-export-sample](https://github.com/typescript-sample/mssql-export-sample): export data from MS SQL to CSV.
- [oracle-export-sample](https://github.com/typescript-sample/oracle-export-sample): export data from Oracle to CSV.
- [mysql-export-sample](https://github.com/typescript-sample/mysql-export-sample): export data from MySql to CSV.

---

## Features

- 📄 CSV, TSV and custom delimiter formatting
- 📋 Fixed-length record formatting
- 📖 Async line-by-line file reader
- ✍️ File and log writers
- 📁 Automatic directory creation
- 🏷 Schema-driven serialization
- 🧩 Custom field formatting
- 📅 Batch filename helpers
- ⚡ Zero external runtime dependencies

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

# Design Philosophy

Most production applications eventually create a shared `common/utils` folder containing utilities such as:

- file name generation
- log file naming
- directory creation
- CSV escaping
- date formatting

These utilities are rewritten in nearly every project.

`io-one` moves only the most frequently used workflow utilities into the library itself, allowing applications to stay smaller while avoiding the "everything is a utility" anti-pattern.

The goal is **not** to become another utility library.

The goal is to eliminate repetitive infrastructure code that naturally belongs to file processing applications.

---

# File Reader

Read a file line by line using async iteration.

```ts
import { createReader } from "io-one"

const reader = await createReader("customers.csv")

for await (const line of reader) {
    console.log(line)
}
```

---

# File Writer

```ts
import { createWriteStream, FileWriter } from "io-one"

const stream = createWriteStream("./output", "export.csv")

const writer = new FileWriter(stream)

writer.write("Hello")
writer.end()
```

---

# Log Writer

```ts
import { LogWriter } from "io-one"

const log = new LogWriter("application.log", "./logs")

log.write("Application started")
log.write("Export completed")

log.end()
```

---

# Delimiter Formatter

Convert an object into a CSV, TSV or any delimiter-separated format.

```ts
import { DelimiterFormatter, Attributes } from "io-one"

interface User {
    id: number
    username: string
    email: string
}

const attributes: Attributes = {
    id: {},
    username: {},
    email: {}
}

const formatter =
    new DelimiterFormatter<User>(
        ",",
        attributes
    )

const csv = formatter.format({
    id: 1,
    username: "john",
    email: "john@test.com"
})
```

Output

```text
1,john,john@test.com
```

---

# Custom Formatting

Each field can define its own serializer.

```ts
const attributes = {
    createdAt: {
        getString: d => d.toISOString()
    }
}
```

No switch statements.

No custom formatter classes.

Simply customize the fields that need special formatting.

---

# Fixed-Length Formatter

Generate fixed-width records.

```ts
import { FixedLengthFormatter } from "io-one"

const formatter = new FixedLengthFormatter(attributes)

const line = formatter.format(record)
```

Useful for

- banking
- legacy systems
- government integrations
- batch interfaces

---

# CSV Escaping

`io-one` automatically escapes

- delimiters
- quotation marks
- carriage returns
- line feeds

Example

```text
John,"Hello, ""World"""
```

No manual escaping is required.

---

# Workflow Utilities

## Generate Batch File Names

```ts
import { getPrefix, timeToString } from "io-one"

const now = new Date()

const filename = getPrefix("EXPORT_", now) + "_" + timeToString(now) + ".csv"
```

Example

```text
EXPORT_20260716_143010.csv
```

---

## Date Formatting

```ts
dateToString(new Date())
```

Output

```text
20260716
```

With separator

```ts
dateToString(new Date(), "-")
```

Output

```text
2026-07-16
```

---

## Time Formatting

```ts
timeToString(new Date())
```

Output

```text
143010
```

---

## Parse Timestamp from File Name

```ts
const date = getDate("CUSTOMER_20260716143010.csv")
```

---

## Generate Prefix with Date

```ts
const prefix = getPrefix("CUSTOMER_", new Date())
```

Output

```text
CUSTOMER_20260716
```

---

## NameChecker

Useful when scanning directories.

```ts
const checker = new NameChecker("CUSTOMER_", ".csv")

const files = getFiles(fileNames, checker.check)
```

---

## Create Directory

```ts
mkdirSync("./exports")
```

Creates the directory recursively if it does not already exist.

---

# Enterprise Example

```ts
const writer = new FileWriter(createWriteStream("./output", "customers.csv"))

const formatter = new DelimiterFormatter(",", customerAttributes)

for (const customer of customers) {
    writer.write(
        formatter.format(customer)
    )
}

writer.end()
```

---

# Typical Use Cases

- CSV export
- TSV export
- Fixed-length file generation
- ETL
- Batch processing
- Banking integrations
- Legacy system interfaces
- Scheduled jobs
- Import/Export services
- Report generation

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

## Conversion

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
- `addDays()`
- `getDate()`

---

# Why io-one?

Most applications eventually accumulate dozens of helper functions under a shared `common/utils` folder.

`io-one` provides a carefully curated set of workflow utilities that are repeatedly needed when building file-processing applications, reducing duplicated code while keeping the library focused and lightweight.

It is intentionally **small**, **dependency-free**, and **designed for real production workflows**, making it an excellent foundation for enterprise import/export and batch processing systems.

---

## License

MIT
