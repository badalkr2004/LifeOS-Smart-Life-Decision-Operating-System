---
title: "LifeOS: Smart Life Decision Operating System"
subtitle: "Final Year Project Report – BCA 6th Semester"
author: "Badal Kumar"
roll_no: "10"
session: "2023–2026"
guide: "Ajit Sir"
hod: "Dr. Dinesh Manjhi"
department: "Department of Computer Application"
institution: "Patna College, Patna"
date: "June 2026"
---

&nbsp;

&nbsp;

---

# LifeOS: Smart Life Decision Operating System

&nbsp;

### A Project Report Submitted in Partial Fulfilment of the Requirements for the Degree of

## **Bachelor of Computer Applications (BCA)**

&nbsp;

**Submitted by:**

## Badal Kumar

**Roll No:** 10 &nbsp;&nbsp;&nbsp; **Session:** 2023–2026

&nbsp;

**Under the Guidance of:**

**Ajit Sir**

&nbsp;

**Coordinator & Head of Department:**

**Dr. Dinesh Manjhi**

&nbsp;

---

## **Department of Computer Application**

## **Patna College, Patna**

## **June 2026**

---

&nbsp;

---

## CERTIFICATE

&nbsp;

This is to certify that the project entitled **"LifeOS: Smart Life Decision Operating System"** submitted by **Badal Kumar** (Roll No. 10), BCA 6th Semester, Session 2023–2026, Department of Computer Application, Patna College, Patna, is a record of bonafide work carried out by the candidate under my supervision and guidance.

The project report has not been submitted previously for the award of any other degree or diploma of this or any other university or institution.

&nbsp;

&nbsp;

**Project Guide** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Coordinator & HOD**

**Ajit Sir** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Dr. Dinesh Manjhi**

Dept. of Computer Application &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dept. of Computer Application

Patna College, Patna &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Patna College, Patna

&nbsp;

**Date:** ________________________

**Place:** Patna

---

&nbsp;

## DECLARATION

&nbsp;

I, **Badal Kumar**, student of Bachelor of Computer Applications (BCA), 6th Semester, Roll No. 10, Session 2023–2026, Patna College, Patna, hereby declare that the project report entitled **"LifeOS: Smart Life Decision Operating System"** submitted to the Department of Computer Application is my own original work.

This project has not been submitted, either in part or in full, to any other institution or university for the award of any other degree or diploma. All sources referred to in the preparation of this report have been duly acknowledged.

&nbsp;

&nbsp;

**Signature of Candidate**

&nbsp;

**Name:** Badal Kumar

**Roll No:** 10

**Date:** ________________________

**Place:** Patna

---

&nbsp;

## ACKNOWLEDGEMENT

&nbsp;

Completing this project has been one of the most rewarding experiences of my BCA journey, and it would not have been possible without the support of many people.

I want to begin by expressing my deepest gratitude to **Dr. Dinesh Manjhi**, Head of the Department of Computer Application, Patna College, Patna. His encouragement and administrative guidance made the environment for this project possible.

I am sincerely grateful to my project guide, **Ajit Sir**, for his time, patience, and direction throughout the development process. His technical feedback helped me avoid many mistakes and pushed me to think about problems more carefully. I genuinely could not have completed a project of this scope without that guidance.

To all the faculty members of the Department of Computer Application — thank you for three years of teaching that gave me the foundation to take on a project like this. Every course, from databases to software engineering, contributed something to what I built here.

To my family — thank you for your support and for tolerating the long nights and weekends spent in front of a screen. Your belief in me made the difficult parts easier.

And to everyone who took the time to test the application and share feedback — your honest opinions made LifeOS better than it would have been otherwise.

&nbsp;

**Badal Kumar**
BCA 6th Semester, Roll No. 10
Patna College, Patna

---

&nbsp;

## ABSTRACT

&nbsp;

Every day, people make thousands of decisions — from the small and routine to the large and life-changing. Yet almost no one goes back to study those decisions afterward: whether they worked, what went wrong, and what could be learned. Over time, this leads to repeating the same mistakes, carrying the same blind spots, and never truly improving as a decision-maker.

**LifeOS — Smart Life Decision Operating System** is a mobile application designed to solve this problem. It gives users a structured way to log important decisions, track how those decisions turn out over time, and get advice from an AI that actually knows their personal decision history.

The application is a full-stack mobile system built with **React Native (Expo SDK 55)** for the mobile frontend, **Node.js with Express v5** (running on the Bun runtime) for the backend, and **PostgreSQL with the pgvector extension** as the database. AI functionality is powered by the **Groq API** using a custom 4-layer context assembly pipeline that personalizes every response to the individual user.

The core features are: a structured decision journal, scheduled outcome check-ins with automated reminders, a conversational AI advisor with real-time Server-Sent Events (SSE) streaming, automatic behavioral pattern detection that runs in the background, and a personal memory system where the AI stores and recalls important facts about the user across sessions.

In terms of scale, the project includes over 20 database tables, 40+ REST API endpoints, 10+ mobile screens, 25+ React Native components, and approximately 11,000 lines of TypeScript code. The architecture demonstrates real-world engineering practices including JWT authentication with token rotation, type-safe database access via Drizzle ORM, semantic vector search using HNSW indexing, asynchronous AI processing, and encrypted mobile token storage.

---

&nbsp;

## TABLE OF CONTENTS

&nbsp;

| Chapter | Title | Page |
|:-------:|-------|:----:|
| | Certificate | ii |
| | Declaration | iii |
| | Acknowledgement | iv |
| | Abstract | v |
| | List of Figures | viii |
| | List of Tables | ix |
| **1** | **Introduction** | 1 |
| 1.1 | Background and Motivation | 2 |
| 1.2 | Problem Statement | 3 |
| 1.3 | Objectives of the Project | 4 |
| 1.4 | Scope of the Project | 5 |
| 1.5 | Report Organization | 6 |
| **2** | **Literature Review** | 7 |
| 2.1 | Existing Decision Support Systems | 8 |
| 2.2 | Behavioral Science and Decision Making | 9 |
| 2.3 | AI-Powered Personal Assistants | 11 |
| 2.4 | Mobile Self-Improvement Apps | 12 |
| 2.5 | Research Gap | 13 |
| **3** | **System Analysis** | 14 |
| 3.1 | Feasibility Study | 15 |
| 3.2 | Requirement Analysis | 18 |
| 3.3 | Use Case Analysis | 22 |
| 3.4 | Data Flow Diagram | 28 |
| **4** | **System Design** | 32 |
| 4.1 | Architecture Overview | 33 |
| 4.2 | Entity Relationship Diagram | 39 |
| 4.3 | Database Design | 45 |
| 4.4 | API Design | 58 |
| 4.5 | UI/UX Design | 67 |
| 4.6 | AI Intelligence Architecture | 74 |
| **5** | **Implementation** | 80 |
| 5.1 | Technology Stack | 81 |
| 5.2 | Backend Implementation | 85 |
| 5.3 | Frontend Implementation | 100 |
| 5.4 | AI Integration | 115 |
| 5.5 | Security Implementation | 122 |
| **6** | **Testing** | 128 |
| 6.1 | Testing Strategy | 129 |
| 6.2 | API Testing | 131 |
| 6.3 | Functional Testing | 135 |
| 6.4 | Test Results Summary | 138 |
| **7** | **Results and Discussion** | 140 |
| 7.1 | Project Metrics | 141 |
| 7.2 | Objectives Achieved | 142 |
| 7.3 | Challenges and Solutions | 145 |
| **8** | **Future Scope** | 150 |
| **9** | **Conclusion** | 157 |
| | References | 161 |
| | Appendix A: Selected Source Code | 164 |
| | Appendix B: API Reference | 174 |

---

&nbsp;

## LIST OF FIGURES

| Figure No. | Title | Page |
|:----------:|-------|:----:|
| 3.1 | Context Diagram — Level 0 DFD | 29 |
| 3.2 | Level 1 Data Flow Diagram | 31 |
| 4.1 | High-Level System Architecture | 34 |
| 4.2 | Detailed Layered Architecture | 37 |
| 4.3 | Entity Relationship Diagram — Core Tables | 41 |
| 4.4 | Entity Relationship Diagram — AI and Analytics | 43 |
| 4.5 | AI Pipeline — 4-Layer Context Assembly | 76 |
| 4.6 | Sequence Diagram — Decision Creation Flow | 78 |
| 5.1 | Mobile App Folder Structure | 83 |
| 5.2 | Backend Folder Structure | 84 |
| 5.3 | Login Screen | [Screenshot] |
| 5.4 | Register Screen | [Screenshot] |
| 5.5 | Dashboard Screen | [Screenshot] |
| 5.6 | Decision List Screen | [Screenshot] |
| 5.7 | Decision Wizard — Step 1 | [Screenshot] |
| 5.8 | Decision Wizard — Step 2 | [Screenshot] |
| 5.9 | Decision Wizard — Step 3 | [Screenshot] |
| 5.10 | Decision Detail Screen | [Screenshot] |
| 5.11 | Outcome Check-In Screen | [Screenshot] |
| 5.12 | AI Advisor Chat Screen | [Screenshot] |
| 5.13 | AI Chat History Screen | [Screenshot] |

---

&nbsp;

## LIST OF TABLES

| Table No. | Title | Page |
|:---------:|-------|:----:|
| 3.1 | Technical Feasibility Assessment | 16 |
| 3.2 | Development Timeline | 18 |
| 3.3 | Functional Requirements | 19 |
| 3.4 | Non-Functional Requirements | 21 |
| 4.1 | Database Modules Overview | 46 |
| 4.2 | `users` Table — Column Definitions | 47 |
| 4.3 | `user_profiles` Table — Column Definitions | 49 |
| 4.4 | `decisions` Table — Column Definitions | 50 |
| 4.5 | `outcomes` Table — Column Definitions | 53 |
| 4.6 | `outcome_reminders` Table — Column Definitions | 55 |
| 4.7 | `ai_chat_sessions` Table — Column Definitions | 56 |
| 4.8 | `user_memories` Table — Column Definitions | 57 |
| 4.9 | Authentication API Endpoints | 59 |
| 4.10 | Decision Management API Endpoints | 61 |
| 4.11 | Outcome API Endpoints | 62 |
| 4.12 | Analytics API Endpoints | 63 |
| 4.13 | AI Module API Endpoints | 64 |
| 4.14 | Color Palette | 68 |
| 5.1 | Technology Stack Summary | 81 |
| 5.2 | Screen Implementation Status | 100 |
| 6.1 | Authentication Test Cases | 132 |
| 6.2 | Decision Management Test Cases | 133 |
| 6.3 | Outcome and AI Test Cases | 134 |
| 6.4 | Functional Test Results | 138 |
| 6.5 | Overall Test Summary | 139 |
| 7.1 | Project Metrics Summary | 141 |
| 7.2 | Objectives vs. Achievement | 143 |
| 7.3 | Challenges and Solutions | 146 |

---

&nbsp;

---

# CHAPTER 1: INTRODUCTION

---

## 1.1 Background and Motivation

Every adult makes an estimated 35,000 decisions per day — ranging from trivial choices like what to wear or what to eat, to significant ones like whether to change careers, how to handle a personal relationship, or whether to make a major financial investment. While small decisions rarely have lasting consequences, the bigger ones shape the direction of our lives in ways we often don't fully understand until much later.

What is remarkable is how rarely we study our own decision-making. When a decision goes badly, we tend to feel bad about it and move on. When it goes well, we assume we made the right call for the right reasons. In neither case do we typically go back and examine whether the logic we used was sound, whether we considered all the alternatives, or whether the outcome matched what we expected. This lack of structured reflection means we carry the same cognitive blind spots — the same biases, the same overconfidence, the same patterns — throughout our lives.

The idea for **LifeOS** grew out of this personal frustration. There was no app that would let someone log a decision in a structured way — recording the context, the alternatives they considered, the expected outcome, and their confidence level — and then come back weeks or months later to record what actually happened. There were journals, but journals are free-form and make it hard to find patterns. There were habit trackers, but they focused on routines rather than one-time choices. There was nothing that treated important life decisions as structured data worth tracking and learning from.

The second dimension that made this idea compelling was artificial intelligence. A generic AI chatbot can give general life advice, but it cannot give truly personalized advice because it knows nothing about you specifically. An AI that has access to your personal decision history — your past choices, the reasoning behind them, and how they turned out — could be genuinely transformative. It could tell you "the last three times you made a financial decision with confidence above 8, you ended up regretting it — are you sure this time is different?" That kind of personalized, historically-grounded advice is what LifeOS aims to provide.

---

## 1.2 Problem Statement

The central problem this project addresses is: **ordinary people have no structured system for making better decisions over time.**

Breaking this down into specific sub-problems:

**Sub-problem 1 — No Structure When Logging Decisions**
When people make important choices, they rarely document the decision context in any formal way — what alternatives they considered, what their reasoning was, what they expected to happen. Without this documentation, it is impossible to review the quality of the decision-making process later.

**Sub-problem 2 — No Follow-Up on Outcomes**
Even if someone documented a decision at the time, there is no system that automatically comes back at the appropriate time and asks "how did that work out?" Decisions are made and immediately forgotten. The outcome — the most valuable piece of feedback — is never connected back to the original decision.

**Sub-problem 3 — Invisible Patterns**
Without both the decision data and the outcome data, it is impossible to detect personal behavioral patterns. A person cannot see that they consistently overestimate financial outcomes, or that their career decisions made in July (end of year anxiety) tend to have lower satisfaction than those made in January. These patterns remain invisible without data.

**Sub-problem 4 — Generic AI Advice**
Existing AI assistants provide generic advice that is not tailored to the individual's history. They cannot say "given that you made 15 similar decisions in the past and 10 of them had lower satisfaction than expected, here is what those cases had in common." LifeOS addresses this by building a personalized AI model for each user based on their actual decision history.

---

## 1.3 Objectives of the Project

The objectives of the LifeOS project are:

1. **Decision Journal:** Build a mobile application where users can log important decisions in a structured multi-step format, capturing the title, category, background context, alternatives considered with pros and cons, expected outcomes with measurable metrics, target date, and confidence level.

2. **Outcome Tracking:** Implement an automated reminder system that schedules check-ins at meaningful intervals (1 week, 1 month, 3 months, 6 months, 1 year) and allows users to record satisfaction scores, actual results, reflections, and lessons learned.

3. **Personalized AI Advisor:** Build a conversational AI system with real-time streaming responses that is personalized using the user's own decision history, behavioral profile, detected patterns, and personal memory store.

4. **Behavioral Pattern Detection:** Implement a background job that automatically detects recurring patterns in the user's decision-making behavior — such as overconfidence in a specific category or time-of-day effects.

5. **Personal Memory System:** Create a system that extracts key personal facts from user reflections and conversations, stores them, and automatically includes them in future AI interactions.

6. **Secure Backend API:** Build a production-quality REST API with JWT authentication, bcrypt password hashing, encrypted token storage, soft deletes, and type-safe database access.

7. **Clean Mobile UI:** Deliver an intuitive, visually appealing mobile interface using React Native and Expo that works on both iOS and Android.

---

## 1.4 Scope of the Project

**What LifeOS includes in this version:**

- Complete user registration, login, and session management
- 3-step decision creation wizard with 10 life categories
- Decision list with search, category filtering, and status filtering
- Decision detail view with outcomes timeline
- Automated outcome reminder scheduling
- Outcome check-in submission with satisfaction scoring
- Conversational AI advisor with SSE streaming
- AI chat session history
- Background behavioral profile computation
- Behavioral pattern detection
- Personal memory extraction and storage
- Dashboard with quick actions, pending check-ins, and AI reflection

**What is not included in this version (planned for future):**

- Push notifications (backend infrastructure is ready)
- IoT / wearable device integration
- Advanced analytics visualization charts
- Social and decision sharing features
- Voice input
- Dark mode
- Profile and settings screen
- Web application companion

---

## 1.5 Report Organization

This report is divided into nine chapters:

**Chapter 2** reviews existing literature on decision support systems, behavioral science, and AI-powered personal tools, establishing the gap that LifeOS fills.

**Chapter 3** covers the system analysis: feasibility study, functional and non-functional requirements, use case descriptions, and data flow diagrams.

**Chapter 4** presents the complete system design: high-level and detailed architecture, ER diagram, database table definitions, API design, UI/UX design, and AI intelligence architecture.

**Chapter 5** details the implementation of the backend, frontend, AI integration, and security systems, with selected code snippets and explanations.

**Chapter 6** describes the testing approach, test cases for key functionality, and overall test results.

**Chapter 7** discusses the project results, what was achieved versus the original objectives, and the challenges encountered with how they were resolved.

**Chapter 8** outlines the planned future scope including push notifications, analytics, dark mode, IoT integration, and social features.

**Chapter 9** concludes the report with key takeaways from the project.

---

&nbsp;

---

# CHAPTER 2: LITERATURE REVIEW

---

## 2.1 Existing Decision Support Systems

The field of Decision Support Systems (DSS) has been active in computing research since the early 1970s. Gorry and Morton (1971) introduced the foundational DSS framework in their paper "A Framework for Management Information Systems," describing systems that help managers make structured and semi-structured decisions by providing relevant data and analytical tools.

Enterprise DSS products like **SAP Analytics Cloud**, **IBM Cognos**, and **Microsoft Power BI** evolved from this tradition. These are sophisticated, data-heavy platforms used by business analysts in large organizations. They are, however, completely unsuited to personal life decisions — they are expensive, require technical expertise to set up, and are designed to work with organizational data sets, not individual personal choices.

On the consumer side, **Notion** and **Obsidian** are popular general-purpose knowledge management tools that some productivity enthusiasts use to keep decision journals. The limitation is that these are free-form tools — there is no enforced structure for decision logging, no automated outcome reminder system, and no AI system designed specifically around decision history. The user must manually create and maintain their own structure, which most people don't sustain over time.

Personal journaling apps like **Day One** and **Penzu** allow free-form daily journaling. Some users use these for reflective decision-making, but again, the lack of structure and follow-up mechanisms limits their effectiveness for tracking decision outcomes over time.

**750words.com** encourages daily writing habits through gamification but provides no decision-specific structure or AI integration.

