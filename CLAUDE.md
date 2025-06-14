# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

zidorin is a web-based selfie application targeting high school and college female students. It provides AI-powered filters using TensorFlow.js for face and pose detection with a pop, cute design aesthetic.

## Development Commands

```bash
# Install dependencies
make install

# Start development server (http://localhost:8000)
make dev

# Build for production
make build

# Preview production build
make preview

# Run all tests
make test

# Run unit tests only
make test-unit

# Run E2E tests only
make test-e2e

# Code linting
make lint

# TypeScript type checking
make type-check

# Clean build artifacts
make clean
```

## Architecture Guidelines

### Filter System
- Implement filters as pluggable modules that can be easily added/removed
- Each filter should be in its own file/module
- Use Canvas API for rendering decorations and effects
- TensorFlow.js integration for AI-powered filters (face/pose detection with 17 joint points)

### Frontend Structure
- TypeScript for type safety
- Tailwind CSS for styling (pop, cute, pastel colors for target audience)
- Vite as build tool for fast development
- No backend required - all processing happens client-side

### Development Environment
- All development through Docker (docker-compose)
- Reference the posture-diagnosis project for environment setup:
  - https://github.com/iitenkida7/posture-diagnosis/blob/main/Makefile
  - https://github.com/iitenkida7/posture-diagnosis/blob/main/docker-compose.yml

### Key Features to Implement
1. Camera capture interface
2. Filter selection UI (fun and intuitive)
3. Photo save functionality
4. Instagram launch button
5. Real-time filter preview using Canvas
6. TensorFlow.js integration for AI filters

## Testing Strategy

- Unit tests for filter logic and utilities
- E2E tests with Playwright for user flows
- Test filter rendering and AI model integration