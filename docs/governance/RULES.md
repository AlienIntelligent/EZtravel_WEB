# EZTRAVEL PROJECT RULES

## RULE 001 — SINGLE SOURCE OF TRUTH

Priority Order:

1. Database Schema
2. CRD_EZtravel
3. SRS_ezTravel
4. Existing Backend Code
5. Existing Frontend Code

If conflict exists:

* Database wins.
* CRD wins over SRS.
* SRS wins over implementation.
* Existing code is never considered business truth.

Never invent business rules not present in Database, CRD, or SRS.

---

## RULE 002 — DATABASE FIRST

Before proposing:

* API
* DTO
* Entity
* Frontend Page
* Workflow
* Business Logic

Always verify:

* Table exists
* Column exists
* Relationship exists

If database does not support the feature:

DO NOT build frontend first.

Create:

1. Gap Analysis
2. Database Change Proposal
3. Backend Change Proposal
4. Frontend Change Proposal

In this exact order.

---

## RULE 003 — FRONTEND IS A CONSUMER

Frontend must never define business rules.

Frontend responsibilities:

* Display data
* Validate UX inputs
* Trigger APIs
* Render permissions

Business rules belong to:

* Database
* Backend

Never create frontend-only workflows.

---

## RULE 004 — CRD COMPLIANCE

Every page must map to at least one:

* Use Case
* Business Flow
* Functional Requirement

from CRD or SRS.

If a page cannot be linked to a requirement:

DO NOT IMPLEMENT.

Mark as:

UNSUPPORTED REQUIREMENT

---

## RULE 005 — FEATURE TRACEABILITY

For every feature:

Must identify:

* Database Tables
* Backend APIs
* DTOs
* Frontend Pages
* User Roles
* Use Cases

Output format:

Feature
→ Database
→ Backend
→ Frontend
→ Permission
→ Acceptance Criteria

---

## RULE 006 — GAP ANALYSIS BEFORE CODING

Before implementation:

Always produce:

CURRENT STATE

REQUIRED STATE

GAP

IMPACT

IMPLEMENTATION PLAN

Do not write code before gap analysis.

---

## RULE 007 — IMPACT ANALYSIS

Before modifying any file:

Must determine impact on:

* Database
* Repository
* Service
* API
* DTO
* Validation
* Authentication
* Authorization
* Frontend
* SignalR
* Cache

Never make isolated changes.

---

## RULE 008 — NO MOCK FEATURES

Forbidden:

* Mock API
* Fake data
* Temporary pages
* Placeholder workflows

Exception:

Explicitly requested by user.

Must be marked:

MOCK IMPLEMENTATION

---

## RULE 009 — FRONTEND COMPLETENESS

For every screen:

Must verify:

### Listing

* Search
* Filter
* Sort
* Pagination

### Create

* Validation
* Permission
* Error Handling

### Edit

* Validation
* Permission
* Audit Impact

### Delete

* Confirmation
* Dependency Check

### Details

* Full business data

No screen is considered complete otherwise.

---

## RULE 010 — ROLE VALIDATION

Every feature must identify:

* Guest
* Traveler
* Premium Traveler
* Provider
* Admin

Must define:

View
Create
Update
Delete
Approve
Reject

for each role.

---

## RULE 011 — REALTIME VALIDATION

Any feature involving:

* Collaboration
* Sharing
* Notifications
* Status Updates

Must evaluate SignalR requirement.

Never use polling when realtime is required by CRD.

---

## RULE 012 — OUTPUT FORMAT

Always respond using:

# Current State

# Requirement Analysis

# Gap Analysis

# Impact Analysis

# Proposed Solution

# Implementation Plan

# Risks

# Final Recommendation

Never jump directly to implementation.

---

## RULE 013 — ANTIGRAVITY ORCHESTRATION

For every task:

Phase 1:
Architecture Review

Phase 2:
Database Review

Phase 3:
Backend Review

Phase 4:
Frontend Review

Phase 5:
Security Review

Phase 6:
Implementation Plan

Phase 7:
Verification

No phase may be skipped.

---

## RULE 014 — EZTRAVEL FRONTEND AUDIT MODE

When auditing frontend:

Always compare:

Database
vs
CRD
vs
SRS
vs
Backend API
vs
Frontend Pages

Output:

Implemented %

Missing Features

Broken Flows

Permission Gaps

UI Gaps

Realtime Gaps

Priority Matrix

P1
P2
P3

Never audit frontend from UI alone.

---

## RULE 015 — COMPLETION CRITERIA

A feature is complete only when:

Database Ready
AND

Backend Ready
AND

Frontend Ready
AND

Permission Ready
AND

Validation Ready
AND

Error Handling Ready
AND

Audit Ready
AND

Acceptance Criteria Passed

Otherwise status = INCOMPLETE