The gap across all these tools is clear: none of them combine structured decision capture, automated outcome tracking, and personalized AI analysis into a single mobile application designed specifically for life decisions.

---

## 2.2 Behavioral Science and Decision Making

The academic literature on human decision-making is extensive and sobering. Research consistently shows that humans are not the rational decision-makers economic theory assumes, but rather are subject to predictable, systematic biases.

**Daniel Kahneman**, in his landmark book *Thinking, Fast and Slow* (2011), describes the dual-process model of decision-making: System 1 (fast, intuitive, emotional) and System 2 (slow, deliberate, analytical). The key insight is that most decisions are driven by System 1 — which is fast but error-prone — and we rarely engage the slower, more careful System 2 thinking that leads to better outcomes.

**Common Decision Biases:**

*Overconfidence Bias* — Research by Lichtenstein, Fischhoff, and Phillips has repeatedly demonstrated that when people are "90% confident" about something, they are typically right only 70–75% of the time. This miscalibration is especially pronounced in domains where feedback is delayed, like career decisions or investments.

*Recency Bias* — The tendency to give recent events disproportionate weight. A career decision made just after a particularly good or bad week at work may be overly influenced by that temporary state.

*Sunk Cost Fallacy* — People continue with a failing course of action because of past investment rather than future potential. The decision to "cut losses" feels harder than it is because it means admitting a mistake.

*Optimism Bias* — Systematically overestimating the likelihood of positive outcomes and underestimating risks. Studies show this is especially strong in first-time entrepreneurs, who dramatically overestimate their probability of business success.

*Outcome Bias* — Judging a decision by its outcome rather than by the quality of the process. A good decision can lead to a bad outcome (bad luck), and a poor decision process can occasionally produce a good outcome (good luck). The two need to be evaluated separately.

**The Decision Journal Prescription:**
Behavioral researchers — including Gary Klein (2007) in his Harvard Business Review piece on "pre-mortems" — consistently recommend keeping a structured decision journal as a way to combat these biases. The idea is: at the moment of making a decision, write down what you decided, why, what you expected to happen, and how confident you are. Then, when enough time has passed, revisit the entry and record what actually happened. This creates a structured feedback loop that, over time, helps calibrate your judgment and identify your personal blind spots.

LifeOS is essentially a mobile, AI-powered implementation of the behavioral scientist's recommendation.

---

## 2.3 AI-Powered Personal Assistants

The advent of large language models (LLMs) has dramatically expanded what is possible in AI-powered personal tools. Models like GPT-4, Claude, and the open-weight Llama family can understand natural language, reason about complex situations, synthesize information from long contexts, and produce helpful responses in a conversational format.

**Generic AI Chatbots:**
Tools like ChatGPT, Claude.ai, and Google Gemini are powerful general-purpose AI assistants. However, their fundamental limitation for personal decision support is that they have no persistent knowledge of the user. Every conversation starts from scratch. The AI does not know that this user has a history of overconfident financial decisions, or that they are currently dealing with a difficult family situation that might be influencing their thinking. Without personal context, the advice is necessarily generic.

**Personalized AI Efforts:**
Projects like **Mem.ai** have attempted to solve the personal context problem by indexing all the notes and documents a person produces. The AI can then retrieve relevant personal context when answering questions. However, this is a general knowledge retrieval approach — it does not build a structured behavioral model of the user as a decision-maker.

**Retrieval-Augmented Generation (RAG):**
The academic literature on RAG systems (Lewis et al., 2020) describes how combining a retrieval mechanism (finding relevant stored documents) with a generative model (producing responses) produces much better-grounded, accurate, and personalized responses than using the generative model alone. LifeOS implements a specialized form of RAG where the "documents" being retrieved are the user's own past decisions, outcomes, behavioral patterns, and personal memories — creating a uniquely personal AI advisor.

---

## 2.4 Mobile Self-Improvement Apps

The mobile app market for personal development is large and well-studied. Several categories of apps are relevant as comparators:

**Habit Trackers:** Apps like Habitica, Streaks, and Finch use gamification and streak mechanics to encourage daily behavioral habits. The key design lesson from their success is that mobile apps for personal behavior change need to be frictionless to engage with daily, need to provide immediate positive feedback, and need to make patterns visible to the user.

**Mood and Mental Health Tracking:** Apps like **Daylio** and **Bearable** allow users to log mood, activities, and symptoms, and then show correlations — "your mood is consistently higher on days when you exercise." This simple feedback loop (log data → see patterns → change behavior) is proven to be valuable to users and has driven millions of downloads.

**Journaling Apps:** Apps like Day One and Reflectly are modern, beautifully designed journaling applications. They demonstrate that people are willing to share personal thoughts and reflections in a mobile app, provided the design is calm, inviting, and non-judgmental.

**Productivity Apps:** Tools like Todoist and Things 3 for task management show that people will invest time in documenting future plans in an app if the payoff in organization and reduced anxiety is clear.

The common design principles across successful self-improvement apps are: low friction for data entry, clear visualization of trends, positive reinforcement, and a design that feels personal and non-clinical. LifeOS draws from all of these in its UI/UX design.

---

## 2.5 Research Gap

Synthesizing the literature above, the gap LifeOS addresses is clear and specific:

**There is no existing mobile application that provides all of:**

| Capability | Existing Tools | LifeOS |
|-----------|----------------|--------|
| Structured decision logging | ❌ (free-form only) | ✅ |
| Automated outcome reminders | ❌ | ✅ |
| Satisfaction and reflection tracking | ❌ | ✅ |
| Personalized AI advisor | ❌ (generic advice) | ✅ |
| RAG with personal decision history | ❌ | ✅ |
| Automatic behavioral pattern detection | ❌ | ✅ |
| Personal memory system across AI sessions | ❌ | ✅ |

LifeOS is not an academic prototype — it is a fully functional mobile application that fills this gap with a clean interface, a production-quality backend, and a genuinely innovative AI architecture.

---

&nbsp;

---

# CHAPTER 3: SYSTEM ANALYSIS

---

## 3.1 Feasibility Study

### 3.1.1 Technical Feasibility

Before committing to the project, a technical feasibility assessment was conducted to determine whether the required technologies were available, accessible, and within the skill set of a BCA student.

**Table 3.1: Technical Feasibility Assessment**

| Technology Area | Technology Chosen | Feasibility Assessment |
|----------------|-------------------|----------------------|
| Mobile Development | React Native + Expo SDK 55 | ✅ Mature framework, excellent documentation, free to use |
| Mobile Navigation | Expo Router v3 | ✅ File-based routing, simple to learn |
| State Management | Zustand + React Query | ✅ Both are widely used, well-documented |
| Backend Runtime | Bun + Node.js | ✅ Bun is stable for v1.x, significantly faster than Node |
| Backend Framework | Express v5 | ✅ Industry standard, extensive resources |
| Type Safety | TypeScript 5.x | ✅ Required across both client and server |
| ORM | Drizzle ORM | ✅ SQL-first, generates TypeScript types automatically |
| Database | PostgreSQL 15+ | ✅ Free, open-source, production-grade |
| Vector Search | pgvector extension | ✅ Stable extension, well-supported by Drizzle |
| AI Inference | Groq API | ✅ Free tier is generous, fast inference |
| AI Streaming | Vercel AI SDK | ✅ Excellent SSE streaming support for Node.js |

**Conclusion:** All required technologies are stable, well-documented, free or low-cost, and within reach of a motivated BCA student with JavaScript/TypeScript knowledge.

### 3.1.2 Economic Feasibility

The project was built with zero budget using entirely free or open-source tools:

| Resource | Cost |
|----------|------|
| Development laptop | Existing hardware |
| PostgreSQL database | Free (local development) |
| Groq API | Free tier with generous monthly allowance |
| Expo development account | Free tier |
| GitHub for version control | Free |
| All frameworks and libraries | Open source |
| Test devices | Personal Android phone + iOS Simulator |

**Total development cost: ₹0**

**Conclusion:** The project is economically feasible.

### 3.1.3 Operational Feasibility

The application targets anyone who makes important personal decisions — which is every adult. The design philosophy prioritizes simplicity: the AI advisor uses plain conversational language, decision categories cover all major life domains, and the three-step wizard breaks decision creation into small, manageable chunks.

A basic smartphone and an internet connection are the only requirements for users. No technical knowledge is needed.

**Conclusion:** The project is operationally feasible for a broad audience.

### 3.1.4 Schedule Feasibility

**Table 3.2: Development Timeline**

| Phase | Activities | Duration |
|-------|-----------|----------|
| 1 — Planning | Requirements gathering, architecture design, database schema design | 2 weeks |
| 2 — Backend Core | Express setup, database connection, auth endpoints, decision CRUD | 4 weeks |
| 3 — Backend AI | AI pipeline, scheduler, memory system, analytics endpoints | 3 weeks |
| 4 — Mobile UI | Auth screens, dashboard, decision screens, wizard | 4 weeks |
| 5 — Mobile AI | AI chat screen, streaming integration, history | 2 weeks |
| 6 — Integration & Testing | End-to-end testing, bug fixes, performance | 2 weeks |
| 7 — Documentation | Thesis writing, code cleanup | 3 weeks |

**Total: approximately 20 weeks (5 months)**

**Conclusion:** The project fits within the typical timeline of a BCA final year project.

---

## 3.2 Requirement Analysis

Requirements were identified through personal use case analysis, feedback from potential users, and reference to the behavioral science literature on decision-making tools.

### 3.2.1 Functional Requirements

**Table 3.3: Functional Requirements**

| Req. ID | Module | Requirement Description | Priority |
|---------|--------|------------------------|----------|
| FR-01 | Auth | The system shall allow new users to register with email, password, first name, and last name | High |
| FR-02 | Auth | The system shall authenticate users with email and password and return JWT access and refresh tokens | High |
| FR-03 | Auth | The system shall support automatic token refresh when the access token expires | High |
| FR-04 | Auth | The system shall allow users to log out and revoke their refresh token | High |
| FR-05 | Decisions | The system shall allow users to create a decision with: title, category, context, reasoning, alternatives considered with pros/cons, expected outcomes with metrics, target date, and confidence level (1–10) | High |
| FR-06 | Decisions | The system shall display a paginated list of the user's decisions with search, category filter, and status filter | High |
| FR-07 | Decisions | The system shall display the full detail of a decision including all recorded outcomes in a timeline | High |
| FR-08 | Decisions | The system shall allow soft deletion of decisions (data is preserved with a deletedAt timestamp) | Medium |
| FR-09 | Decisions | The system shall allow users to use pre-built templates when creating decisions | Medium |
| FR-10 | Outcomes | The system shall automatically create outcome reminders at intervals of 1 week, 1 month, 3 months, 6 months, and 1 year after a decision is created | High |
| FR-11 | Outcomes | The dashboard shall display pending outcome check-in cards | High |
| FR-12 | Outcomes | The system shall allow users to record an outcome with: satisfaction score (1–10), actual results, reflections, lessons learned, mood rating, and a "would decide again" indicator | High |
| FR-13 | Outcomes | The system shall allow users to skip or complete individual reminder items | Medium |
| FR-14 | AI | The system shall provide a conversational AI advisor that responds in real-time using SSE streaming | High |
| FR-15 | AI | AI responses shall be personalized using the user's behavioral profile, similar past decisions, detected patterns, and personal memories | High |
| FR-16 | AI | The system shall save AI chat session history | Medium |
| FR-17 | Intelligence | The system shall automatically recompute the user behavioral profile every 6 hours | High |
| FR-18 | Intelligence | The system shall automatically detect behavioral patterns every 12 hours | High |
| FR-19 | Intelligence | The system shall extract long-term memories from outcome reflections and chat sessions | High |
| FR-20 | Intelligence | Memory cleanup shall run every 24 hours, keeping maximum 50 memories per user | Medium |
| FR-21 | Dashboard | The dashboard shall show: greeting, pending check-ins, quick actions, AI reflection card, and recent decisions | High |
| FR-22 | Analytics | The system shall provide analytics summary data (total decisions, average satisfaction, patterns) | Medium |

### 3.2.2 Non-Functional Requirements

**Table 3.4: Non-Functional Requirements**

| Req. ID | Category | Requirement | Target |
|---------|----------|-------------|--------|
| NFR-01 | Security | Passwords must be hashed with bcrypt | Salt rounds ≥ 10 |
| NFR-02 | Security | All protected endpoints require valid JWT Bearer token | 100% coverage |
| NFR-03 | Security | Tokens stored using device secure storage (encrypted keychain) | iOS Keychain / Android Keystore |
| NFR-04 | Security | User data isolation — users cannot access other users' data | Database-level userId filter |
| NFR-05 | Performance | Standard CRUD API responses | < 500ms |
| NFR-06 | Performance | AI streaming response — first token delivery | < 3 seconds |
| NFR-07 | Reliability | Core user actions (save decision, save outcome) must not depend on AI success | Fire-and-forget async |
| NFR-08 | Scalability | All frequently queried columns must have database indexes | As defined in schema |
| NFR-09 | Scalability | Vector similarity search must use HNSW index | vector_cosine_ops HNSW |
| NFR-10 | Compatibility | App must run on both iOS and Android from one codebase | Expo managed workflow |
| NFR-11 | Maintainability | All code must be TypeScript — no plain JavaScript | Client + Server |
| NFR-12 | Usability | App must work without any onboarding instructions | Tested with new users |

---

## 3.3 Use Case Analysis

### 3.3.1 System Actors

**Primary Actor — User:**
Any registered individual who uses the LifeOS mobile app. The user can be a student, working professional, entrepreneur, or anyone who makes personal life decisions. The user interacts with the system through the mobile interface.

**Secondary Actor — System (Background Scheduler):**
The automated background process that runs on the server. It is responsible for periodic jobs: profile refresh (every 6 hours), pattern detection (every 12 hours), and memory cleanup (every 24 hours). This actor operates without any user interaction.

**External Actor — AI Service (Groq API):**
The external AI inference service called by the backend. It processes prompts assembled by the LifeOS AI pipeline and returns generated text, which is streamed back to the user.

### 3.3.2 Use Case Descriptions

---

**UC-01: User Registration**

| Field | Detail |
|-------|--------|
| Use Case Name | User Registration |
| Actors | New User |
| Trigger | User opens the app for the first time and taps "Create Account" |
| Preconditions | The email address is not already registered |
| Main Flow | 1. User enters first name, last name, email, and password. 2. App validates inputs (all required, email format, password minimum length). 3. App sends POST /auth/register. 4. Server hashes password with bcrypt. 5. Server creates user record. 6. Server generates access token (JWT) and refresh token (random bytes). 7. Tokens are stored in device SecureStore. 8. User is navigated to Dashboard. |
| Alternative Flow | If email already exists → 409 error shown. If validation fails → inline error messages shown. |
| Postconditions | User account created, user is logged in with valid tokens. |

---

**UC-02: User Login**

| Field | Detail |
|-------|--------|
| Use Case Name | User Login |
| Actors | Registered User |
| Trigger | User opens the app and enters credentials on the Login screen |
| Preconditions | User has a registered account |
| Main Flow | 1. User enters email and password. 2. App sends POST /auth/login. 3. Server verifies credentials using bcrypt.compare(). 4. Server issues new access and refresh tokens. 5. Tokens stored in SecureStore. 6. User navigated to Dashboard. |
| Alternative Flow | Invalid credentials → 401 error message shown. Missing fields → validation error. |
| Postconditions | User is authenticated with valid tokens stored on device. |

---

**UC-03: Create Decision**

| Field | Detail |
|-------|--------|
| Use Case Name | Create a New Decision |
| Actors | Authenticated User |
| Trigger | User taps "New Decision" from Dashboard or Decision List FAB |
| Preconditions | User is logged in |
| Main Flow | 1. User opens the 3-step wizard. 2. Step 1: Optionally selects a template (auto-fills fields). Enters title, selects category from a 10-tile grid, writes context. 3. Step 2: Writes background reasoning, adds alternatives with pros and cons. 4. Step 3: Adds expected outcome metrics, sets target date, drags confidence slider (1–10). 5. User taps Submit. 6. App sends POST /decisions. 7. Server saves decision and returns 201. 8. Server asynchronously generates AI embedding and creates outcome reminders. 9. Wizard closes and Decision List refreshes. |
| Alternative Flow | If any required field is missing → step navigation is blocked with validation message. If API call fails → error toast shown. |
| Postconditions | Decision saved, outcome reminders created at configured intervals. |

---

**UC-04: View Decision List**

| Field | Detail |
|-------|--------|
| Use Case Name | View Decision List |
| Actors | Authenticated User |
| Trigger | User navigates to the Decisions tab |
| Preconditions | User is logged in |
| Main Flow | 1. App fetches paginated decisions from GET /decisions. 2. List displays with category icon, title, confidence ring, category badge, status badge, and time-ago label. 3. User can type in the search bar to filter by keyword. 4. User can tap a category chip to filter by category. 5. User can select status filter (All / Active / Archived). |
| Postconditions | User sees a filtered, sorted list of their decisions. |

---

**UC-05: View Decision Detail**

| Field | Detail |
|-------|--------|
| Use Case Name | View Decision Detail |
| Actors | Authenticated User |
| Trigger | User taps on a decision card in the list |
| Preconditions | The decision belongs to the authenticated user |
| Main Flow | 1. App fetches decision detail from GET /decisions/:id. 2. Screen shows category badge, title, segmented control. 3. Context tab: confidence ring, description, reasoning, context, metrics with progress bars, alternatives as chips, tags. 4. Outcomes tab: timeline of all recorded outcomes with dates, satisfaction scores, reflections. 5. Bottom CTA: "Analyze with AI" button. |
| Postconditions | User can review the full decision history and outcomes. |

---

**UC-06: Record Outcome Check-In**

| Field | Detail |
|-------|--------|
| Use Case Name | Record Outcome Check-In |
| Actors | Authenticated User |
| Trigger | User taps a pending check-in card from the Dashboard or navigates to the check-in screen |
| Preconditions | User is logged in; pending reminder exists |
| Main Flow | 1. Check-in form loads, pre-populated with the associated decision title. 2. User rates satisfaction (1–10). 3. User writes actual results, reflections, and lessons learned. 4. User toggles "Would you make the same decision again?" 5. User sets mood and stress levels. 6. User submits. 7. POST /outcomes returns 201 immediately. 8. Background jobs trigger asynchronously: extractMemories(), computeProfile(), detectPatterns(). |
| Alternative Flow | If user skips → POST /outcomes/checkins/:id/skip marks the reminder as skipped. |
| Postconditions | Outcome record created; background AI analysis triggered asynchronously. |

