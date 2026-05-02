# AGENTS.md

This file defines repository-wide rules for all AI coding agents working in this project.

## Scope
These rules apply to every AI agent and sub-agent operating in this repository.

## Restricted Files (Do Not Modify)
Unless the user explicitly asks in the same request, agents must not create, edit, rename, or delete files matching:

- .env
- .env.*
- **/secrets/**
- **/*.pem
- **/*.key
- **/*.p12
- **/*.pfx
- package-lock.json
- reports/**
- test-results/**
- node_modules/**
- .git/**

## Restricted Paths (Read-Only)
Agents may read but must not write to:

- fixtures/**
- reports/**
- test-results/**

## Safety Rule
If a requested change touches any restricted file/path, agent must:
1. Stop before editing.
2. Ask for explicit confirmation.
3. Proceed only for the files explicitly approved by the user.

## Notes
- Test and build artifacts must not be manually edited.
- Environment and credential files are always treated as sensitive.
- If unsure whether a file is restricted, treat it as restricted and ask first.
