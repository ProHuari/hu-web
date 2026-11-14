---
version: 1.0.0
name: Huari Civic Design System
description: Editorial-civic visual language for political transparency, civic learning tracks, and course administration.
colors:
  primary: "#F15A24"
  primary-hover: "#D4460E"
  primary-deep: "#AD3300"
  primary-tint: "#FFF3ED"
  secondary: "#2B2D42"
  secondary-deep: "#151624"
  bg-page: "#F8F9FB"
  surface: "#FFFFFF"
  surface-subtle: "#FAFAFC"
  border: "#E5E7EB"
  text-primary: "#111827"
  text-secondary: "#4B5563"
  text-muted: "#6B7280"
  success: "#16A34A"
  warning: "#D97706"
  danger: "#DC2626"
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: -0.025em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.015em
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.04em
rounded:
  xs: 6px
  sm: 10px
  md: 14px
  lg: 18px
  xl: 24px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 12px
  card-surface:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 20px
---

# Huari Civic Design System

## Overview
Huari transforms congressional open data and civic education into a crisp, trustworthy, non-partisan digital experience. The visual tone pairs authoritative deep slate (`#2B2D42`) with high-energy civic orange (`#F15A24`) over airy cool-neutral surfaces (`#F8F9FB`).

- **Design Read:** Civic Intelligence & Learning Platform with tactile editorial clarity and purposeful spring-physics motion (`MOTION_INTENSITY: 6`, `DESIGN_VARIANCE: 6`, `VISUAL_DENSITY: 4`).
- **Accessibility:** WCAG AA contrast, keyboard focus rings (`focus-visible`), semantic landmarks, and full `prefers-reduced-motion` support (`MotionConfig reducedMotion="user"`).

## Colors
- **Primary (`#F15A24`) / Hover (`#D4460E`):** Sole interactive accent color across CTAs, active tabs, progress bars, and highlights.
- **Secondary (`#2B2D42` / `#151624`):** Deep slate anchor for hero banners, video containers, and authoritative headers.
- **Neutrals (`#F8F9FB`, `#FFFFFF`, `#E5E7EB`):** Cool slate-tinted whites and crisp hairline borders. No warm/cool gray mixing and no purple/indigo AI gradients.

## Typography
- **Self-hosted `Plus Jakarta Sans`** (`100–1000` variable weight) with `tabular-nums` for metrics, durations, and percentages.
- Fluid scale via `clamp()`, negative tracking on display headlines (`-0.02em`), and readable line length (`max-width: 65ch`).

## Layout
- Persistent collapsible `SideBar` + fluid `MainLayout` (`max-width: 1280px` centered containers, explicit `< 768px` mobile drawer).
- Route-level code splitting via `React.lazy` + `Suspense` with shaped skeleton fallbacks.

## Elevation & Depth
- Tinted subtle shadows (`0 2px 10px rgba(17, 24, 39, 0.04)`, `0 12px 28px rgba(17, 24, 39, 0.08)`) and primary-tinted glow on primary CTAs (`0 6px 18px rgba(241, 90, 36, 0.24)`).
- Surface hierarchy via background contrast (`#F8F9FB` canvas → `#FFFFFF` cards → `#FAFAFC` nested sections) and hairline borders (`1px solid #E5E7EB`).

## Shapes
- **Inputs & Buttons:** `10px` (`--radius-sm`)
- **Cards & Panels:** `16px–18px` (`--radius-lg`)
- **Pills & Progress Tracks:** `999px` (`--radius-pill`)

## Components
- **Motion Layer:** `motion/react` (`AnimatePresence`, spring transitions `{ type: 'spring', stiffness: 320, damping: 28 }`, staggered entrances, animated `layoutId` tab indicators, and smooth accordion height reveals).
- **Feedback:** Non-blocking `ToastProvider` (`aria-live="polite"`) and accessible `ConfirmModal` (`Escape` + focus management) replacing all `window.alert()` calls.
- **Admin Studio:** Role-protected (`/admin/courses`, `/admin/courses/new`, `/admin/courses/:courseId/edit`) plus discrete contextual Admin shortcuts directly inside `/learn` and `/learn/:courseId/overview`.

## Do's and Don'ts
- **Do** animate only GPU-composited properties (`transform`, `opacity`) and wrap root in `<MotionConfig reducedMotion="user">`.
- **Do** provide skeleton loaders matching target card/page geometry instead of plain spinners.
- **Don't** use `window.alert()`, hardcoded mismatched hexes (e.g. `#1e3a8a` blue fallbacks), or purple/violet accents.
- **Don't** render raw HTML strings without safe React tokenization.