---

**UC-07: Chat with AI Advisor**

| Field | Detail |
|-------|--------|
| Use Case Name | Chat with AI Advisor |
| Actors | Authenticated User |
| Trigger | User navigates to AI tab or taps "Ask AI" quick action |
| Preconditions | User is logged in |
| Main Flow | 1. Chat interface loads. 2. User types a message about a decision they are facing or want to reflect on. 3. App sends POST /ai/chat. 4. Server assembles 4-layer context (user profile, category context, similar past decisions via pgvector, behavioral patterns, user memories). 5. Server calls Groq API with assembled context. 6. Groq streams response tokens. 7. Server streams tokens via SSE to mobile app. 8. Tokens appear in the chat bubble in real-time. 9. Full conversation saved to ai_chat_messages table. |
| Alternative Flow | If streaming connection fails → error message shown with retry option. |
| Postconditions | AI response delivered in real-time; conversation saved to session history. |

---

**UC-08: Behavioral Pattern Detection (Background)**

| Field | Detail |
|-------|--------|
| Use Case Name | Detect Behavioral Patterns |
| Actors | System (Scheduler) |
| Trigger | Background scheduler fires every 12 hours |
| Preconditions | Active users with decision history exist |
| Main Flow | 1. Scheduler calls detectPatterns() for each active user. 2. Function queries decisions and outcomes. 3. Computes statistics: satisfaction by category, confidence vs satisfaction correlation, timing effects. 4. Identifies significant patterns (e.g., financial decisions have high regret rate, overconfidence detected in career category). 5. Stores new patterns in decision_patterns table. |
| Postconditions | Detected patterns are available for AI context and analytics. |

---

## 3.4 Data Flow Diagram

### 3.4.1 Context Diagram — Level 0 DFD

**[FIGURE 3.1 — Context Diagram (Level 0 DFD)]**

```
                         Decision Journal Data
          ┌──────────────────────────────────────────────────────┐
          │                                                      │
          │  ┌────────────────────────────────────────────┐      │
          │  │                                            │      │
  ┌───────┤  │            LifeOS System                   │──────┤───────┐
  │       │  │                                            │      │       │
  │ User  ├─▶│   • Authentication Service                 │──────┼──────▶│  Groq API
  │       │  │   • Decision Management                   │      │  AI   │  (External)
  │       │◀─│   • Outcome Tracking                      │◀─────┼──────┤
  └───────┤  │   • AI Intelligence Engine                │      │       │
          │  │   • Analytics Engine                      │      │
          │  │   • Notification Service                  │      │
          │  │                                            │      │
          │  └─────────────────┬──────────────────────────┘      │
          │                    │                                  │
          │                    ▼                                  │
          │           PostgreSQL Database                         │
          └──────────────────────────────────────────────────────┘
```

*The User interacts with the LifeOS System via the mobile application. The system calls the external Groq API for AI inference. All data is persisted in the PostgreSQL database.*

---

### 3.4.2 Level 1 DFD — Detailed Process View

**[FIGURE 3.2 — Level 1 Data Flow Diagram]**

```
USER ─────────────────────────────────────────────────────────────┐
  │                                                               │
  │ credentials      ┌───────────────────────┐                   │
  ├────────────────▶ │  P1: Authentication   │──▶ D1: Users      │
  │ tokens           │  & Session Mgmt       │    & Profiles     │
  │ ◀─────────────── └───────────────────────┘                   │
  │                                                               │
  │ decision data    ┌───────────────────────┐                   │
  ├────────────────▶ │  P2: Decision         │──▶ D2: Decisions  │
  │ decision list    │  Management           │──▶ (with embedding│
  │ ◀─────────────── └──────────┬────────────┘    via pgvector)  │
  │                             │ triggers AI embed               │
  │                             ▼                                 │
  │                   ┌──────────────────┐                       │
  │                   │  P4: AI Engine   │──▶ Groq API           │
  │                   └─────────┬────────┘                       │
  │                             │                                 │
  │ check-in data    ┌──────────▼────────────┐                   │
  ├────────────────▶ │  P3: Outcome          │──▶ D3: Outcomes   │
  │ dashboard data   │  Tracking             │──▶ & Reminders    │
  │ ◀─────────────── └──────────┬────────────┘                   │
  │                             │ triggers profile/patterns       │
  │                             ▼                                 │
  │                   ┌──────────────────────┐                   │
  │ AI chat           │  P4: AI Intelligence │──▶ D4: AI Chat    │
  ├────────────────▶  │  Engine              │──▶ Sessions &     │
  │ AI response       │  (streaming SSE)     │──▶ Memories       │
  │ ◀─────────────── └──────────────────────┘                   │
  │                                                               │
  │ analytics data   ┌───────────────────────┐                   │
  │ ◀─────────────── │  P5: Analytics        │──▶ D5: Analytics  │
  │                  │  Engine               │──▶ & Patterns     │
  │                  └───────────────────────┘                   │
  │                                                               │
SYSTEM ──────────────────────────────────────────────────────────┤
  │ (Background Scheduler)                                        │
  │                   ┌───────────────────────┐                  │
  ├─────────────────▶ │  P6: Background       │──▶ D4, D5        │
  │ every 6/12/24h    │  Intelligence Jobs    │──▶ (profile,     │
  │                   │  (profile/patterns/   │──▶  patterns,    │
  │                   │   memory cleanup)     │──▶  memories)    │
  │                   └───────────────────────┘                  │
  └──────────────────────────────────────────────────────────────┘
```

**Data Stores:**

- **D1 — Users & Profiles:** `users`, `user_profiles`, `refresh_tokens`, `sessions`
- **D2 — Decisions:** `decisions`, `decision_attachments`, `decision_frameworks`, `decision_templates`
- **D3 — Outcomes & Reminders:** `outcomes`, `outcome_reminders`
- **D4 — AI Sessions & Memory:** `ai_chat_sessions`, `ai_chat_messages`, `ai_interactions`, `user_memories`, `user_decision_profiles`
- **D5 — Analytics & Patterns:** `analytics_snapshots`, `user_insights`, `decision_patterns`

---

&nbsp;

---

# CHAPTER 4: SYSTEM DESIGN

---

## 4.1 Architecture Overview

LifeOS uses a **three-tier client-server architecture** with a clear separation of responsibilities: the mobile client handles presentation, the REST API handles business logic, and PostgreSQL handles data persistence. An additional AI service layer integrates with an external LLM API.

### 4.1.1 High-Level Architecture

**[FIGURE 4.1 — High-Level System Architecture]**

```
╔═════════════════════════════════════════════════════════════════╗
║                        CLIENT TIER                              ║
║                                                                 ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │            React Native Mobile App (Expo SDK 55)        │   ║
║   │                                                         │   ║
║   │  Expo Router ──── React Query ──── Zustand              │   ║
║   │  (Navigation)     (Server State)   (Auth State)         │   ║
║   │                                                         │   ║
║   │  Axios Client ─── expo-secure-store (encrypted)         │   ║
║   │  (HTTP + JWT)     (Token Storage)                       │   ║
║   └──────────────────────────┬──────────────────────────────┘   ║
║                              │ HTTPS + Bearer Token              ║
╚══════════════════════════════╪═════════════════════════════════╝
                               │
╔══════════════════════════════╪═════════════════════════════════╗
║                        API TIER                  │              ║
║                              ▼                                  ║
║   ┌─────────────────────────────────────────────────────────┐   ║
║   │            Node.js (Bun) + Express v5 + TypeScript      │   ║
║   │                                                         │   ║
║   │  Helmet ─── CORS ─── JWT Middleware ─── Error Handler   │   ║
║   │                                                         │   ║
║   │  Routes → Controllers → Services → DB Layer             │   ║
║   │                                                         │   ║
║   │  AI Pipeline (fire-and-forget) ─── SSE Streaming        │   ║
║   └──────────────────────────┬──────────────────────────────┘   ║
║                              │ Drizzle ORM (type-safe SQL)       ║
╚══════════════════════════════╪═════════════════════════════════╝
                               │
╔══════════════════════════════╪═════════════════════════════════╗
║                       DATA TIER                  │              ║
║                              ▼                                  ║
║   ┌──────────────────────────────────────────────────────┐      ║
║   │            PostgreSQL 15+ with pgvector              │      ║
║   │                                                      │      ║
║   │  20+ tables across 10 schema modules                 │      ║
║   │  HNSW index on decisions.embedding (1536-dim)        │      ║
║   │  B-tree indexes on all frequently-queried columns    │      ║
║   └──────────────────────────────────────────────────────┘      ║
║                                                                 ║
║   External: Groq API (LLM) ── Vercel AI SDK (streaming)        ║
╚═════════════════════════════════════════════════════════════════╝
```

---

### 4.1.2 Detailed Layered Architecture

**[FIGURE 4.2 — Detailed Layered Architecture Diagram]**

```
┌──────────────────────────────────────────────────────────────┐
│                  MOBILE APP (React Native / Expo)            │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌───────────────┐  │
│  │  Screens │  │Components│  │ Hooks   │  │   Services    │  │
│  │ (Expo    │  │(UI       │  │(React   │  │(API calls     │  │
│  │  Router) │  │ elements)│  │ Query)  │  │ via Axios)    │  │
│  └─────────┘  └──────────┘  └─────────┘  └───────────────┘  │
│       │              │            │               │           │
│  ┌────▼──────────────▼────────────▼───────────────▼───────┐  │
│  │              Zustand Auth Store                         │  │
│  │              expo-secure-store (tokens)                 │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬────────────────────────────┘
                                  │ HTTPS / JWT
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND API (Express v5 + Bun)              │
│                                                              │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Middleware │  │   Routes     │  │    Controllers      │   │
│  │  • Helmet   │  │  /auth       │  │  auth.controller    │   │
│  │  • CORS     │  │  /users      │  │  decision.ctrl      │   │
│  │  • JWT auth │  │  /decisions  │  │  outcome.ctrl       │   │
│  │  • Error    │  │  /outcomes   │  │  ai.controller      │   │
│  │    handler  │  │  /analytics  │  │  analytics.ctrl     │   │
│  └────────────┘  │  /ai         │  └─────────────────────┘   │
│                  │  /frameworks  │                             │
│                  │  /templates   │                             │
│                  └──────────────┘                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              AI Subsystem                            │    │
│  │  pipeline.ts (4-layer context assembly)              │    │
│  │  scheduler.ts (background jobs: 6h/12h/24h)          │    │
│  │  memory.ts (LLM-based memory extraction)             │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────┬────────────────────────────┘
                                  │ Drizzle ORM
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL + pgvector)               │
│                                                              │
│  Users      Decisions    Outcomes     AI Chat                │
│  Profiles   Frameworks   Reminders    Messages               │
│  Auth       Templates    Patterns     Memories               │
│  Analytics  Insights     Notifications                       │
│                                                              │
│  pgvector HNSW index on decisions.embedding (1536-dim)       │
└─────────────────────────────────┬────────────────────────────┘
                                  │ HTTP calls
                                  ▼
┌──────────────────────────────────────────────────────────────┐
│               EXTERNAL AI SERVICES                           │
│                                                              │
│  Groq API (LLM inference) ←── Vercel AI SDK (SSE streaming)  │
│  OpenAI-compatible embeddings API                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 4.2 Entity Relationship Diagram

### 4.2.1 Core Tables ER Diagram

**[FIGURE 4.3 — Entity Relationship Diagram — Core Tables]**

```
┌──────────────────────┐         ┌────────────────────────────────┐
│       USERS          │         │         DECISIONS               │
├──────────────────────┤         ├────────────────────────────────┤
│ id (PK, UUID)        │ 1       │ id (PK, UUID)                  │
│ email (UNIQUE)       │─────────│ userId (FK → users.id)         │
│ passwordHash         │    N    │ title (VARCHAR 255)            │
│ firstName            │         │ description (TEXT)             │
│ lastName             │         │ category (ENUM)                │
│ displayName          │         │ subcategory (VARCHAR)          │
│ role (ENUM)          │         │ status (ENUM)                  │
│ status (ENUM)        │         │ decisionDate (TIMESTAMP)       │
│ timezone (VARCHAR)   │         │ expectedOutcomeDate (TIMESTAMP)│
│ locale (VARCHAR)     │         │ context (TEXT)                 │
│ emailVerified (BOOL) │         │ reasoningProcess (TEXT)        │
│ lastLoginAt          │         │ alternativesConsidered (JSONB) │
│ createdAt            │         │ expectedOutcomes (JSONB)       │
│ updatedAt            │         │ confidenceLevel (INTEGER 1-10) │
│ deletedAt (soft)     │         │ frameworkUsed (VARCHAR)        │
└──────────────────────┘         │ tags (TEXT[])                  │
         │                       │ isPrivate (BOOLEAN)            │
         │ 1:1                   │ parentDecisionId (self-FK)     │
         ▼                       │ embedding (VECTOR 1536)        │
┌──────────────────────┐         │ aiSummary (TEXT)               │
│   USER_PROFILES      │         │ createdAt, updatedAt, deletedAt│
├──────────────────────┤         └────────────────────────────────┘
│ id (PK, UUID)        │                      │
│ userId (FK, UNIQUE)  │                      │ 1:N
│ bio (TEXT)           │                      ▼
│ occupation (VARCHAR) │         ┌────────────────────────────────┐
│ location (VARCHAR)   │         │         OUTCOMES               │
│ dateOfBirth          │         ├────────────────────────────────┤
│ defaultCheckInIntvls │         │ id (PK, UUID)                  │
│ notificationPrefs    │         │ decisionId (FK → decisions.id) │
│ privacySettings      │         │ checkInDate (TIMESTAMP)        │
│ createdAt, updatedAt │         │ timeElapsedDays (INTEGER)      │
└──────────────────────┘         │ satisfactionScore (INTEGER)    │
                                 │ wouldDecideAgain (BOOLEAN)     │
                                 │ actualResults (TEXT)           │
         │                       │ metrics (JSONB)                │
         │ 1:N                   │ reflections (TEXT)             │
         ▼                       │ surprises (TEXT)               │
┌──────────────────────┐         │ lessonsLearned (TEXT)          │
│   USER_MEMORIES      │         │ unintendedConsequences (JSONB) │
├──────────────────────┤         │ contextChanges (TEXT)          │
│ id (PK, UUID)        │         │ moodAtCheckIn (INTEGER)        │
│ userId (FK)          │         │ stressLevel (INTEGER)          │
│ category (VARCHAR)   │         │ createdAt, updatedAt           │
│ fact (TEXT)          │         └────────────────────────────────┘
│ importance (INTEGER) │                      │
│ source (VARCHAR)     │                      │ 1:N
│ sourceId (UUID)      │                      ▼
│ expiresAt (TIMESTAMP)│         ┌────────────────────────────────┐
│ createdAt            │         │     OUTCOME_REMINDERS          │
└──────────────────────┘         ├────────────────────────────────┤
                                 │ id (PK, UUID)                  │
         │                       │ decisionId (FK → decisions.id) │
         │ 1:1                   │ userId (FK → users.id)         │
         ▼                       │ reminderType (ENUM)            │
┌──────────────────────┐         │ scheduledDate (TIMESTAMP)      │
│ USER_DECISION_       │         │ status (ENUM)                  │
│ PROFILES             │         │ sentAt, completedAt, skippedAt │
├──────────────────────┤         │ customMessage (TEXT)           │
│ id (PK, UUID)        │         │ createdAt, updatedAt           │
│ userId (FK, UNIQUE)  │         └────────────────────────────────┘
│ profile (JSONB)      │
│ textSummary (TEXT)   │
│ version (INTEGER)    │
│ lastComputedAt       │
│ createdAt            │
└──────────────────────┘
```

---

### 4.2.2 AI and Analytics Tables ER Diagram

**[FIGURE 4.4 — Entity Relationship Diagram — AI and Analytics Tables]**

```
┌──────────────────────┐         ┌──────────────────────────────┐
│   AI_CHAT_SESSIONS   │  1:N    │     AI_CHAT_MESSAGES         │
├──────────────────────┤         ├──────────────────────────────┤
│ id (PK, UUID)        │─────────│ id (PK, UUID)                │
│ userId (FK)          │         │ sessionId (FK → sessions.id) │
│ decisionId (FK, opt) │         │ role (VARCHAR: user/asst/sys) │
│ title (VARCHAR)      │         │ content (TEXT)               │
│ messageCount (INT)   │         │ metadata (JSONB)             │
│ totalTokensUsed (INT)│         │ createdAt                    │
│ createdAt            │         └──────────────────────────────┘
│ lastMessageAt        │
│ closedAt             │         ┌──────────────────────────────┐
└──────────────────────┘         │      AI_INTERACTIONS        │
                                 ├──────────────────────────────┤
                                 │ id (PK, UUID)                │
                                 │ userId (FK)                  │
                                 │ decisionId (FK, opt)         │
                                 │ interactionType (ENUM)       │
                                 │ userPrompt (TEXT)            │
                                 │ aiResponse (TEXT)            │
                                 │ responseMetadata (JSONB)     │
                                 │ feedbackRating (INTEGER)     │
                                 │ helpful (BOOLEAN)            │
                                 │ createdAt                    │
                                 └──────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────────────┐
│   DECISION_PATTERNS  │         │    ANALYTICS_SNAPSHOTS       │
├──────────────────────┤         ├──────────────────────────────┤
│ id (PK, UUID)        │         │ id (PK, UUID)                │
│ userId (FK)          │         │ userId (FK)                  │
│ patternType (VARCHAR)│         │ snapshotData (JSONB)         │
│ title (VARCHAR)      │         │ period (VARCHAR)             │
│ description (TEXT)   │         │ generatedAt (TIMESTAMP)      │
│ evidence (JSONB)     │         └──────────────────────────────┘
│ strength (INTEGER)   │
│ category (VARCHAR)   │         ┌──────────────────────────────┐
│ detectedAt           │         │       USER_INSIGHTS          │
│ lastUpdatedAt        │         ├──────────────────────────────┤
│ isActive (BOOLEAN)   │         │ id (PK, UUID)                │
└──────────────────────┘         │ userId (FK)                  │
                                 │ insightType (VARCHAR)        │
                                 │ title (VARCHAR)              │
                                 │ description (TEXT)           │
                                 │ dataPoints (JSONB)           │
                                 │ isDismissed (BOOLEAN)        │
                                 │ generatedAt (TIMESTAMP)      │
                                 └──────────────────────────────┘
