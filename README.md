# Madam E-Commerce

This repository contains the skeleton for Madam's e-commerce web application. The project is built with Spring Boot 3.2, Vaadin 24, raw JDBC, PostgreSQL, and H2 for tests.

## What is included
- Maven project skeleton with dependency management
- Package contracts for `app`, `model`, `persistence`, `service`, `integration`, and `ui`
- Foundation classes for connection and transaction management
- Data model POJOs and exception contracts
- SQL schema and seed data templates
- Protocol documents for the team

## Local setup
1. Install Java 17, Maven, PostgreSQL, Git, and VS Code.
2. Create a PostgreSQL database named `ecommerce`.
3. Update `src/main/resources/application.properties` with the correct PostgreSQL credentials.
4. Run `mvn test` to validate the project compiles.

## Notes
- The project currently contains foundation stubs and protocol documents only.
- Business logic, UI implementation, and integration adapters are intentionally left as skeletons.
