# export-kit

**Simple, schema-driven data export library for TypeScript.**

`export-kit` helps you transform JavaScript objects into structured text formats such as **CSV** and **fixed-length records**, then write them efficiently to files. It is designed for batch jobs, scheduled exports, banking files, legacy integrations, reporting, and ETL pipelines.

Unlike full ETL frameworks, `export-kit` focuses on one responsibility:

> **Convert objects into export formats with minimal code.**

---

# Features

- CSV export
- Fixed-length record export
- Schema-driven formatting
- Custom field formatting
- File writing utilities
- Streaming support
- Async file reader
- Date and time helpers
- Zero runtime dependencies
- Fully written in TypeScript

---

# Why export-kit?

Many Node.js libraries can write files.

Many libraries can generate CSV.

Few libraries provide a reusable **export framework**.

`export-kit` separates **how data is formatted** from **how data is written**, making export logic reusable across applications.

```text
 Business Object
        │
        ▼
 Export Formatter
        │
        ▼
  Formatted Text
        │
        ▼
   File Writer
        │
        ▼
     Output
```

This separation allows the same business object to be exported into different formats without changing business logic.

---

# Supported Export Formats

## CSV

```text
   User
     │
     ▼
CSVFormatter
     │
     ▼
 CSV Text
```

Supports:

- Configurable separators
- Automatic escaping
- ISO date formatting
- Custom field formatting

---

## Fixed-Length Records

```text
       User
         │
         ▼
FixedLengthFormatter
         │
         ▼
 Fixed-Length Text
```

Supports:

- Configurable field widths
- Automatic padding
- Custom formatting
- Banking and legacy system exports

---

# Architecture

```text
                    Attributes
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
  CSVFormatter                FixedLengthFormatter
         │                               │
         └───────────────┬───────────────┘
                         │
                  Formatted String
                         │
                 Stream File Writer 
                         │
                         ▼
                    Output File
```

The formatter is responsible only for converting objects into text.

The writer is responsible only for writing text.

This separation keeps export logic independent from file I/O.

---

# Schema-Driven Formatting

Instead of manually building CSV strings, define a schema describing how each field should be exported.

```typescript
const attributes = {
  id: {},
  name: {},
  birthday: {},
  salary: {
    getString: value => `$${value}`
  }
}
```

The formatter automatically converts each object according to the schema.

Benefits include:

- Reusable export definitions
- Centralized formatting rules
- Consistent exports
- Easier maintenance

---

# Custom Field Formatting

Each attribute may define its own formatter.

```text
Database Value

      1000
        │
        ▼
   getString()
        │
        ▼
     "$1000"
```

This makes it easy to customize:

- Currency
- Dates
- Enums
- Booleans
- Identifiers

without changing export logic.

---

# CSV Escaping

CSV fields are automatically escaped when necessary.

Supports values containing:

- Separators
- Quotation marks
- Carriage returns
- Newlines

This ensures generated CSV files remain compatible with standard spreadsheet applications.

---

# File Writing

`export-kit` provides lightweight file writing utilities suitable for batch processing.

```text
Formatter
    │
    ▼
FileWriter
    │
    ▼
  Disk
```

For logging scenarios, `LogWriter` provides buffered writing with configurable line endings.

---

# Streaming Support

Large exports can be written incrementally instead of generating the entire file in memory.

```text
  Object
     │
     ▼
 Formatter
     │
     ▼
Write Stream
     │
     ▼
    File
```

This approach is suitable for exporting millions of records while keeping memory usage low.

---

# Utility Functions

The library also includes small helpers commonly used in export jobs:

- Date formatting
- Time formatting
- Filename date extraction
- Date arithmetic
- Directory creation
- Async line reader

These utilities support typical batch-processing workflows without introducing additional dependencies.

---

# Typical Use Cases

- Scheduled data exports
- CSV report generation
- Banking files
- Payroll exports
- Legacy system integration
- ETL pipelines
- Data migration
- Batch processing
- Regulatory reporting
- Enterprise data exchange

---

# Design Principles

`export-kit` is built around a few simple principles:

- Single responsibility
- Schema-driven formatting
- Small, composable APIs
- Reusable export definitions
- Minimal dependencies
- Type-safe interfaces
- Production-ready performance

---

# When to Use export-kit

Choose `export-kit` when you need to:

- Export business objects to CSV
- Generate fixed-length files
- Centralize export rules
- Build reusable export pipelines
- Process large datasets efficiently

If you need a lightweight, focused library for object-to-file export, `export-kit` provides the essential building blocks without requiring a full ETL framework.

# License

MIT