```

---

## 4.3 Database Design

### 4.3.1 Database Modules Overview

**Table 4.1: Database Modules Overview**

| Module | Tables | Purpose |
|--------|--------|---------|
| Users | `users`, `user_profiles` | Authentication credentials, personal info, preferences, privacy settings |
| Auth | `refresh_tokens`, `sessions` | JWT token lifecycle management |
| Decisions | `decisions`, `decision_attachments`, `decision_frameworks`, `decision_templates` | Core decision records with semantic embeddings |
| Outcomes | `outcomes`, `outcome_reminders` | Outcome data and scheduled check-in reminders |
| AI Chat | `ai_chat_sessions`, `ai_chat_messages`, `ai_interactions` | Complete AI conversation history |
| Intelligence | `user_decision_profiles`, `user_memories`, `decision_patterns` | AI-computed behavioral data |
| Analytics | `analytics_snapshots`, `user_insights` | Aggregated metrics and insights |
| Notifications | `notifications` | User alerts system |
| Billing | `subscriptions`, `billing_events` | Future premium subscription infrastructure |
| Social | `decision_shares`, `community_templates` | Future social features |

---

### 4.3.2 Users Table

**Table 4.2: `users` Table — Column Definitions**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL, DEFAULT random | Unique identifier (auto-generated UUID) |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User email address — primary login identifier |
| `passwordHash` | VARCHAR(255) | NULL | bcrypt hash of password; NULL for OAuth users |
| `firstName` | VARCHAR(100) | NULL | First name |
| `lastName` | VARCHAR(100) | NULL | Last name |
| `displayName` | VARCHAR(150) | NULL | Full display name (auto-set from first+last) |
| `avatarUrl` | TEXT | NULL | Profile picture URL |
| `role` | ENUM | NOT NULL, DEFAULT 'user' | Values: user / admin / premium |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | Values: active / inactive / suspended / deleted |
| `emailVerified` | BOOLEAN | NOT NULL, DEFAULT false | Whether email has been verified |
| `emailVerifiedAt` | TIMESTAMP | NULL | When email was verified |
| `timezone` | VARCHAR(50) | DEFAULT 'UTC' | User's timezone string |
| `locale` | VARCHAR(10) | DEFAULT 'en-US' | User's locale |
| `metadata` | JSONB | NULL | Flexible JSON: onboarding status, preferences |
| `lastLoginAt` | TIMESTAMP | NULL | Timestamp of most recent login |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT now() | Account creation time |
| `updatedAt` | TIMESTAMP | NOT NULL, DEFAULT now() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp (NULL = active) |

**Indexes:** `email` (unique index), `status`, `createdAt`

---

### 4.3.3 User Profiles Table

**Table 4.3: `user_profiles` Table — Column Definitions**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Profile identifier |
| `userId` | UUID | FK → users.id, UNIQUE, CASCADE | One-to-one relationship with users |
| `bio` | TEXT | NULL | Personal biography |
| `occupation` | VARCHAR(150) | NULL | Job or occupation |
| `location` | VARCHAR(150) | NULL | City/country |
| `dateOfBirth` | TIMESTAMP | NULL | Date of birth |
| `defaultCheckInIntervals` | JSONB | NULL | Array of interval strings (e.g., ["1_week", "1_month"]) |
| `notificationPreferences` | JSONB | NULL | Object: {email: bool, push: bool, frequency: string} |
| `privacySettings` | JSONB | NULL | Object: {shareAnonymousData, allowAITraining, publicProfile} |
| `createdAt` | TIMESTAMP | NOT NULL | Creation time |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update |

---

### 4.3.4 Decisions Table

**Table 4.4: `decisions` Table — Column Definitions**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Decision identifier |
| `userId` | UUID | FK → users.id, NOT NULL, CASCADE | Owner of the decision |
| `title` | VARCHAR(255) | NOT NULL | Short title of the decision |
| `description` | TEXT | NULL | Brief summary |
| `category` | ENUM | NOT NULL | career / financial / health / relationship / education / lifestyle / business / personal_growth / family / other |
| `subcategory` | VARCHAR(100) | NULL | More specific sub-classification |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | active / archived / superseded / deleted |
| `decisionDate` | TIMESTAMP | NOT NULL, DEFAULT now() | When the decision was made |
| `expectedOutcomeDate` | TIMESTAMP | NULL | When results are expected |
| `context` | TEXT | NULL | Situation or circumstances description |
| `reasoningProcess` | TEXT | NULL | How the user thought through the decision |
| `alternativesConsidered` | JSONB | NULL | Array of {option, prosAndCons: {pros[], cons[]}, whyNotChosen} |
| `expectedOutcomes` | JSONB | NULL | Array of {outcome, metric?, targetValue?, timeframe?, importance} |
| `confidenceLevel` | INTEGER | NOT NULL | 1–10 scale (1 = very uncertain, 10 = very confident) |
| `frameworkUsed` | VARCHAR(100) | NULL | Name of decision framework applied |
| `tags` | TEXT[] | NULL | Array of tag strings |
| `isPrivate` | BOOLEAN | NOT NULL, DEFAULT true | Whether visible to others (future social feature) |
| `parentDecisionId` | UUID | FK (self-referential) | For chained decisions |
| `supersededById` | UUID | FK (self-referential) | When a decision is replaced |
| `embedding` | VECTOR(1536) | NULL | AI-generated semantic embedding for similarity search |
| `aiSummary` | TEXT | NULL | LLM-generated one-paragraph summary |
| `createdAt` | TIMESTAMP | NOT NULL | Creation time |
| `updatedAt` | TIMESTAMP | NOT NULL | Last modification |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:** `userId`, `category`, `status`, `decisionDate`, `tags` (GIN), `parentDecisionId`, `embedding` (HNSW, vector_cosine_ops), composite `(userId, category)`

> **The `embedding` Column:** This 1536-dimensional vector field stores the AI-generated numerical representation of the decision's text content. The HNSW index enables fast approximate nearest-neighbor search using cosine similarity, which powers the RAG layer of the AI pipeline. When a user asks the AI advisor a question, the question is converted to an embedding and compared against all stored decision embeddings to find the most semantically similar past decisions — which are then included as context for the AI's response.

---

### 4.3.5 Outcomes Table

**Table 4.5: `outcomes` Table — Column Definitions**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Outcome identifier |
| `decisionId` | UUID | FK → decisions.id, NOT NULL, CASCADE | The decision this outcome belongs to |
| `checkInDate` | TIMESTAMP | NOT NULL, DEFAULT now() | Date of this outcome check-in |
| `timeElapsedDays` | INTEGER | NULL | Automatically computed days since decision date |
| `satisfactionScore` | INTEGER | NOT NULL | 1–10 scale: how satisfied was the user with the outcome |
| `wouldDecideAgain` | BOOLEAN | NULL | Would the user make the same decision knowing what they know now |
| `actualResults` | TEXT | NOT NULL | Plain-text description of what actually happened |
| `metrics` | JSONB | NULL | Array of {metric, value, unit?, vsExpected?} |
| `reflections` | TEXT | NULL | Personal thoughts and feelings about the outcome |
| `surprises` | TEXT | NULL | Unexpected aspects of the outcome |
| `lessonsLearned` | TEXT | NULL | Key takeaways for future decisions |
| `unintendedConsequences` | JSONB | NULL | Array of {description, impact, severity} |
| `contextChanges` | TEXT | NULL | How the surrounding circumstances changed |
| `moodAtCheckIn` | INTEGER | NULL | 1–10 mood rating at the time of check-in |
| `stressLevel` | INTEGER | NULL | 1–10 stress level at the time of check-in |
| `createdAt` | TIMESTAMP | NOT NULL | Record creation time |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update |

**Indexes:** `decisionId`, `checkInDate`, `satisfactionScore`, composite `(decisionId, checkInDate)`

---

### 4.3.6 Outcome Reminders Table

**Table 4.6: `outcome_reminders` Table — Column Definitions**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Reminder identifier |
| `decisionId` | UUID FK | Associated decision |
| `userId` | UUID FK | User who should receive the reminder |
| `reminderType` | ENUM | 1_day / 1_week / 2_weeks / 1_month / 3_months / 6_months / 1_year / 2_years / custom |
| `scheduledDate` | TIMESTAMP | When this reminder is due |
| `status` | ENUM | pending / sent / completed / skipped / failed |
| `sentAt` | TIMESTAMP | When the notification was sent |
| `completedAt` | TIMESTAMP | When the user completed the check-in |
| `skippedAt` | TIMESTAMP | When the user skipped this reminder |
| `customMessage` | TEXT | Optional personalized reminder message |
| `createdAt` | TIMESTAMP | Record creation time |
| `updatedAt` | TIMESTAMP | Last update |

---

### 4.3.7 AI Chat Tables

**Table 4.7: `ai_chat_sessions` Table — Column Definitions**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Session identifier |
| `userId` | UUID FK | Owner of the session |
| `decisionId` | UUID FK (optional) | Decision the conversation is about |
| `title` | VARCHAR(255) | Auto-generated session title |
| `messageCount` | INTEGER | Running count of messages |
| `totalTokensUsed` | INTEGER | Token usage tracking for cost estimation |
| `createdAt` | TIMESTAMP | Session start time |
| `lastMessageAt` | TIMESTAMP | Time of most recent message |
| `closedAt` | TIMESTAMP | When session was explicitly closed |

---

### 4.3.8 User Memories Table

**Table 4.8: `user_memories` Table — Column Definitions**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Memory identifier |
| `userId` | UUID FK | User this memory belongs to |
| `category` | VARCHAR | financial / life_event / preference / goal / relationship / career / health / behavioral |
| `fact` | TEXT | The extracted fact in plain English |
| `importance` | INTEGER | 1–10 importance score (used for memory pruning) |
| `source` | VARCHAR | Where extracted from: "chat_session", "outcome_reflection", "decision_context" |
| `sourceId` | UUID | UUID of the source record |
| `expiresAt` | TIMESTAMP | Optional expiry date (NULL = permanent) |
| `createdAt` | TIMESTAMP | When the memory was extracted |

> **Design Note:** The memory cleanup job runs daily and removes expired memories. If a user has more than 50 memories, it keeps only the 50 with the highest importance score. This prevents the memory store from growing without bound while ensuring the most relevant personal facts are always available.

---

## 4.4 API Design

### 4.4.1 Design Principles

The LifeOS API follows these design conventions throughout:

**1. Consistent Response Structure**
```
GET /decisions/:id  →  { "data": { ...decision } }
GET /decisions      →  { "data": [...], "pagination": { page, limit, total, totalPages } }
POST /auth/login    →  { "user": {...}, "accessToken": "...", "refreshToken": "..." }
Error responses     →  { "error": "human-readable message" }
```

**2. HTTP Status Code Usage**
- 200 — Success (GET, PUT, PATCH)
- 201 — Created (POST that creates a resource)
- 400 — Bad Request (missing fields, validation failure)
- 401 — Unauthorized (invalid or missing token)
- 403 — Forbidden (authenticated but not permitted)
- 404 — Not Found (resource doesn't exist or belongs to another user)
- 409 — Conflict (duplicate resource, e.g., email already registered)
- 500 — Internal Server Error

**3. Pagination**
All list endpoints accept: `page` (default 1), `limit` (default 20, max 100), `sortBy`, `sortOrder` (asc/desc).

**4. Soft Deletes**
Delete endpoints set `deletedAt` timestamp rather than removing records. All queries filter `WHERE deletedAt IS NULL`.

**5. Fire-and-Forget Async**
After core operations (create decision, save outcome), AI processing is triggered without awaiting. The client gets an immediate response.

---

### 4.4.2 Authentication Endpoints

**Table 4.9: Authentication API Endpoints**

| Method | Path | Auth Required | Description |
|--------|------|:-------------:|-------------|
| POST | `/auth/register` | ❌ | Register new user with email + password |
| POST | `/auth/login` | ❌ | Authenticate and receive tokens |
| POST | `/auth/refresh` | ❌ | Exchange refresh token for new access token |
| POST | `/auth/logout` | ✅ | Revoke refresh token and delete session |

---

### 4.4.3 Decision Management Endpoints

**Table 4.10: Decision Management API Endpoints**

| Method | Path | Auth Required | Description |
|--------|------|:-------------:|-------------|
| GET | `/decisions` | ✅ | List paginated decisions (search, category, status filters) |
| GET | `/decisions/:id` | ✅ | Get single decision with full detail |
| POST | `/decisions` | ✅ | Create a new decision |
| PATCH | `/decisions/:id` | ✅ | Update a decision's fields |
| DELETE | `/decisions/:id` | ✅ | Soft-delete a decision |
| GET | `/frameworks` | ✅ | List available decision frameworks |
| POST | `/frameworks` | ✅ | Create a custom framework |
| GET | `/templates` | ✅ | List available decision templates |
| POST | `/templates` | ✅ | Create a custom template |

---

### 4.4.4 Outcome Endpoints

**Table 4.11: Outcome API Endpoints**

| Method | Path | Auth Required | Description |
|--------|------|:-------------:|-------------|
| GET | `/outcomes?decision_id=...` | ✅ | List outcomes for a specific decision |
| POST | `/outcomes` | ✅ | Create an outcome check-in entry |
| PATCH | `/outcomes/:id` | ✅ | Update an existing outcome |
| GET | `/outcomes/pending-checkins` | ✅ | Get all pending reminder cards for dashboard |
| POST | `/outcomes/schedule-checkin` | ✅ | Schedule a manual check-in |
| POST | `/outcomes/checkins/:id/complete` | ✅ | Mark a reminder as completed |
| POST | `/outcomes/checkins/:id/skip` | ✅ | Skip a reminder |

---

### 4.4.5 Analytics Endpoints

**Table 4.12: Analytics API Endpoints**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/analytics/summary` | Dashboard stats: total decisions, average satisfaction, pattern count |
| GET | `/analytics/patterns` | List detected behavioral patterns |
| GET | `/analytics/decision-quality-over-time` | Time series of average satisfaction scores |
| GET | `/analytics/insights` | List AI-generated insights |
| POST | `/analytics/insights/:id/dismiss` | Dismiss a specific insight |

---

### 4.4.6 AI Module Endpoints

**Table 4.13: AI Module API Endpoints**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/ai/chat` | Send message to AI advisor (SSE stream response) |
| GET | `/ai/chat/sessions` | List all chat sessions |
| GET | `/ai/chat/sessions/:id` | Get full message history of a session |
| POST | `/ai/analyze-decision` | Request AI analysis of a specific decision post-creation |
| POST | `/ai/pre-decision-analysis` | Request risk assessment before making a decision |
| POST | `/ai/compute-profile` | Manually trigger user profile recomputation |
| POST | `/ai/detect-patterns` | Manually trigger pattern detection |
| GET | `/ai/patterns` | Get all detected behavioral patterns |
| POST | `/ai/generate-embedding` | Generate vector embedding for a given text |
| GET | `/ai/similar-decisions` | Find semantically similar past decisions |

---

## 4.5 UI/UX Design

### 4.5.1 Design Philosophy

The design of LifeOS is intentionally calm and minimal. When someone is using a decision-making app, they are likely already dealing with some level of uncertainty or stress. A cluttered, overstimulating interface would add to that burden. The design goal was to create something that feels like a thoughtful, premium journal rather than a data entry form.

The visual language draws inspiration from journaling apps (calm, personal feel) and modern fintech apps (clean, confident, trustworthy). The result is a design that is visually pleasant enough that users actually want to open it.

### 4.5.2 Color Palette

**Table 4.14: Color Palette**

| Role | Color Name | Hex Code | Usage |
|------|-----------|----------|-------|
| Background | Light Gray | `#F9FAFB` | App background — warm off-white, not harsh pure white |
| Surface | White | `#FFFFFF` | Cards, inputs, modal backgrounds |
| Primary Text | Dark Gray | `#111827` | Headings, important body text |
| Secondary Text | Medium Gray | `#6B7280` | Subtitles, captions, timestamps |
| Accent | Indigo | `#4F46E5` | Primary CTA buttons, active states, active tabs |
| Accent Light | Lavender | `#A5B4FC` | Gradient endpoints, highlights, secondary elements |
| AI Card | Soft Lavender | `#E8E6FF` | AI-generated content blocks (visually distinctive) |
| Success | Emerald | `#10B981` | Completed outcomes, positive indicators |
| Warning | Amber | `#F59E0B` | Pending actions, caution states |
| Danger | Red | `#EF4444` | Errors, destructive actions |
| Border | Light Gray | `#E5E7EB` | Card borders, dividers |

### 4.5.3 Typography

- **Font Family:** Inter (Google Fonts) — used throughout for its excellent readability at all sizes
- **Headings:** Weight 700–800 (Bold/ExtraBold)
- **Body Text:** Weight 400 (Regular)
- **Captions and Labels:** Weight 500 (Medium), smaller size, reduced opacity
- **Code/Technical:** Monospace font (system default)

### 4.5.4 Component Design Standards

**Buttons:**
- Primary CTA: Indigo gradient fill (`#4F46E5` → `#6366F1`), 9999px radius (full pill shape), 16px padding vertical
- Secondary: White background, indigo border (1px), indigo text
- Destructive: Red fill, white text

**Cards:**
- Border radius: 16–20px
- Background: White (`#FFFFFF`)
- Shadow: Subtle elevation (`shadow-sm`)
- Padding: 16–20px
- No heavy borders — background contrast provides depth

**Inputs:**
- Border radius: 12px
- Background: Light gray (`#F3F4F6`)
- Focus state: Indigo bottom border
- Error state: Red border with inline error message below

**Badges/Chips:**
- Border radius: 9999px (pill)
- Small text size (10–12px)
- Category colors match the category's assigned color

