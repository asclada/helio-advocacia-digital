## Purpose

Define the reusable visual tokens (color, typography, spacing) that every
section and component of the site draws from, so visual decisions are
made once and referenced everywhere instead of repeated per section.

## ADDED Requirements

### Requirement: Centralized color tokens
The system SHALL define the brand color palette (navy + gold, carried over
from the current site) as a set of named, reusable tokens. UI elements
SHALL reference these tokens rather than hardcoded color values.

#### Scenario: New UI element needs the primary brand color
- **WHEN** a component requires the primary brand color
- **THEN** it SHALL reference the shared color token rather than a
  hardcoded hex or RGB value

### Requirement: Centralized typography tokens
The system SHALL define the site's typefaces (Playfair Display, Inter,
Cormorant Garamond, carried over from the current site) as named, reusable
typography tokens, including their intended usage (headings vs. body vs.
accent text).

#### Scenario: New heading is added to a page
- **WHEN** a new heading element is added anywhere on the site
- **THEN** it SHALL use the shared heading typography token rather than a
  one-off font declaration

### Requirement: Consistent spacing scale
The system SHALL define a reusable spacing scale. Layout spacing (margins,
padding, gaps) SHALL be expressed using values from this scale rather than
arbitrary one-off values.

#### Scenario: New section is laid out
- **WHEN** a new page section is built
- **THEN** its spacing SHALL be expressed using the defined spacing scale
  rather than arbitrary pixel/rem values chosen ad hoc
