# site-foundation Specification

## Purpose
Define the observable technical foundation of the institutional website:
how it renders, how it talks to the external AI triage agent, and what
external systems it explicitly does not depend on.

## Requirements

### Requirement: Server-rendered marketing pages
The system SHALL render marketing pages (Hero, Áreas de Atuação, Sobre,
FAQ, Contato) using server-side rendering or static generation, so page
content is present in the initial HTML response without requiring
client-side JavaScript execution.

#### Scenario: Crawler requests a marketing page
- **WHEN** a search engine crawler requests any marketing page
- **THEN** the response SHALL contain fully rendered page content in the
  initial HTML, without depending on JavaScript execution

### Requirement: Chat widget message proxy
The system SHALL expose a single server-side endpoint that forwards chat
widget messages to an externally configured webhook URL
(`N8N_WEBHOOK_URL`). This endpoint SHALL NOT persist conversation state
and SHALL NOT call a language model directly — triage logic is owned
entirely by the external n8n workflow.

#### Scenario: User sends a chat widget message
- **WHEN** a visitor submits a message through the chat widget
- **THEN** the system SHALL forward the message to the URL configured in
  `N8N_WEBHOOK_URL` and relay the webhook's response back to the widget

#### Scenario: Webhook URL not configured
- **WHEN** `N8N_WEBHOOK_URL` is not set in the environment
- **THEN** the proxy endpoint SHALL return an error response rather than
  silently discarding the message or storing it locally

### Requirement: No direct database dependency
The site codebase SHALL NOT include a direct client or connection to a
database or CRM system. Lead data persistence is owned exclusively by the
external n8n workflow and the separate, multi-tenant CRM project.

#### Scenario: Reviewing project dependencies
- **WHEN** the site's dependency manifest is inspected
- **THEN** it SHALL contain no database or CRM client library (e.g. no
  direct Supabase client)

### Requirement: Type-checked build
The system SHALL be written in TypeScript with type checking enforced as
part of the build process.

#### Scenario: Build with a type error
- **WHEN** the project is built and the source contains a type error
- **THEN** the build SHALL fail rather than emit output with the error
  silently ignored