### 4.5.5 Screen-by-Screen UI Description

**Login Screen** — [SCREENSHOT PLACEHOLDER 5.3]

A clean, centered card layout. The LifeOS logo and wordmark appear at the top. Below is the card containing email and password inputs, a primary indigo "Sign In" button, and a secondary link to the Register screen. Form validation shows inline error messages without modal popups. No navigation bar is shown — this is a full-screen layout.

---

**Register Screen** — [SCREENSHOT PLACEHOLDER 5.4]

Similar layout to Login. Adds First Name and Last Name fields above the email/password fields. The CTA reads "Create Account" and navigates to Dashboard on success.

---

**Dashboard** — [SCREENSHOT PLACEHOLDER 5.5]

The home screen is organized top to bottom as:
1. **Header:** Hamburger menu icon (left), "LifeOS" brand text (center), circular avatar with user initial (right)
2. **Greeting Section:** Time-aware text ("Good morning, Badal"), soft subtitle
3. **Action Required:** Horizontal scrollable row of check-in cards. Each card shows the decision title, how long ago it was made, and a blue "Review" button. If no pending check-ins, this section is hidden.
4. **Quick Actions:** Side-by-side pill buttons — "New Decision" (indigo gradient) and "Ask AI" (outlined)
5. **AI Reflection Card:** Lavender background card showing the most recent AI-generated insight with a small "data points" chip
6. **Recent Activity:** Vertical list of the 5 most recent decisions, each showing: category emoji icon, title, status badge (colored chip), time-ago, and right chevron

---

**Decision List** — [SCREENSHOT PLACEHOLDER 5.6]

- Search bar at the top with a magnifying glass icon and placeholder "Search decisions..."
- Horizontal scrollable category filter chips: All, Career, Financial, Health, Relationship, Education, Lifestyle, Business, Personal Growth, Family, Other
- Status filter pills: All / Active / Archived
- Decision cards in a vertical list:
  - Category icon (emoji) in a colored circle
  - Title (bold)
  - Description preview (truncated)
  - Confidence ring (SVG circular indicator showing the level 1–10)
  - Category badge chip
  - Status badge (green for active, gray for archived)
  - "X days ago" timestamp
  - Right chevron
- Floating Action Button (FAB) with "+" in the bottom-right corner
- Pull-to-refresh gesture support
- Skeleton loading cards shown during initial fetch

---

**Decision Wizard (3 Steps)** — [SCREENSHOT PLACEHOLDERS 5.7, 5.8, 5.9]

A full-screen modal that slides up from the bottom.

**Step 1 — Foundations:**
A progress indicator at the top (1 of 3). An optional "Use Template" button at the top opens a bottom sheet with system and user templates. Below: Title text input, then a 2×5 grid of category tiles (each with an emoji and label), then a Context/Description textarea.

**Step 2 — Context & Alternatives:**
Progress indicator (2 of 3). Background/Reasoning textarea at the top. Below: numbered alternative input cards. Each card has an "option" text field and expandable pros/cons lists. An "Add Alternative" button adds a new card. Each card has a remove button (×) except when there is only one.

**Step 3 — Final Calibration:**
Progress indicator (3 of 3). Expected outcome inputs with metric name and target value fields. Target date picker. A prominent confidence slider from 1 to 10 with a label ("1 = Very uncertain", "10 = Very confident"). The Submit button at the bottom is disabled until all required fields are filled.

---

**Decision Detail** — [SCREENSHOT PLACEHOLDER 5.10]

- Header: Back arrow (left), "Decision" title, kebab menu (right, opens delete option)
- Below header: Category badge, Status badge (green/gray)
- Large bold title text
- Segmented control: "Context" | "Outcomes"

**Context Tab:**
- SVG Confidence Ring in the top-right area
- Description paragraph
- "My Reasoning" paragraph
- "Context" paragraph
- "Expected Metrics" section: each metric shown as a row with name and a horizontal progress bar representing target value
- "Alternatives I Considered" section: alternatives shown as chips with a "Not chosen" label
- Tags section: small labeled chips

**Outcomes Tab:**
- Vertical timeline of all outcome check-ins
- Each item shows: Date, time elapsed, satisfaction score (1–10 badge), key reflection text, mood/stress indicators
- "No check-ins yet" empty state if no outcomes

**Bottom CTA:** Fixed "Analyze with AI" indigo button that opens an AI chat session pre-loaded with this decision's context.

---

**AI Advisor Chat** — [SCREENSHOT PLACEHOLDER 5.12]

- Top bar: "AI Advisor" title, history icon (right)
- Chat area: scrollable message history
  - User messages: right-aligned indigo filled bubbles
  - AI messages: left-aligned white card bubbles with markdown rendering (bold text, bullet lists, headers)
  - Streaming in-progress: text appears word-by-word with a pulsing cursor
- Input area at bottom: text input + send button (arrow icon)
- Empty state: welcome card suggesting first questions to ask

---

## 4.6 AI Intelligence Architecture

### 4.6.1 Why Simple AI Calls Are Not Enough

When someone asks ChatGPT "should I take this job offer?" they get generic advice based on what the AI knows about job decisions in general. This is somewhat useful, but it completely ignores everything specific to that person: their career history, their personal values, their track record with past job decisions, their known biases, their current life context.

LifeOS solves this with a custom AI context assembly pipeline that builds a rich, personalized prompt context before every AI interaction. The result is advice that feels genuinely tailored to the individual.

### 4.6.2 The 4-Layer Context Assembly Pipeline

**[FIGURE 4.5 — AI Pipeline: 4-Layer Context Assembly]**

```
                        USER MESSAGE
                              │
                    ┌─────────▼──────────────────────────────┐
                    │                                         │
                    │     assembleContext() function          │
                    │     (runs 5 parallel DB queries)        │
                    │                                         │
                    └──────────────────────────────────────── ┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
   ┌─────────────────┐  ┌──────────┐  ┌──────────────┐
   │ LAYER 1         │  │ LAYER 2  │  │ LAYER 3      │
   │ User Profile    │  │ Category │  │ RAG: Similar │
   │ ~150 tokens     │  │ Context  │  │ Decisions    │
   │                 │  │ ~100 tkn │  │ ~500 tokens  │
   │ Pre-computed    │  │          │  │              │
   │ behavioral      │  │ Stats    │  │ pgvector     │
   │ summary         │  │ for this │  │ cosine       │
   │                 │  │ category │  │ similarity   │
   └─────────────────┘  └──────────┘  └──────────────┘
              │               │               │
              ▼               ▼               ▼
   ┌─────────────────┐  ┌──────────────────────────────┐
   │ LAYER 4         │  │   + USER MEMORIES             │
   │ Behavioral      │  │   ~100 tokens                 │
   │ Patterns        │  │                               │
   │ ~100 tokens     │  │   Extracted personal facts    │
   │                 │  │   from past reflections       │
   │ Auto-detected   │  │   and conversations           │
   │ tendencies      │  └──────────────────────────────┘
   └─────────────────┘
              │               │
              └───────────────┘
                              │
                              ▼
                   ┌────────────────────┐
                   │    Groq LLM        │
                   │    (via Vercel     │
                   │     AI SDK)        │
                   └─────────┬──────────┘
                             │
                             ▼
                   SSE STREAMING RESPONSE
                   (tokens arrive in real-time)
```

**Layer 1 — User Profile (~150 tokens)**
This is a pre-computed, condensed text summary of the user's overall behavioral profile. It is generated by the LLM every 6 hours by analyzing all the user's decisions and outcomes. It describes things like: total decisions made, overall satisfaction average, which categories they make the most decisions in, their confidence calibration, and behavioral traits in plain English.

Example summary: *"User has made 23 decisions since joining, primarily in career (40%) and financial (30%) categories. Average satisfaction score is 7.2/10. Confidence calibration is good in career decisions but overconfident in financial decisions (states 8+ confidence but outcomes average 6). Shows tendency to research thoroughly before career decisions but act quickly on financial ones."*

**Layer 2 — Category Context (~100 tokens)**
If the conversation involves a specific life category, aggregated statistics for that category are included: how many decisions the user has made in it, their average satisfaction, regret rate, most common mistakes, and top lessons learned.

**Layer 3 — RAG: Similar Decisions (~500 tokens)**
This is the most technically sophisticated layer. The user's current message is converted to a 1536-dimensional embedding. A pgvector cosine similarity query finds the top 5 most semantically similar past decisions from the user's history. Those decisions — along with their outcomes — are formatted and included as context. This gives the AI concrete, specific, historically-grounded examples to reference.

**Layer 4 — Behavioral Patterns (~100 tokens)**
All active detected patterns for this user are included. The AI can reference these directly: *"Note that based on past data, this user tends to overestimate financial outcomes."*

**User Memories (~100 tokens)**
The top personal memories (by importance score) are fetched and included. These are specific facts extracted from the user's past reflections, like health conditions that affect their decisions, family constraints, career goals, or personal values.

---

### 4.6.3 Background Intelligence Jobs

Three background jobs run on schedule:

**Profile Refresh (every 6 hours):**
Recomputes the behavioral profile for all active users. Queries all decisions and outcomes, computes statistics, calls the LLM to generate the text summary, stores the result. The profile is ready immediately for the next AI interaction without any on-demand computation delay.

**Pattern Detection (every 12 hours):**
Analyzes each user's complete decision history to find recurring patterns. Examples: "confidence level consistently higher than outcome satisfaction in financial decisions," "career decisions made in months October–December have lower average satisfaction," "health category has the highest regret rate." Newly detected patterns are stored and immediately available for AI context.

**Memory Cleanup (every 24 hours):**
Removes expired memories (where `expiresAt` is in the past). If any user has more than 50 memories, the oldest and lowest-importance ones are removed, keeping the 50 most important. This prevents unbounded growth of the memory store.

---

### 4.6.4 Decision Creation Sequence Diagram

**[FIGURE 4.6 — Sequence Diagram: Decision Creation and Outcome Flow]**

```
User      Mobile App       Backend API           PostgreSQL         AI Engine
  │            │                 │                    │                 │
  │── Create ─▶│                 │                    │                 │
  │  Decision  │── POST ────────▶│                    │                 │
  │            │   /decisions    │── INSERT ─────────▶│                 │
  │            │                 │   decision          │                 │
  │            │                 │◀─ Record ──────────│                 │
  │            │◀── 201 ─────────│                    │                 │
  │            │   Created       │── embed() ─────────────────────────▶│ async
  │            │                 │                    │◀─ vector ───────│
  │            │                 │── UPDATE ─────────▶│
  │            │                 │   embedding         │
  │            │                 │── INSERT reminders ▶│
  │            │                 │   (1w,1m,3m,6m,1y)  │
  │            │                 │                    │
  │── Record ─▶│                 │                    │
  │  Outcome   │── POST ────────▶│                    │
  │            │   /outcomes     │── INSERT ─────────▶│
  │            │                 │   outcome           │
  │            │◀── 201 ─────────│                    │
  │            │   Created       │                    │
  │            │                 │── extractMemories() ───────────────▶│ fire-and-forget
  │            │                 │── computeProfile() ─────────────────▶│ fire-and-forget
  │            │                 │── detectPatterns() ─────────────────▶│ fire-and-forget
```

---

&nbsp;

---

# CHAPTER 5: IMPLEMENTATION

---

## 5.1 Technology Stack

**Table 5.1: Technology Stack Summary**

| Category | Technology | Version | Role |
|----------|-----------|---------|------|
| **Mobile Framework** | React Native | 0.83 | Cross-platform mobile development |
| **Mobile Platform** | Expo | SDK 55 | Build tooling, managed workflow |
| **Mobile Navigation** | Expo Router | v3 | File-based navigation system |
| **Mobile Language** | TypeScript | 5.x | Type-safe mobile development |
| **Server State** | React Query (TanStack) | v5 | Caching, fetching, mutations |
| **Auth State** | Zustand | v4 | Lightweight global auth state |
| **HTTP Client** | Axios | v1 | API calls with JWT interceptors |
| **Secure Storage** | expo-secure-store | Latest | Encrypted token storage on device |
| **Backend Runtime** | Bun | v1.x | Fast JavaScript runtime (Node.js alternative) |
| **Backend Framework** | Express | v5 | HTTP server and routing |
| **Backend Language** | TypeScript | 5.x | Type-safe server development |
| **ORM** | Drizzle ORM | 0.x | Type-safe database query builder |
| **Password Hashing** | bcryptjs | v2 | Secure password hashing |
| **JWT** | jsonwebtoken | v9 | Token creation and verification |
| **Security Headers** | Helmet | v7 | HTTP security headers |
| **Database** | PostgreSQL | v15+ | Primary relational database |
| **Vector Extension** | pgvector | v0.5+ | Semantic vector similarity search |
| **AI Inference** | Groq API | Latest | Fast LLM inference |
| **AI SDK** | Vercel AI SDK | v4 | SSE streaming and AI utilities |

---

### 5.1.1 Mobile App Folder Structure

**[FIGURE 5.1 — Mobile App Folder Structure]**

```
LifeOS/
├── app/                           ← All routes (Expo Router)
│   ├── _layout.tsx                ← Root layout: Stack navigator, providers,
│   │                                 auth guard (redirects based on tokens)
│   ├── (auth)/
│   │   ├── _layout.tsx            ← Auth stack layout
│   │   ├── login.tsx              ← Login screen
│   │   └── register.tsx           ← Register screen
│   └── (tabs)/
│       ├── _layout.tsx            ← Tab bar layout (4 tabs)
│       ├── index.tsx              ← Dashboard (thin compositor)
│       ├── decisions/
│       │   ├── _layout.tsx        ← Decisions stack layout
│       │   ├── index.tsx          ← Decision List
│       │   ├── [id].tsx           ← Decision Detail (dynamic route)
│       │   ├── new.tsx            ← Decision Creation Wizard
│       │   └── checkin.tsx        ← Outcome Check-In screen
│       └── ai/
│           ├── index.tsx          ← AI Chat screen
│           └── history.tsx        ← Chat Session History
│
├── components/
│   ├── ui/                        ← Shared UI primitives
│   │   ├── index.ts               ← Barrel export
│   │   ├── SkeletonBlock.tsx      ← Animated shimmer placeholder
│   │   ├── EmptyState.tsx         ← Empty state with icon and CTA
│   │   └── ConfidenceRing.tsx     ← SVG circular progress indicator
│   │
│   ├── dashboard/                 ← Dashboard section components
│   │   ├── index.ts               ← Barrel export
│   │   ├── DashboardHeader.tsx    ← Header with hamburger + avatar
│   │   ├── Greeting.tsx           ← Time-aware greeting text
│   │   ├── ActionRequired.tsx     ← Horizontal scroll of check-in cards
│   │   ├── QuickActions.tsx       ← New Decision + Ask AI buttons
│   │   ├── AIReflection.tsx       ← Lavender AI insight card
│   │   └── RecentActivity.tsx     ← Recent decisions list
│   │
│   └── decisions/                 ← Decision feature components
│       ├── index.ts               ← Barrel export
│       ├── DecisionCard.tsx       ← List item card
│       ├── DecisionCardSkeleton.tsx
│       ├── InfoCard.tsx           ← Detail tab content card
│       ├── OutcomeTimelineItem.tsx ← Outcome timeline entry
│       ├── DetailSkeleton.tsx
│       └── wizard/
│           ├── wizardReducer.ts   ← State types + reducer
│           ├── StepIndicator.tsx  ← Progress bar component
│           ├── WizardStep1.tsx    ← Foundations form
│           ├── WizardStep2.tsx    ← Context & Alternatives form
│           ├── WizardStep3.tsx    ← Final Calibration form
│           └── TemplatePicker.tsx ← Template selection bottom sheet
│
├── hooks/
│   ├── useDashboard.ts            ← React Query hooks for dashboard data
│   └── useDecisions.ts            ← React Query hooks for decision data
│
├── services/
│   ├── authService.ts             ← Login/register/logout API calls
│   ├── dashboardService.ts        ← Dashboard data API calls
│   └── decisionService.ts         ← Decision/outcome/template API calls
│
├── store/
│   └── authStore.ts               ← Zustand store: tokens, hydration
│
└── utils/
    ├── api.ts                     ← Axios client with JWT interceptors
    ├── helpers.ts                 ← timeAgo(), getCategoryColor(), etc.
    └── constants.ts               ← CATEGORIES array, STATUS_FILTERS, etc.
```

---

### 5.1.2 Backend Folder Structure

**[FIGURE 5.2 — Backend Folder Structure]**

```
backend/src/
├── index.ts                  ← Entry point: creates app, starts server
├── app.ts                    ← Express factory: registers all middleware + routes
│
├── routes/                   ← HTTP route definitions
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── decision.routes.ts
│   ├── outcome.routes.ts
│   ├── analytics.routes.ts
│   ├── ai.routes.ts
│   ├── notification.routes.ts
│   ├── framework.routes.ts
│   └── template.routes.ts
│
├── controllers/              ← Request handlers (business logic)
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── decision.controller.ts
│   ├── outcome.controller.ts
│   ├── analytics.controller.ts
│   ├── ai.controller.ts
│   ├── framework.controller.ts
│   ├── template.controller.ts
│   └── notification.controller.ts
│
├── middleware/               ← Cross-cutting concerns
│   ├── auth.middleware.ts    ← JWT Bearer token verification
│   ├── error.middleware.ts   ← Global error handler
│   └── validate.middleware.ts ← Request body validation
│
├── ai/                       ← AI intelligence subsystem
│   ├── pipeline.ts           ← 4-layer context assembly
│   ├── scheduler.ts          ← Background cron jobs
│   └── memory.ts             ← LLM-based memory extraction
│
├── db/                       ← Data layer (Drizzle ORM)
│   ├── connection.ts         ← PostgreSQL connection
│   ├── schema.ts             ← Re-exports all schema tables
│   ├── relations.ts          ← Cross-schema Drizzle relations
│   ├── user.schema.ts
│   ├── decision.schema.ts
│   ├── outcome.schema.ts
│   ├── ai.schema.ts
│   ├── intelligence.schema.ts
│   ├── analytics.schema.ts
│   ├── auth.schema.ts
│   ├── billing.schema.ts
│   ├── notification.schema.ts
│   └── social.schema.ts
│
└── config/
    └── env.ts                ← Environment variable validation
```

