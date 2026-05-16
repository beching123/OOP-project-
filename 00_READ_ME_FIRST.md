# 00 – READ ME FIRST: Your Role, Your Tools, Your Night

You are the **Lead Developer** for Madam’s E‑Commerce web application. You must set up the entire project skeleton, the Git repository, the development environment, and the absolute standards that your team will follow. This document covers the **what and why** before you write a single line of code.

## 1. Your Responsibility Tonight
- Install and configure all tools.
- Create the Maven project with the exact directory structure.
- Configure the database (PostgreSQL) and test database (H2).
- Write the foundation classes (`.app`) so that every other layer has a stable base.
- Write the model classes (`.model`) because every other layer uses them.
- Set up the Git repository with branching rules.
- Produce the protocol documents (the rest of this set) for your team.

You are **not** coding the business logic, the UI, or the integrations tonight. You are building the **skeleton and the rulebook**.

## 2. Tools You Must Install Tonight
| Tool | Purpose | Verification |
|------|---------|--------------|
| **Java 17 JDK** (Eclipse Temurin) | Compile and run | `java -version` shows 17 |
| **Apache Maven** | Build, dependency management | `mvn -version` |
| **PostgreSQL** | Production database | `psql -U postgres` works |
| **Git** | Version control | `git --version` |
| **VS Code** | IDE | Extensions: Extension Pack for Java, Spring Boot Extension Pack, Maven for Java, GitLens |

### How to Install in One Go (Windows / macOS / Linux)
- **Windows:** Use `winget` or download manually. For PostgreSQL, note the superuser password.
- **macOS:** `brew install openjdk@17 maven git` and `brew install --cask postgres-unofficial` or use Postgres.app.
- **Linux (Ubuntu):** `sudo apt install openjdk-17-jdk maven git postgresql`.

After installation, start PostgreSQL service and create a database named `ecommerce`.

## 3. Mental Model: How This App Works
A customer or staff member opens a browser. Every click sends a request to a **single Java server** that runs **Vaadin**. Vaadin builds the entire UI in Java (no HTML files written by hand). When a button is clicked, an event fires in your Java code. That code calls a **service** class. The service enforces permissions, starts a database **transaction**, calls **repository** objects to save or load data, and then commits. External stuff like printing a receipt or sending an email happens **after** the transaction, in background threads, so the browser never freezes.

## 4. The Non‑Negotiables for Your Team
- No one writes `DriverManager.getConnection()` – only `DbConnection.getConnection()`.
- All write database operations run inside `TransactionManager`.
- Every table that could have simultaneous access has a `version` column, and updates check it.
- All passwords are hashed with BCrypt.
- Every state change is audited (who did what, when).
- Tests must reach at least 70% coverage per package.
- Git branching is strictly `feature/package-name` → `develop` → `main`.

## 5. What You Will Do After Reading All Documents
1. Create the Spring Boot project via [start.spring.io](https://start.spring.io) with the dependencies: **Spring Web**, **Spring Security**, **Spring Boot Actuator**, **JDBC API**, **PostgreSQL Driver**, **H2 Database**, **Vaadin**.
2. Download, extract, open in VS Code.
3. Recreate the exact directory tree (see 01_PROJECT_STRUCTURE.md).
4. Write `application.properties` and the SQL schema files.
5. Write the `.app` foundation classes (no logic, just the precise signatures and the ThreadLocal/transaction mechanics).
6. Write every model class with the exact fields listed.
7. Initialize Git, push to GitHub, create `develop`, protect `main`.

After tonight, your team will pull the project, take their assigned layer protocol, and implement.
