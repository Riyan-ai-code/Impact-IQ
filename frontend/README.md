# ImpactIQ — Engineering Intelligence Platform

> **Know what could break. Before it breaks.**

ImpactIQ is an enterprise-grade AI-powered Engineering Intelligence Platform that acts like a Staff Engineer reviewing every change before deployment. 

Unlike conventional AI tools that act as simple conversational chatbots, ImpactIQ decouples deterministic static analysis engines from LLM-based interpretation.

---

## 🛠️ Tech Stack (Frontend)

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (v3), PostCSS
- **Component Primitives**: Radix UI, Lucide Icons
- **Forms & Validation**: React Hook Form, Zod
- **Data State**: TanStack Query (React Query)

---

## 📁 Directory Structure

The repository follows a clean, feature-based atomic design structure:

```
frontend/
├── app/                       # Next.js App Router (Layouts & Pages)
│   ├── page.tsx               # Public Landing Page
│   └── layout.tsx             # Global Wrap & Metadata
├── components/                # Reusable UI Primitives & Sections
│   ├── ui/                    # Atomic UI Components (Buttons, Cards, etc.)
│   └── landing/               # Public Landing Components (Hero, Header, Features)
├── hooks/                     # Custom Application React Hooks
├── lib/                       # Utility helpers (Tailwind class merger)
├── services/                  # Business Logic & APIs client mappings
├── store/                     # Global client-side stores
├── styles/                    # Stylesheets & CSS custom tokens
├── types/                     # Shared TypeScript Interfaces
└── public/                    # Image assets, SVGs, and Static content
```

---

## 🧭 Core Philosophy

1. **Deterministic Engines Discover Facts**: Dependency analysis, AST parsers, and OpenAPI spec comparisons calculate exact changes, security flaws, and blast radius.
2. **AI Explains Implications**: Large Language Models interpret calculated parameters to generate natural language executive summaries, engineering risk assessments, and step-by-step remediation advice.

*The responsibilities of these two systems are never reversed.*

---

## 🚀 Getting Started

To launch the development server, run:
```bash
npm install
npm run dev
```

For more detailed setup instructions, see [SETUP.md](file:///c:/Users/DELL/Desktop/Impact-IQ/frontend/SETUP.md).
For architectural details, see [ARCHITECTURE.md](file:///c:/Users/DELL/Desktop/Impact-IQ/frontend/ARCHITECTURE.md).