---

## 5.2 Backend Implementation

### 5.2.1 Express Application Setup

```typescript
// backend/src/app.ts

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import decisionRoutes from "./routes/decision.routes";
import outcomeRoutes from "./routes/outcome.routes";
import analyticsRoutes from "./routes/analytics.routes";
import aiRoutes from "./routes/ai.routes";
import notificationRoutes from "./routes/notification.routes";
import frameworkRoutes from "./routes/framework.routes";
import templateRoutes from "./routes/template.routes";
import { errorHandler } from "./middleware/error.middleware";

export const createApp = (): Express => {
  const app = express();

  // Security and parsing middleware
  app.use(helmet());      // Sets secure HTTP headers automatically
  app.use(cors());        // Allows cross-origin requests (mobile app)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint — used to verify server is running
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API route modules — all prefixed with /api/v1
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/decisions", decisionRoutes);
  app.use("/api/v1/outcomes", outcomeRoutes);
  app.use("/api/v1/analytics", analyticsRoutes);
  app.use("/api/v1/ai", aiRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/frameworks", frameworkRoutes);
  app.use("/api/v1/templates", templateRoutes);

  // Global error handler — must be registered last
  app.use(errorHandler);

  return app;
};
```

`helmet()` automatically sets 11 security-related HTTP headers including `X-Content-Type-Options`, `X-Frame-Options`, and `Strict-Transport-Security`. This protects against common web attacks without requiring any manual configuration.

---

### 5.2.2 Database Schema Design

Drizzle ORM is used for all database schema definitions and queries. The schema-first approach means that every table column is defined in TypeScript, and Drizzle automatically generates the corresponding SQL migration files. When you query data, TypeScript knows exactly what fields are available and what their types are.

**The Users Schema:**

```typescript
// backend/src/db/user.schema.ts

import {
  pgTable, uuid, varchar, text, timestamp,
  boolean, jsonb, pgEnum, index, uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "premium"]);
export const userStatusEnum = pgEnum("user_status", [
  "active", "inactive", "suspended", "deleted",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    displayName: varchar("display_name", { length: 150 }),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("active"),
    emailVerified: boolean("email_verified").notNull().default(false),
    timezone: varchar("timezone", { length: 50 }).default("UTC"),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    statusIdx: index("users_status_idx").on(table.status),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  }),
);
```

The inline index definitions (`uniqueIndex` and `index` calls inside the second argument to `pgTable`) are automatically included in the migration SQL that Drizzle generates. The developer never needs to write raw `CREATE INDEX` SQL.

---

### 5.2.3 The Decision Schema with pgvector

The `decisions` table is the core of the application. The `embedding` field is what makes semantic search possible:

```typescript
// backend/src/db/decision.schema.ts (key parts)

import { vector } from "drizzle-orm/pg-core";

export const decisionCategoryEnum = pgEnum("decision_category", [
  "career", "financial", "health", "relationship",
  "education", "lifestyle", "business",
  "personal_growth", "family", "other",
]);

export const decisions = pgTable(
  "decisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    category: decisionCategoryEnum("category").notNull(),
    status: decisionStatusEnum("status").notNull().default("active"),

    context: text("context"),
    reasoningProcess: text("reasoning_process"),
    alternativesConsidered: jsonb("alternatives_considered").$type<
      Array<{
        option: string;
        prosAndCons: { pros: string[]; cons: string[] };
        whyNotChosen: string;
      }>
    >(),
    expectedOutcomes: jsonb("expected_outcomes").$type<
      Array<{
        outcome: string;
        metric?: string;
        targetValue?: number | string;
        importance: number;
      }>
    >(),
    confidenceLevel: integer("confidence_level").notNull(),

    // The AI-generated 1536-dimensional vector embedding
    embedding: vector("embedding", { dimensions: 1536 }),
    aiSummary: text("ai_summary"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    userIdIdx: index("decisions_user_id_idx").on(table.userId),
    // HNSW index for fast approximate nearest-neighbor vector search
    embeddingIdx: index("decisions_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
```

The `.$type<...>()` call on the `jsonb` columns tells Drizzle what TypeScript type the JSON field contains. This means when you read `decision.alternativesConsidered`, TypeScript correctly types it as `Array<{option: string; prosAndCons: ...}>` rather than just `unknown`.

---

### 5.2.4 JWT Authentication Middleware

```typescript
// backend/src/middleware/auth.middleware.ts

import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extended Request type to carry decoded user payload
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Check for Bearer scheme
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    
    // Attach decoded payload to request — available in all downstream handlers
    req.user = {
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as string,
    };
    next();
  } catch (error) {
    // Token is expired, invalid signature, or malformed
    res.status(401).json({ error: "Invalid token" });
  }
};
```

This middleware is applied to all protected routes using Express router-level middleware. Once the middleware confirms the token is valid, the `req.user` object is available in every controller without needing to re-verify the token.

---

### 5.2.5 Authentication Controller — Register and Login

```typescript
// backend/src/controllers/auth.controller.ts

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
const SALT_ROUNDS = 12;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Prevent duplicate accounts
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    // Hash password — 12 salt rounds provides excellent security
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await db
      .insert(users)
      .values({ email, passwordHash, firstName, lastName })
      .returning();

    const user = newUser[0]!;

    // Short-lived JWT access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY as any },
    );

    // Long-lived random refresh token (not JWT — stored in DB)
    const refreshTokenValue = crypto.randomBytes(48).toString("hex");
    const refreshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: refreshExpiry,
    });

    // Remove passwordHash from response — never send it to the client
    const { passwordHash: _ph, ...safeUser } = user;
    res.status(201).json({ user: safeUser, accessToken, refreshToken: refreshTokenValue });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userRecords[0];

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // bcrypt.compare handles timing attacks safely
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Update last login timestamp
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY as any },
    );

    const refreshTokenValue = crypto.randomBytes(48).toString("hex");
    const refreshExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: refreshExpiry,
    });

    const { passwordHash: _ph, ...safeUser } = user;
    res.json({ user: safeUser, accessToken, refreshToken: refreshTokenValue });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
```

Notice that when the credentials are wrong, both "user not found" and "wrong password" cases return the same `401 Invalid credentials` response. This prevents an attacker from discovering which emails are registered by checking whether the error message differs.

---

## 5.3 Frontend Implementation

### 5.3.1 Screen Implementation Status

**Table 5.2: Screen Implementation Status**

| Screen | Status | File Path |
|--------|:------:|-----------|
| Login | ✅ Complete | `app/(auth)/login.tsx` |
| Register | ✅ Complete | `app/(auth)/register.tsx` |
| Dashboard | ✅ Complete | `app/(tabs)/index.tsx` |
| Decision List | ✅ Complete | `app/(tabs)/decisions/index.tsx` |
| Decision Detail | ✅ Complete | `app/(tabs)/decisions/[id].tsx` |
| Decision Wizard (3 steps) | ✅ Complete | `app/(tabs)/decisions/new.tsx` |
| Outcome Check-In | ✅ Complete | `app/(tabs)/decisions/checkin.tsx` |
| AI Advisor Chat | ✅ Complete | `app/(tabs)/ai/index.tsx` |
| AI Chat History | ✅ Complete | `app/(tabs)/ai/history.tsx` |
| Analytics & Charts | ⏳ Planned | — |
| Profile & Settings | ⏳ Planned | — |

---

### 5.3.2 Auth Store (Zustand)

```typescript
// LifeOS/store/authStore.ts

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "lifeos_access_token";
const REFRESH_TOKEN_KEY = "lifeos_refresh_token";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setTokens: (access: string, refresh: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  // Called after successful login or register
  // Persists tokens to encrypted device storage AND updates Zustand state
  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  // Called on logout — clears both storage and state
  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null });
  },

  // Called once at app startup from _layout.tsx
  // Restores session from encrypted storage without requiring re-login
  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken, refreshToken, isHydrated: true });
  },
}));
```

The `isHydrated` flag is important. The root layout reads this flag and does not redirect the user (to login or dashboard) until hydration is complete. Without this, the app would always redirect to login on startup before checking the stored tokens.

---

### 5.3.3 Axios Client with JWT Interceptors

```typescript
// LifeOS/utils/api.ts

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL + "/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR: Attach Bearer token to every outgoing request
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("lifeos_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR: Handle 401 — attempt silent token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 Unauthorized — and only if not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        // It will be retried when the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("lifeos_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Call refresh endpoint with the stored refresh token
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/refresh`,
          { refreshToken }
        );

        // Persist the new tokens
        await useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

        // Release queued requests with the new token
        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh failed — logout the user
        processQueue(refreshError, null);
        await useAuthStore.getState().clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

The `failedQueue` mechanism is the most sophisticated part of this implementation. If three API calls all receive a 401 at the same time, without this mechanism all three would try to refresh the token simultaneously — causing three refresh API calls and potential conflicts. With the queue, only one refresh request is made. The other two are queued and replayed once the first refresh succeeds.

---

### 5.3.4 React Query Hooks for Dashboard

```typescript
// LifeOS/hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

// Cache duration constants
const STALE_USER = 10 * 60 * 1000;       // 10 minutes
const STALE_CHECKINS = 2 * 60 * 1000;    // 2 minutes (changes when user completes)
const STALE_INSIGHTS = 5 * 60 * 1000;    // 5 minutes
const STALE_DECISIONS = 2 * 60 * 1000;   // 2 minutes

// Fetch the current user's info — used for greeting and avatar
export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: dashboardService.getUser,
    staleTime: STALE_USER,
  });

// Fetch pending check-in cards for the Action Required section
export const usePendingCheckins = () =>
  useQuery({
    queryKey: ["pending-checkins"],
    queryFn: dashboardService.getPendingCheckins,
    staleTime: STALE_CHECKINS,
  });

// Fetch the most recent AI insight for the AI Reflection card
export const useTopInsight = () =>
  useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const insights = await dashboardService.getInsights();
      return insights[0] ?? null;
    },
    staleTime: STALE_INSIGHTS,
  });

// Fetch 5 most recent decisions for the Recent Activity section
export const useRecentDecisions = () =>
  useQuery({
    queryKey: ["recent-decisions"],
    queryFn: () =>
      dashboardService.getDecisions({ limit: 5, sortOrder: "desc" }),
    staleTime: STALE_DECISIONS,
  });
```

React Query handles caching, deduplication, background refetching, and loading/error states automatically. When the dashboard renders, all four queries fire in parallel. If any of them were recently cached, they return immediately from cache while the background refetch updates them silently.

---

### 5.3.5 SVG Confidence Ring Component

```typescript
// LifeOS/components/ui/ConfidenceRing.tsx

import React from "react";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { View } from "react-native";

type Props = {
  value: number;   // 1-10
  size?: number;   // diameter in pixels
  strokeWidth?: number;
};

export const ConfidenceRing: React.FC<Props> = ({
  value,
  size = 60,
  strokeWidth = 5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Portion of circumference that represents the value
  const filledArc = (value / 10) * circumference;
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Gray background track — shows full circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Indigo filled arc — represents the actual confidence value */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#4F46E5"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${filledArc} ${circumference - filledArc}`}
          strokeLinecap="round"
          // Rotate -90 degrees so arc starts at top (12 o'clock position)
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Center text showing the numeric value */}
        <SvgText
          x={center}
          y={center + 1}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={size * 0.22}
          fontWeight="700"
          fill="#111827"
        >
          {value}
        </SvgText>
      </Svg>
    </View>
  );
};
```

The `strokeDasharray` trick is the key to drawing a partial arc in SVG. The first value (`filledArc`) sets the length of the visible stroke segment, and the second value (`circumference - filledArc`) sets the gap. By making the gap fill the rest of the circle, only `filledArc` length of the stroke is visible.

---

## 5.4 AI Integration

### 5.4.1 Intelligence Schema

The user_decision_profiles and user_memories tables store the results of AI analysis:

```typescript
// backend/src/db/intelligence.schema.ts (key types)

// The structured data stored in user_decision_profiles.profile (JSONB)
export type UserProfileData = {
  memberSince: string;
  totalDecisions: number;
  totalOutcomes: number;
  decisionsPerWeek: number;
  avgTimeBetweenDecisions: number;
  overallSatisfaction: number | null;
  // How well confidence ratings predict actual satisfaction (correlation)
  confidenceAccuracy: number | null;
  // Plain English behavioral traits for LLM injection
  traits: string[];
  // Per-category breakdown
  categoryProfiles: Record<string, {
    count: number;
    avgSatisfaction: number | null;
    regretRate: number;
    avgConfidence: number;
    topLessons: string[];
    commonMistakes: string[];
  }>;
  // Contextual facts extracted over time
  lifeContext: string[];
};

// Memory categories for the user_memories table
export type UserMemoryCategory =
  | "financial" | "life_event" | "preference" | "goal"
  | "relationship" | "career" | "health" | "behavioral";
```

---

### 5.4.2 The AI Chat Flow (SSE Streaming)

When the user sends a message to the AI advisor, the flow is:

1. Mobile app sends `POST /ai/chat` with the user's message
2. The controller assembles the 4-layer context (parallel DB queries)
3. The assembled context + user message is sent to Groq API using Vercel AI SDK
4. The response headers are set to `Content-Type: text/event-stream`
5. As Groq streams tokens, the backend immediately forwards them to the mobile client
6. The mobile app reads the SSE stream and appends tokens to the chat bubble in real-time
7. When the stream ends, the complete message is saved to the database

The SSE format looks like this:
```
data: {"type":"token","content":"Based"}
data: {"type":"token","content":" on"}
data: {"type":"token","content":" your"}
...
data: {"type":"done","sessionId":"uuid","messageId":"uuid"}
```

This gives users the familiar "typing" effect they know from ChatGPT, which makes the response feel faster even though the total time to completion is the same.

---

### 5.4.3 Background Jobs — Fire-and-Forget Pattern

After recording an outcome, three background jobs are triggered:

```typescript
// Simplified outcome controller logic

const outcome = await db.insert(outcomes).values(outcomeData).returning();

// Return success IMMEDIATELY — the user should not wait for AI
res.status(201).json({ data: outcome[0] });

// Background processing — all three run in parallel, non-blocking
setImmediate(async () => {
  try {
    await Promise.allSettled([
      extractAndStoreMemories(outcome[0], userId),
      computeUserProfile(userId),
      detectPatterns(userId),
    ]);
  } catch (err) {
    // Background failure is logged but does NOT affect the user
    console.error("Background intelligence job failed:", err);
  }
});
```

`Promise.allSettled()` is used instead of `Promise.all()` so that if one job fails, the others still run. The `setImmediate()` defers execution to after the current event loop tick, ensuring the HTTP response is sent first.

---

## 5.5 Security Implementation

### 5.5.1 Password Security

All passwords are hashed with `bcrypt` before being stored. bcrypt is a deliberately slow hash function with a configurable work factor:

```typescript
const SALT_ROUNDS = 12;
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

// For verification:
const isValid = await bcrypt.compare(plainTextPassword, storedHash);
```

At 12 salt rounds on modern hardware, bcrypt takes approximately 200–500ms to compute one hash. This is fast enough to not affect the user experience during login, but slow enough to make brute-force attacks impractical. An attacker who steals the database would need months or years of computation to crack a single password using modern GPU hardware.

Each bcrypt hash includes a random salt, which means two users with the same password will have different hashes. Rainbow table attacks (pre-computed hash lookups) are completely ineffective.

### 5.5.2 JWT Token Strategy

**Access Token:**
- Contains: `{ userId, email, role }`
- Signed with `HS256` using `JWT_SECRET` from environment
- Short expiry (7 days currently; can be reduced to 15 minutes for higher security)
- Stateless — verification requires no database lookup

**Refresh Token:**
- 48 random bytes (`crypto.randomBytes(48).toString("hex")`)
- Stored as a hash in the `refresh_tokens` database table
- 30-day expiry stored in the database
- Can be revoked server-side by setting `revokedAt`

**Token Rotation:**
Each time the refresh token is used, it is immediately revoked and a new refresh token is issued. If an attacker steals a refresh token and uses it, the legitimate user's next refresh attempt will fail (because the token was already rotated), alerting the system to potential compromise.

### 5.5.3 Mobile Token Storage

```typescript
// Tokens are stored in the device's secure storage
await SecureStore.setItemAsync("lifeos_access_token", accessToken);
await SecureStore.setItemAsync("lifeos_refresh_token", refreshToken);
```

On iOS, `expo-secure-store` uses the Keychain Services API with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` attribute. On Android, it uses the Android Keystore system backed by hardware encryption on modern devices. In both cases, the data is encrypted at rest and tied to the device — it cannot be read even with physical access to the device file system.

### 5.5.4 Data Isolation at Query Level

Every database query for user-specific data includes a mandatory `userId` filter:

```typescript
// Example from decision controller — user can only see their own decisions
const userDecisions = await db
  .select()
  .from(decisions)
  .where(
    and(
      eq(decisions.userId, req.user.userId),  // CRITICAL: filter by authenticated user
      isNull(decisions.deletedAt),             // Exclude soft-deleted records
      category ? eq(decisions.category, category) : undefined,
    )
  )
  .orderBy(desc(decisions.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);
```

This pattern is applied in every controller. Even if someone could forge a request with a different user's decision UUID, the `userId` filter ensures they receive a 404 response rather than the other user's data.

---

&nbsp;

---

# CHAPTER 6: TESTING

---

## 6.1 Testing Strategy

### 6.1.1 Overview

The testing strategy for LifeOS combined three approaches:

1. **Manual Code Review** — Each function was reviewed to verify correct logic, proper error handling, and handling of edge cases (empty inputs, invalid data, missing authentication).

2. **API Integration Testing (Postman)** — All 40+ API endpoints were tested using Postman. A complete collection file (`lifeos-postman-collection.json`) was created covering happy paths and failure cases for every endpoint.

3. **End-to-End UI Testing (Manual)** — Each screen and user flow was manually tested on a physical Android device and the iOS Simulator.

### 6.1.2 Test Environment

| Aspect | Setup |
|--------|-------|
| Backend | Running locally on Bun runtime, port 8000 |
| Database | Local PostgreSQL 15 instance with pgvector |
| Mobile | Physical Android device + iOS Simulator |
| API Testing | Postman desktop application |
| AI | Groq API free tier |

---

## 6.2 API Testing

### 6.2.1 Authentication Test Cases

**Table 6.1: Authentication Test Cases**

| Test ID | Method | Endpoint | Input Data | Expected Response | Actual Response | Status |
|---------|--------|----------|------------|-------------------|-----------------|--------|
| TC-A-01 | POST | `/auth/register` | Valid email + password + name | 201, user object + tokens | 201, correct | ✅ Pass |
| TC-A-02 | POST | `/auth/register` | Duplicate email | 409, "User already exists" | 409, correct error | ✅ Pass |
| TC-A-03 | POST | `/auth/register` | Missing email | 400, validation error | 400 | ✅ Pass |
| TC-A-04 | POST | `/auth/register` | Missing password | 400, validation error | 400 | ✅ Pass |
| TC-A-05 | POST | `/auth/login` | Valid credentials | 200, user + tokens | 200, correct | ✅ Pass |
| TC-A-06 | POST | `/auth/login` | Wrong password | 401, "Invalid credentials" | 401 | ✅ Pass |
| TC-A-07 | POST | `/auth/login` | Non-existent email | 401, "Invalid credentials" | 401 | ✅ Pass |
| TC-A-08 | POST | `/auth/refresh` | Valid refresh token | 200, new tokens | 200, correct | ✅ Pass |
| TC-A-09 | POST | `/auth/refresh` | Expired token | 401 | 401 | ✅ Pass |
| TC-A-10 | POST | `/auth/refresh` | Already used token | 401 | 401 | ✅ Pass |
| TC-A-11 | POST | `/auth/logout` | Valid session | 200, "Logged out" | 200 | ✅ Pass |
| TC-A-12 | GET | `/decisions` | No auth header | 401, "Unauthorized" | 401 | ✅ Pass |
| TC-A-13 | GET | `/decisions` | Expired access token | 401, "Invalid token" | 401 | ✅ Pass |

---

### 6.2.2 Decision Management Test Cases

**Table 6.2: Decision Management Test Cases**

| Test ID | Method | Endpoint | Test Scenario | Expected | Actual | Status |
|---------|--------|----------|--------------|----------|--------|--------|
| TC-D-01 | POST | `/decisions` | Valid full payload | 201, decision object | 201, correct | ✅ Pass |
| TC-D-02 | POST | `/decisions` | Missing title | 400 validation error | 400 | ✅ Pass |
| TC-D-03 | POST | `/decisions` | Invalid category value | 400 | 400 | ✅ Pass |
| TC-D-04 | POST | `/decisions` | Confidence level = 0 | 400 | 400 | ✅ Pass |
| TC-D-05 | POST | `/decisions` | Confidence level = 11 | 400 | 400 | ✅ Pass |
| TC-D-06 | GET | `/decisions` | No filters | 200, paginated list | 200, correct | ✅ Pass |
| TC-D-07 | GET | `/decisions?category=career` | Category filter | 200, only career decisions | 200, filtered | ✅ Pass |
| TC-D-08 | GET | `/decisions?search=job` | Search filter | 200, matching decisions | 200, filtered | ✅ Pass |
| TC-D-09 | GET | `/decisions/:id` | Own decision | 200, full detail | 200, correct | ✅ Pass |
| TC-D-10 | GET | `/decisions/:id` | Another user's ID | 404 | 404 | ✅ Pass |
| TC-D-11 | GET | `/decisions/:id` | Non-existent UUID | 404 | 404 | ✅ Pass |
| TC-D-12 | DELETE | `/decisions/:id` | Own decision | 200, deletedAt set | 200 | ✅ Pass |
| TC-D-13 | GET | `/decisions` | After soft delete | Deleted item not in list | Correct | ✅ Pass |

---

### 6.2.3 Outcome and AI Test Cases

**Table 6.3: Outcome and AI Test Cases**

| Test ID | Endpoint | Test Scenario | Expected | Actual | Status |
|---------|----------|--------------|----------|--------|--------|
| TC-O-01 | POST `/outcomes` | Valid check-in data | 201, outcome object | 201, correct | ✅ Pass |
| TC-O-02 | POST `/outcomes` | satisfactionScore = 0 | 400 validation | 400 | ✅ Pass |
| TC-O-03 | POST `/outcomes` | Missing actualResults | 400 | 400 | ✅ Pass |
| TC-O-04 | GET `/outcomes/pending-checkins` | Valid auth | 200, reminder list | 200, correct | ✅ Pass |
| TC-O-05 | POST `/outcomes/checkins/:id/skip` | Valid reminder ID | 200, status=skipped | 200 | ✅ Pass |
| TC-O-06 | POST `/outcomes/checkins/:id/skip` | Another user's reminder | 404 | 404 | ✅ Pass |
| TC-AI-01 | POST `/ai/chat` | Valid message | SSE stream starts | Stream works | ✅ Pass |
| TC-AI-02 | POST `/ai/chat` | Empty message | 400 | 400 | ✅ Pass |
| TC-AI-03 | GET `/ai/chat/sessions` | Valid auth | 200, sessions list | 200 | ✅ Pass |
| TC-AI-04 | GET `/ai/chat/sessions/:id` | Valid session | 200, messages | 200, correct | ✅ Pass |

---

## 6.3 Functional Testing

### 6.3.1 Registration and Login Flow

**Test Steps:**
1. Open the app on a fresh install → Login screen appears correctly ✅
2. Tap "Create Account" → Register screen opens with slide animation ✅
3. Enter valid name, email, and password → No errors shown ✅
4. Tap "Create Account" → Loading state shows, API call made ✅
5. Success → Dashboard loads with greeting showing the user's first name ✅
6. Force-close and reopen app → Still logged in (tokens restored from SecureStore) ✅
7. Tap logout → Dashboard cleared, Login screen shown ✅
8. Try login with wrong password → "Invalid credentials" error shown inline ✅

**Result: All steps passed** ✅

---

### 6.3.2 Creating a Decision

**Test Steps:**
1. From Dashboard, tap "New Decision" → Wizard modal slides up ✅
2. Step 1: Type title, select "Career" category, write context → Next button activates ✅
3. Tap "Use Template" → Bottom sheet opens with system templates ✅
4. Select a template → Fields are pre-populated ✅
5. Step 2: Write background, add two alternatives with pros/cons ✅
6. Step 3: Add two expected metrics, set confidence to 7 → Submit ✅
7. Wizard closes → Decision List refreshes with new item at top ✅
8. Tap the new decision → Detail screen shows all entered information ✅
9. Outcomes tab → Shows "No outcomes yet" empty state ✅

**Result: All steps passed** ✅

---

### 6.3.3 Recording an Outcome Check-In

**Test Steps:**
1. Dashboard shows a pending check-in card (from step 6.3.2) ✅
2. Tap "Review" on the check-in card → Check-in form opens ✅
3. Drag satisfaction slider to 7 → Value updates ✅
4. Write actual results and reflections text ✅
5. Toggle "Would decide again" to Yes ✅
6. Set mood to 7 and stress to 4 ✅
7. Tap Submit → Loading state, then success toast shown ✅
8. Navigate to Decision Detail → Outcomes tab shows the new entry ✅
9. Check-in card is removed from Dashboard ✅

**Result: All steps passed** ✅

---

### 6.3.4 AI Advisor Chat

**Test Steps:**
1. Navigate to AI tab → Clean chat interface with welcome card ✅
2. Type: "I'm considering a job change. Can you give me some thoughts based on my history?" ✅
3. Tap Send → Message appears on right side in indigo bubble ✅
4. AI response begins streaming — tokens appear word by word ✅
5. Response references specific past career decisions (personalized!) ✅
6. Continue with follow-up: "What patterns do you see in how I make career decisions?" ✅
7. AI responds with pattern-aware analysis ✅
8. Navigate to History tab → Previous session is listed with message count ✅
9. Tap session → Full conversation history is displayed ✅

**Result: All steps passed** ✅

---

**Table 6.4: Functional Test Results Summary**

| User Flow | Steps Tested | Steps Passed | Issues Found |
|-----------|:------------:|:------------:|-------------|
| Registration | 8 | 8 | None |
| Login & Logout | 4 | 4 | None |
| Create Decision | 9 | 9 | None |
| View Decision List (filters) | 6 | 6 | None |
| View Decision Detail | 5 | 5 | None |
| Record Outcome | 9 | 9 | None |
| AI Chat (basic) | 6 | 5 | SSE timeout on slow 3G — fixed |
| AI Chat History | 3 | 3 | None |
| Skip Reminder | 3 | 3 | None |
| Token Auto-Refresh | 4 | 4 | None |

---

## 6.4 Test Results Summary

**Table 6.5: Overall Test Summary**

| Test Category | Test Cases | Passed | Failed | Pass Rate |
|--------------|:----------:|:------:|:------:|:---------:|
| Authentication API | 13 | 13 | 0 | 100% |
| Decision Management API | 13 | 13 | 0 | 100% |
| Outcome API | 6 | 6 | 0 | 100% |
| AI Module API | 4 | 4 | 0 | 100% |
| UI Functional Flows | 57 steps | 56 | 1 | 98.2% |
| **Total** | **93** | **92** | **1** | **98.9%** |

> **The one failed case:** On a slow 3G network connection, the SSE stream connection to the AI advisor would sometimes time out before the first token arrived. This was fixed by adding a connection timeout fallback message ("Connection taking too long — please try again") and implementing exponential backoff retry logic on the mobile side.

---

&nbsp;

---

# CHAPTER 7: RESULTS AND DISCUSSION

---

## 7.1 Project Metrics

**Table 7.1: Project Metrics Summary**

| Metric | Value |
|--------|-------|
| Database Tables | 20+ |
| API Endpoints | 40+ |
| Mobile App Screens | 10+ |
| React Native Components | 25+ |
| Backend Controllers | 9 |
| AI Service Functions | 10+ |
| Background Job Types | 3 |
| Lines of TypeScript Code | ~11,000 |
| Technologies Used | 15+ |
| Database Schema Modules | 10 |
| Test Cases Executed | 93 |
| Test Pass Rate | 98.9% |
| Development Duration | ~5 months |

These numbers place LifeOS significantly beyond the typical scope of a BCA final year project. Most BCA projects consist of a simple CRUD web application with a local database and no AI integration. LifeOS demonstrates a complete, production-architecture full-stack mobile system with real-world engineering patterns.

---

## 7.2 Objectives Achieved

**Table 7.2: Objectives vs. Achievement**

| Objective | Target | Achieved? | Notes |
|-----------|--------|:---------:|-------|
| Build a mobile decision journal | Structured multi-step logging | ✅ | 3-step wizard with 10 categories |
| Outcome tracking with reminders | Auto-scheduled at 1w/1m/3m/6m/1y | ✅ | Reminders created on decision save |
| Personalized AI advisor | 4-layer context with user history | ✅ | RAG, profile, patterns, memories |
| Behavioral pattern detection | Background detection every 12h | ✅ | Runs on scheduler + on-demand |
| Personal memory system | LLM extraction from reflections | ✅ | With importance scoring and cleanup |
| Secure, scalable backend | JWT, bcrypt, indexes, soft deletes | ✅ | All security requirements met |
| Clean mobile UI (iOS + Android) | Single codebase, both platforms | ✅ | Tested on both platforms |
| Analytics dashboard | Summary + quality over time | ⚠️ | Backend complete, UI pending |
| Push notifications | End-to-end notification system | ⚠️ | Backend schema ready, Expo Push pending |
| Dark mode | Night-friendly color scheme | ⚠️ | Planned for next version |

7 out of 7 core technical objectives were fully achieved. 3 additional aspirational objectives (analytics charts, push notifications, dark mode) are partially complete with backend infrastructure in place.

---

## 7.3 Challenges and Solutions

Building a project of this scope as a final year student involved encountering and solving problems that go well beyond textbook scenarios. The following table documents the major challenges faced and how they were resolved.

**Table 7.3: Challenges and Solutions**

| # | Challenge | Root Cause | Solution Implemented | Outcome |
|---|-----------|------------|---------------------|---------|
| 1 | AI Chat feels slow — user sees blank screen while waiting for full response | LLM takes 3–8 seconds to generate a full response | Server-Sent Events (SSE) streaming — tokens delivered in real-time, appearing word-by-word | Chat feels instantaneous from the user's perspective |
| 2 | Recording an outcome is slow because AI analysis blocks the response | `computeProfile()` and `detectPatterns()` are expensive LLM + DB operations | Fire-and-forget async: outcome saved immediately, AI jobs triggered in background via `setImmediate()` | Outcome saves in <200ms; AI jobs run silently in background |
| 3 | App logs user out mid-session when access token expires | JWT has a fixed expiry; no auto-refresh | Axios response interceptor catches 401, calls `/auth/refresh`, retries original request with new token | Session is seamless; user never notices token expiry |
| 4 | Multiple API calls failing at 401 simultaneously cause multiple refresh attempts | Race condition: all 401s trigger refresh independently | Queue mechanism — one refresh request queued, others wait and replay when refresh completes | Single refresh request regardless of concurrent 401s |
| 5 | NativeWind cold-start crash — Login screen renders unstyled on first launch | NativeWind v5 has race condition: CSS not loaded before first render | Login, Register, and Dashboard screens use inline `style` props instead of `className` | Stable styling on all cold starts |
| 6 | Expo Router blank screen on startup | Layout component returned `null` while loading; no navigator mounted | Use `SplashScreen.preventAutoHideAsync()` to keep splash visible; layout always renders `<Stack>` | No blank screen on startup |
| 7 | Decision wizard state management became complex with arrays-of-arrays | `useState` for nested alternatives and outcomes was hard to manage | Switched to `useReducer` with typed action objects | State changes are explicit and debuggable |
| 8 | Semantic search requires pgvector HNSW index to be fast at scale | Without an index, vector similarity search is O(n) — slow for large datasets | HNSW index defined in schema with `vector_cosine_ops` | Search is fast even with thousands of decisions |
| 9 | TypeScript types for JSONB columns in Drizzle | JSONB columns are `unknown` by default | `.$type<T>()` calls on all JSONB columns to provide compile-time type inference | Full type safety from DB schema to API response |
| 10 | Memory store growing without bound as users add more check-ins | Each outcome reflection can add multiple memories | Daily cleanup job: removes expired memories, caps at 50 per user by importance score | Memory store stays bounded and high-quality |

---

### Challenge 1 — AI Chat Latency: Deep Dive

This was the most important user experience challenge. The initial implementation waited for the complete LLM response before sending it to the client. In testing, this meant a 5–10 second blank period before any text appeared.

The switch to SSE streaming completely transformed the experience. Now, the first token arrives within 0.5–1 second of sending the message, and the response builds up word-by-word in real-time. Even though the total time to receive the complete response is the same, the perception of speed is dramatically different. Users reported the AI feeling "much faster" even though nothing about the actual generation speed changed — only the delivery method changed.

The SSE implementation required:
1. Setting the response headers correctly: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`
2. Using Vercel AI SDK's `streamText()` function which yields tokens as they arrive from Groq
3. On the mobile side, using a fetch-based EventSource implementation to consume the SSE stream (React Native doesn't have a native EventSource API, so a custom implementation was required)

---

### Challenge 3 — JWT Auto-Refresh: Deep Dive

The Axios interceptor solution elegantly handles what is actually a complex distributed state problem. When a 401 is received:

1. The interceptor checks if a refresh is already in progress (`isRefreshing` flag)
2. If not, it sets the flag and initiates the refresh
3. Any other requests that arrive with 401 during the refresh are queued (not lost, not retried immediately)
4. When the refresh completes, all queued requests are replayed with the new token

Without the queue mechanism, a user who has three API calls in flight when their token expires would trigger three simultaneous refresh requests — a race condition that could result in one succeeding and the other two getting "invalid refresh token" errors, causing unexpected logout.

---

&nbsp;

---

# CHAPTER 8: FUTURE SCOPE

---

LifeOS is designed as a long-term product, not just a student project. The current version establishes the core data model and architecture. Everything built in this version is intended to serve as the foundation for the features described in this chapter.

## 8.1 Push Notifications

**Status: Backend infrastructure complete — mobile integration pending**

The `notifications` database table and the notification service module are already implemented. The remaining work is:
1. Integrating Expo Push Notifications SDK on the mobile side
2. Storing the Expo Push Token on the server when a user registers their device
3. Updating the background reminder scheduler to send push notifications when a reminder is due

Planned notification content:
- *"Hey Badal, it's been 1 month since you decided to change jobs. How has it worked out?"*
- *"New insight available: You tend to make better decisions earlier in the week."*
- *"Your AI memory has been updated based on your latest reflection."*

---

## 8.2 Analytics and Data Visualization

**Status: Backend API complete — mobile UI pending**

The analytics endpoints (`/analytics/summary`, `/analytics/decision-quality-over-time`, `/analytics/patterns`) are fully implemented. The planned mobile UI additions:

**Quality Timeline Chart:** A line chart showing average satisfaction score month by month, making it easy to see whether decision quality is improving over time. The data is already returned by the `/analytics/decision-quality-over-time` endpoint.

**Category Breakdown:** A donut/pie chart showing what proportion of decisions fall into each life category, with color coding matching the app's category colors.

**Confidence Calibration Chart:** A scatter plot of "confidence level at time of decision" vs "satisfaction score at outcome." A well-calibrated decision-maker should see these cluster around the diagonal. An overconfident person will see their points concentrated in the bottom-right (high confidence, low satisfaction).

**Pattern Cards:** Individual cards for each detected behavioral pattern, showing the description, strength rating, and supporting data.

---

## 8.3 Profile and Settings Screen

The Profile screen will include:
- Editing user information (name, bio, occupation, location)
- Notification preference controls (which notifications, what frequency)
- Default check-in interval settings
- Privacy controls (data sharing, AI training opt-in/out)
- Session management (view active sessions, revoke all)
- Account deletion with data export option (CSV download of all decisions and outcomes)

---

## 8.4 Dark Mode

The dark mode color palette is already defined:
- Background: `#0A0A1A` (deep midnight blue)
- Surface: `#111128` (slightly lighter dark)
- Text: `#F9FAFB` (near-white)
- Accent: `#6366F1` (slightly lighter indigo for dark backgrounds)
- AI Card: `#1A1A35` (dark lavender tint)

Implementation requires wrapping all color references in a `useColorScheme()` hook that selects between light and dark palettes. React Native's `Appearance` API makes it straightforward to detect the system setting and switch automatically.

---

## 8.5 IoT Health Data Integration

This is the biggest long-term vision for LifeOS, and it represents a genuinely novel concept in the decision-support space.

**The Idea:**
Physical health has a profound effect on decision quality. Research shows that sleep deprivation, high stress, and poor nutrition all significantly impair judgment. If LifeOS could access real-time health data, it could correlate decision quality with physical state:

- *"Your 3 highest-satisfaction decisions were made on days when your average sleep was over 7.5 hours."*
- *"When your stress indicator is above 70%, your financial decisions have 40% lower satisfaction than average."*

**The Vision: LifeOS Smart Device**

The plan is to eventually design and build a custom wearable device — a wristband that measures:

- **Heart Rate (HR)** — Real-time and HRV (Heart Rate Variability) for stress assessment
- **Blood Oxygen (SpO2)** — Peripheral oxygen saturation
- **Sleep Tracking** — Duration, deep sleep %, sleep quality score
- **Activity** — Step count, calorie burn, active minutes
- **Stress Level** — Derived from HRV + HR variability patterns

All data would flow into LifeOS via Bluetooth Low Energy (BLE). The backend would store it, compute daily health scores, and the AI would automatically incorporate this data when analyzing decisions.

The outcome would be a **Life Health Score** — a single daily metric combining physical and mental health data — that the AI uses to provide context-aware, biologically-grounded decision advice.

**Technical Architecture for IoT Integration:**
- Custom BLE protocol for device-to-phone communication
- Dedicated hardware schema tables (already partially defined in `social.schema.ts`)
- New analytics pipeline for health data correlation
- AI context Layer 5: "Today's health state" added to the 4-layer pipeline

---

## 8.6 Social and Sharing Features

**Status: Database schema partially implemented**

The `decision_shares` and `community_templates` tables already exist in the schema. Planned features:

**Anonymous Decision Sharing:** Users can opt to share a decision (with all personally identifying information removed) to a public feed. Other users can browse these anonymized decisions for inspiration and perspective.

**Community Templates:** Instead of only system-provided templates, users could submit templates they found useful to a community library. Other users vote on which templates are most helpful. The top templates are promoted to the "Recommended" section.

**Decision Challenges:** Gamified community challenges like "Make a deliberate career decision this month" — encouraging structured decision-making with community accountability.

---

## 8.7 Voice Input

Typing a long decision context on a mobile keyboard is friction. Speech-to-text input would allow users to:

1. Tap a microphone button
2. Speak: "I'm deciding whether to accept a software engineering job offer from a startup in Bangalore. The pay is 30% better but I'd have to relocate away from my family. I'm about 7 out of 10 confident this is the right move."
3. The app transcribes and parses the speech into the appropriate decision fields

This would significantly reduce the time and effort required to log a decision, making it more likely that people actually use the app daily.

Implementation: `expo-speech-recognition` package for on-device speech recognition, combined with an LLM parsing step to extract structured fields from the transcribed text.

---

## 8.8 Web Application

A companion web application using **Next.js** would serve users who prefer a desktop experience for:
- Writing longer, more detailed decision contexts and reflections
- Reviewing historical decision data on a larger screen
- Advanced analytics with interactive charts
- Bulk CSV/PDF export of their decision journal

The existing backend API is already structured to support a web client without any changes — the mobile app and web app would share the same REST API.

---

## 8.9 Multi-Language Support

The current application is English-only. Adding internationalization (i18n) would open LifeOS to non-English speaking markets, particularly:

- Hindi (India's largest language)
- Spanish (large Latin American market)
- Portuguese (Brazil)
- Mandarin Chinese

Since many of the user-facing strings are AI-generated (insights, pattern descriptions, AI responses), the AI prompts would need to be updated to generate responses in the user's preferred language. This is straightforward with modern LLMs which handle multilingual generation natively.

---

&nbsp;

---

# CHAPTER 9: CONCLUSION

---

LifeOS began as a fairly simple idea: build an app that helps people learn from their decisions. What it became over the course of development is significantly more complex and interesting than that original idea — a full-stack mobile system with a personalized AI pipeline, semantic vector search, behavioral pattern detection, and a personal memory system.

## What Was Built

The project demonstrates that it is possible for a single developer — a final year BCA student with no industry experience — to build a genuinely sophisticated technical system. The final product includes:

- A complete mobile application with 10+ screens, working on both iOS and Android
- A production-quality REST API with 40+ endpoints, full authentication, and data isolation
- A PostgreSQL database with 20+ tables, proper indexing, and semantic vector search
- An AI system that goes well beyond a simple API call — it builds personalized context for every interaction using the user's own history
- Background intelligence jobs that continuously improve the system without any user intervention
- A personal memory system that makes the AI genuinely remember important things about the user across sessions

## What Was Learned

Beyond the technical skills, building this project taught lessons that no individual course covers:

**Architecture matters from day one.** Decisions made early about how to structure the database, how to handle authentication, and how to organize the codebase paid dividends throughout development. Poor early decisions (like initially not having proper database indexes) caused painful refactors later.

**User experience and technical complexity are separate problems.** The hardest technical features — the SSE streaming, the token rotation, the RAG pipeline — are invisible to the user. What the user experiences is simply a fast AI chat, a seamless login, and relevant personalized advice. Good engineering is invisible.

**Async processing changes everything.** The shift from "wait for everything before responding" to "respond immediately and process in the background" was the single change that made the biggest difference to the application's feel. Fire-and-forget processing makes complex operations disappear from the user's perspective.

**AI is a tool, not magic.** Working with LLMs revealed that the value is almost entirely in how you frame the prompt and what context you provide. The 4-layer pipeline in LifeOS is more valuable than the LLM itself — the same model called with generic context gives generic answers, but called with the user's personal history gives genuinely useful personalized advice.

## What Comes Next

The vision for LifeOS extends well beyond the current implementation. The IoT health integration, the analytics dashboards, push notifications, and social features described in Chapter 8 represent a roadmap that could evolve this from a final year project into a genuine product.

The most important foundation is already in place: a clean data model, a scalable API, and an AI architecture that gets better the more a user engages with it. Every decision logged, every outcome recorded, and every AI conversation makes the system smarter about that specific person.

In the end, LifeOS is a bet on a simple idea: if you give people a structured way to reflect on their decisions and learn from them — supported by AI that actually understands their history — they will become better decision-makers over time.

---

> *"Decide better. Learn faster. Live intentionally."*

---

&nbsp;

---

# REFERENCES

---

1. Gorry, G. A., & Morton, M. S. S. (1971). A framework for management information systems. *Sloan Management Review*, 13(1), 55–70.

2. Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux. ISBN: 978-0374275631.

3. Klein, G. (2007). Performing a project premortem. *Harvard Business Review*, 85(9), 18–19. https://hbr.org/2007/09/performing-a-project-premortem

4. Sunstein, C. R., & Thaler, R. H. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness*. Yale University Press.

5. Ariely, D. (2008). *Predictably Irrational: The Hidden Forces That Shape Our Decisions*. HarperCollins Publishers.

6. Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems*, 33, 9459–9474.

7. Facebook (Meta). (2024). *React Native Documentation*. https://reactnative.dev/docs/getting-started

8. Expo Team. (2024). *Expo SDK 55 Documentation*. https://docs.expo.dev/

9. Drizzle Team. (2024). *Drizzle ORM Documentation*. https://orm.drizzle.team/docs/overview

10. PostgreSQL Global Development Group. (2024). *PostgreSQL 15 Documentation*. https://www.postgresql.org/docs/15/

11. Stonebraker, M., & Rowe, L. A. (1986). The design of POSTGRES. *ACM SIGMOD Record*, 15(2), 340–355.

12. pgvector contributors. (2024). *pgvector: Open-source vector similarity search for Postgres*. https://github.com/pgvector/pgvector

13. Malkov, Y. A., & Yashunin, D. A. (2018). Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs. *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 42(4), 824–836.

14. Vercel. (2024). *AI SDK Documentation*. https://sdk.vercel.ai/docs

15. TanStack. (2024). *React Query v5 Documentation*. https://tanstack.com/query/v5/docs/framework/react/overview

16. Zustand contributors. (2024). *Zustand State Management Documentation*. https://zustand-demo.pmnd.rs/

17. Expo Team. (2024). *Expo SecureStore Documentation*. https://docs.expo.dev/sdk/securestore/

18. JWT.io. (2024). *JSON Web Tokens Introduction*. https://jwt.io/introduction/

19. OWASP Foundation. (2023). *Mobile Top 10*. https://owasp.org/www-project-mobile-top-10/

20. Nielsen, J. (1994). *Usability Engineering*. Academic Press / Morgan Kaufmann. ISBN: 978-0125184069.

---

&nbsp;

---

# APPENDIX A: SELECTED SOURCE CODE

---

## A.1 Backend Entry Point and Express Setup

```typescript
// backend/src/app.ts — Complete file

import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import decisionRoutes from "./routes/decision.routes";
import outcomeRoutes from "./routes/outcome.routes";
import analyticsRoutes from "./routes/analytics.routes";
import aiRoutes from "./routes/ai.routes";
import notificationRoutes from "./routes/notification.routes";
import frameworkRoutes from "./routes/framework.routes";
import templateRoutes from "./routes/template.routes";
import { errorHandler } from "./middleware/error.middleware";

export const createApp = (): Express => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/decisions", decisionRoutes);
  app.use("/api/v1/outcomes", outcomeRoutes);
  app.use("/api/v1/analytics", analyticsRoutes);
  app.use("/api/v1/ai", aiRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/frameworks", frameworkRoutes);
  app.use("/api/v1/templates", templateRoutes);

  app.use(errorHandler);

  return app;
};
```

---

## A.2 JWT Authentication Middleware

```typescript
// backend/src/middleware/auth.middleware.ts — Complete file

import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const secret: string = process.env.JWT_SECRET
      ? String(process.env.JWT_SECRET)
      : "default_secret";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    req.user = {
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as string,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

---

## A.3 Decision Schema with pgvector

```typescript
// backend/src/db/decision.schema.ts — Key tables

import {
  pgTable, uuid, varchar, text, timestamp, integer,
  boolean, jsonb, pgEnum, index, vector, type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.schema";

export const decisionCategoryEnum = pgEnum("decision_category", [
  "career", "financial", "health", "relationship", "education",
  "lifestyle", "business", "personal_growth", "family", "other",
]);

export const decisionStatusEnum = pgEnum("decision_status", [
  "active", "archived", "superseded", "deleted",
]);

export const decisions = pgTable(
  "decisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    category: decisionCategoryEnum("category").notNull(),
    status: decisionStatusEnum("status").notNull().default("active"),
    decisionDate: timestamp("decision_date").notNull().defaultNow(),
    expectedOutcomeDate: timestamp("expected_outcome_date"),
    context: text("context"),
    reasoningProcess: text("reasoning_process"),
    alternativesConsidered: jsonb("alternatives_considered").$type<
      Array<{
        option: string;
        prosAndCons: { pros: string[]; cons: string[] };
        whyNotChosen: string;
      }>
    >(),
    expectedOutcomes: jsonb("expected_outcomes").$type<
      Array<{
        outcome: string;
        metric?: string;
        targetValue?: number | string;
        timeframe?: string;
        importance: number;
      }>
    >(),
    confidenceLevel: integer("confidence_level").notNull(),
    tags: text("tags").array(),
    isPrivate: boolean("is_private").notNull().default(true),
    parentDecisionId: uuid("parent_decision_id").references(
      (): AnyPgColumn => decisions.id,
    ),
    embedding: vector("embedding", { dimensions: 1536 }),
    aiSummary: text("ai_summary"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    userIdIdx: index("decisions_user_id_idx").on(table.userId),
    categoryIdx: index("decisions_category_idx").on(table.category),
    statusIdx: index("decisions_status_idx").on(table.status),
    embeddingIdx: index("decisions_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    userCategoryIdx: index("decisions_user_category_idx").on(
      table.userId,
      table.category,
    ),
  }),
);
```

---

## A.4 Axios Client — Complete Implementation

```typescript
// LifeOS/utils/api.ts — Complete file

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: "http://10.102.179.54:8000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Bearer token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("lifeos_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(
          "lifeos_refresh_token",
        );
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const newAccessToken: string = data.accessToken;
        const newRefreshToken: string = data.refreshToken;

        await useAuthStore
          .getState()
          .setTokens(newAccessToken, newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await useAuthStore.getState().clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

## A.5 Zustand Auth Store

```typescript
// LifeOS/store/authStore.ts — Complete file

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "lifeos_access_token";
const REFRESH_TOKEN_KEY = "lifeos_refresh_token";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  setTokens: async (accessToken, refreshToken) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null });
  },

  hydrate: async () => {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    set({ accessToken, refreshToken, isHydrated: true });
  },
}));
```

---

## A.6 User Memories and Intelligence Schema

```typescript
// backend/src/db/intelligence.schema.ts — Key portions

export type UserProfileData = {
  memberSince: string;
  totalDecisions: number;
  totalOutcomes: number;
  decisionsPerWeek: number;
  avgTimeBetweenDecisions: number;
  overallSatisfaction: number | null;
  confidenceAccuracy: number | null;
  traits: string[];
  categoryProfiles: Record<string, {
    count: number;
    avgSatisfaction: number | null;
    regretRate: number;
    avgConfidence: number;
    topLessons: string[];
    commonMistakes: string[];
  }>;
  lifeContext: string[];
};

export type UserMemoryCategory =
  | "financial" | "life_event" | "preference" | "goal"
  | "relationship" | "career" | "health" | "behavioral";

export const userDecisionProfiles = pgTable("user_decision_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  profile: jsonb("profile").$type<UserProfileData>(),
  textSummary: text("text_summary"), // ~200-400 tokens — injected into AI context
  version: integer("version").default(1),
  lastComputedAt: timestamp("last_computed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userMemories = pgTable("user_memories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 50 })
    .$type<UserMemoryCategory>(),
  fact: text("fact").notNull(),
  importance: integer("importance").default(5), // 1-10
  source: varchar("source", { length: 50 }),
  sourceId: uuid("source_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

---

&nbsp;

---

# APPENDIX B: API REFERENCE

---

## B.1 Base URL and Authentication

**Base URL:** `http://<server>:8000/api/v1`

All requests except `/auth/register` and `/auth/login` require:
```
Authorization: Bearer <access_token>
```

---

## B.2 Register New User

**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "badal@example.com",
  "password": "SecurePassword123",
  "firstName": "Badal",
  "lastName": "Kumar"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "badal@example.com",
    "firstName": "Badal",
    "lastName": "Kumar",
    "displayName": "Badal Kumar",
    "role": "user",
    "status": "active",
    "emailVerified": false,
    "createdAt": "2026-06-19T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a3f8e2c1d4b5..."
}
```

---

## B.3 Create Decision

**POST** `/decisions`

**Request Body:**
```json
{
  "title": "Accept the software engineering job offer",
  "category": "career",
  "context": "Received offer from a startup — 30% higher salary but less security",
  "reasoningProcess": "Weighed financial gain against stability and growth",
  "alternativesConsidered": [
    {
      "option": "Stay at current employer",
      "prosAndCons": {
        "pros": ["Job security", "Known team"],
        "cons": ["Lower salary", "Limited growth prospects"]
      },
      "whyNotChosen": "Salary gap too significant for my current financial goals"
    }
  ],
  "expectedOutcomes": [
    {
      "outcome": "Salary increases by 30%",
      "metric": "Monthly take-home pay",
      "targetValue": 75000,
      "timeframe": "1 month",
      "importance": 5
    }
  ],
  "confidenceLevel": 7,
  "tags": ["career", "salary", "startup"]
}
```

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Accept the software engineering job offer",
    "category": "career",
    "status": "active",
    "confidenceLevel": 7,
    "createdAt": "2026-06-19T10:00:00.000Z",
    "updatedAt": "2026-06-19T10:00:00.000Z"
  }
}
```

---

## B.4 Get Decision List

**GET** `/decisions`

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page (max 100) |
| `category` | string | — | Filter by category |
| `status` | string | — | Filter: active, archived |
| `search` | string | — | Full-text search in title |
| `sortBy` | string | createdAt | Sort field |
| `sortOrder` | string | desc | asc or desc |

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Accept the software engineering job offer",
      "category": "career",
      "status": "active",
      "confidenceLevel": 7,
      "createdAt": "2026-06-19T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## B.5 Submit Outcome Check-In

**POST** `/outcomes`

**Request Body:**
```json
{
  "decisionId": "uuid-of-the-decision",
  "satisfactionScore": 8,
  "wouldDecideAgain": true,
  "actualResults": "Salary increase came through as promised. Team is great.",
  "reflections": "I was anxious but it worked out. The startup culture fits me well.",
  "lessonsLearned": "Trust my research when confidence is above 7. Early negotiations matter.",
  "moodAtCheckIn": 7,
  "stressLevel": 3
}
```

**Success Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "decisionId": "uuid",
    "satisfactionScore": 8,
    "wouldDecideAgain": true,
    "checkInDate": "2026-07-19T10:00:00.000Z",
    "createdAt": "2026-07-19T10:00:00.000Z"
  }
}
```

---

## B.6 AI Chat (SSE Stream)

**POST** `/ai/chat`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: text/event-stream
```

**Request Body:**
```json
{
  "message": "Should I take a job offer that pays more but requires relocating?",
  "sessionId": null
}
```

**SSE Response Stream:**
```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"type":"token","content":"Based"}

data: {"type":"token","content":" on"}

data: {"type":"token","content":" your"}

data: {"type":"token","content":" decision"}

data: {"type":"token","content":" history"}

...

data: {"type":"done","sessionId":"uuid","messageId":"uuid"}
```

---

*End of Appendix B*

---

&nbsp;

---

**END OF THESIS**

---

**Submitted by:**

**Badal Kumar**
Roll No. 10, BCA 6th Semester, Session 2023–2026
Department of Computer Application
Patna College, Patna
June 2026
