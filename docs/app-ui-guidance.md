# LifeOS - React Native App UI/UX & Architecture Guide

This document provides a comprehensive UI/UX structural blueprint for building the **LifeOS** mobile application in **React Native** (using Expo/Stitch/Idx). The app is designed to be modern, minimalist, and deeply integrated with the Node.js/PostgreSQL backend API structure.

> **Note for AI Generators (Stitch/Idx):** Use this document as your primary context when scaffolding the UI. The design should feel premium, fluid, and uncluttered. Focus heavily on typography, whitespace, subtle micro-interactions, and skeleton loading states.

---

## 🎨 1. Design System & Aesthetics

### 1.1 Core Principles
*   **Minimalism:** High signal-to-noise ratio. Avoid excessive borders; use spacing (`gap`, `padding`) to delineate sections.
*   **Focus:** Core actions (e.g., "New Decision", "Pending Check-ins") should be immediately visible.
*   **Calmness:** The app deals with potentially stressful choices. The UI should induce a feeling of serenity and organization.
*   **Fluidity:** Smooth transitions between screens. No jarring spinners; use shimmer/skeleton loaders.

### 1.2 Color Palette (Minimalist Dark/Light Mode)

We will use a sophisticated monochromatic base with a single calming accent color.

**Light Mode:**
*   **Background (Primary):** `#F9FAFB` (Very subtle cool gray/off-white)
*   **Surface (Cards/Elements):** `#FFFFFF`
*   **Text (Primary):** `#111827` (Deep Gray, softer than pure black)
*   **Text (Secondary):** `#6B7280` (Muted Gray)
*   **Accent (Primary Action):** `#4F46E5` (Indigo - sophisticated and trustworthy)
*   **Status Indicators:**
    *   *Success/Positive:* `#10B981` (Emerald)
    *   *Warning/Pending:* `#F59E0B` (Amber)
    *   *Danger/Negative:* `#EF4444` (Red)

**Dark Mode:**
*   **Background (Primary):** `#0F172A` (Slate/Midnight Blue)
*   **Surface (Cards/Elements):** `#1E293B`
*   **Text (Primary):** `#F8FAFC`
*   **Text (Secondary):** `#94A3B8`
*   **Accent (Primary Action):** `#6366F1` (Lighter Indigo for high contrast)

### 1.3 Typography
*   **Font Family:** `Inter` (or system defaults: San Francisco on iOS, Roboto on Android).
*   **Headings:** Bold/Semibold (`600`-`700`), tight tracking (letter-spacing).
*   **Body:** Regular (`400`), generous line-height (`1.5`) for readability when reviewing long descriptions or AI chat responses.

### 1.4 UI Components (The "Stitch" Core Instructions)
*   **Buttons:** Fully rounded pill shapes (`borderRadius: 9999`) or smooth rounded rectangles (`borderRadius: 12`), clean solid fills or outlined styles. Avoid heavy drop shadows.
*   **Cards:** Very subtle diffuse shadows in light mode (`shadowOpacity: 0.05`), faint borders in dark mode (`borderColor: '#334155'`).
*   **Bottom Tabs:** Clean, minimalistic icons. Consider a floating pill shape with a slight blur/translucency.
*   **Inputs:** Large touch targets (`minHeight: 48`), very light gray backgrounds rather than heavy borders.

---

## 📱 2. Screen Requirements & Data Mapping

*The app uses 5 main bottom tabs: Dashboard, Decisions, AI Advisor, Analytics, and Profile.*

### 🔑 Authentication Flow (Stack)
*   **UI Style:** Minimalist, centered. Large logo at the top. Lots of whitespace.
*   **Screens:**
    *   `LoginScreen`: Email input, Password input, large solid "Sign In" button, subtle "Create Account" text link.
    *   `RegisterScreen`: First Name, Last Name, Email, Password, large solid "Sign Up" button.
*   **Data Mapping:**
    *   `POST /api/v1/auth/login`
    *   `POST /api/v1/auth/register`
*   **State:** Use SecureStore to save `accessToken` and `refreshToken`.

---

### Tab 1: 🏠 Dashboard (Home)
**Purpose:** A daily launchpad providing immediate awareness of pending actions, recent outcomes, and top-level insights.
*   **Header:** "Good morning, [Name]" fetched from user profile.
*   **UI Elements:**
    *   **Action Required Widget:** A horizontal scroll or prominent stacked list of `outcomeReminders` (Check-ins) that are `status="pending"`. Tapping opens a quick modal to record the outcome.
    *   **Quick Actions Row:** 2-3 circular icon buttons (e.g., "New Decision" -> `+`, "Ask AI" -> `Sparkles`).
    *   **Mini Insight Card:** The top actionable AI insight displayed prominently in a highlighted surface.
    *   **Recent Activity:** A feed showing the last 3 active decisions or recently recorded outcomes.
*   **Data Mapping:**
    *   `GET /api/v1/users/me` (Greeting)
    *   `GET /api/v1/outcomes/pending-checkins` (Alerts)
    *   `GET /api/v1/analytics/insights` (Top insight)
    *   `GET /api/v1/decisions?limit=3&sortOrder=desc` (Feed)

---

### Tab 2: ⚖️ Decisions (The Core Manager)

**Screen 2A: Decision List (`DecisionListScreen`)**
*   **UI Elements:**
    *   Search bar at the top, bordered by a subtle filter icon (Filter by: Category, Status dropdowns).
    *   **List View:** Clean, wide cards showing: Decision Title, Category Badge, Status Badge (Active/Archived), Confidence Level (represented as a visual colored dot or bar), and Date.
    *   **FAB:** Floating Action Button aggressively positioned bottom-right for "Add Decision".
*   **Data Mapping:** `GET /api/v1/decisions?page=1&limit=20`

**Screen 2B: Decision Detail (`DecisionDetailScreen`)**
*   **UI Elements:**
    *   Large topography header with the full title.
    *   A Segmented Control (Tabs) to switch views:
        *   *Context:* Description, Reasoning, Alternatives considered, Expected Outcomes metrics.
        *   *Outcomes (Timeline):* A vertical timeline tracking the origin date and all subsequent check-in outcomes. card per check-in.
    *   Secondary button: "Analyze with AI" (deep links to AI tab with decision ID).
*   **Data Mapping:**
    *   `GET /api/v1/decisions/:id`
    *   `GET /api/v1/outcomes?decision_id=:id`

**Screen 2C: Create/Edit Decision Flow (`DecisionFormScreen` or Wizard)**
*   **UI Elements:**
    *   To reduce cognitive load on mobile, split this into a multi-step wizard, or a long fluid scrolling form.
    *   *Step 1:* Basic Info (Title, Category, Description).
    *   *Step 2:* Context & Alternatives (Add option entries).
    *   *Step 3:* Expected Outcomes (Metrics, Dates) & Confidence Slider (1-10).
    *   Option dropdown at the top to "Autofill from Template" fetching from `GET /api/v1/templates`.
*   **Data Mapping:** `POST /api/v1/decisions`

---

### Tab 3: 🧠 AI Advisor (Chat)
**Purpose:** Conversational interface supporting decision evaluation and framework recommendations.
*   **UI Elements:**
    *   **Header:** Session switcher button (to view past threads), "New Chat" icon.
    *   **Interface:** Standard chat bubbles.
        *   *User bubbles:* Accent color background (`#4F46E5`), white text. Right-aligned.
        *   *AI bubbles:* Muted surface background (`#F3F4F6`), dark text. Left-aligned. **Crucial:** Needs markdown rendering support for bolding, bullet lists, and structured AI output.
    *   **Suggestions (Empty State):** Pre-canned prompt chips like "Help me evaluate a job offer" or "What framework should I use for a big purchase?".
    *   **Input Area:** Text input, an "Attach" paperclip icon to link the chat to a specific existing decision, Send button.
*   **Data Mapping:**
    *   `POST /api/v1/ai/chat` (Send message)
    *   `GET /api/v1/ai/chat/sessions` (Sidebar/Drawer history)

---

### Tab 4: 📊 Analytics & Insights
**Purpose:** Visualizing the user's decision-making track record and AI-identified patterns.
*   **UI Elements:**
    *   **Summary Cards (Top):** A grid of 3-4 metrics (Total Decisions, Avg Confidence, Avg Satisfaction Score). Large numbers, small labels.
    *   **Quality Timeline Chart:** A beautiful, responsive line chart showing `Decision Quality Over Time`. (Use libraries like `react-native-chart-kit` or `react-native-gifted-charts`). Smooth bezier curves.
    *   **AI Patterns Feed:** Cards explaining learned patterns (e.g., "75% of your high-confidence career decisions end in success"). Include swipe-to-dismiss functionality.
*   **Data Mapping:**
    *   `GET /api/v1/analytics/summary`
    *   `GET /api/v1/analytics/decision-quality-over-time`
    *   `GET /api/v1/analytics/patterns`

---

### Tab 5: 👤 Profile & Setup
**Purpose:** App configuration, managing frameworks, templates, and logging out.
*   **UI Elements:**
    *   **Header:** Large bold name, email, simple rounded avatar placeholder.
    *   **Settings List Items:** Clean rows with right chevrons (`>`).
        *   *Account:* Edit Profile (Bio, Location), Notification Preferences (Push/Email toggles).
        *   *Library:* Manage Custom Frameworks (`FrameworkListScreen`), Manage Templates (`TemplateListScreen`).
        *   *System/App:* Theme (Light/Dark Switch), Logout (Red text).
*   **Data Mapping:**
    *   `GET/PUT /api/v1/users/me/profile`
    *   `POST /api/v1/auth/logout`

---

## 🛠 3. Technical Implementation & Flow Hints

### Navigation Architecture (React Navigation structure suggestion)
```javascript
RootStack (Native Stack)
  ├─ AuthStack
  │   ├─ Login
  │   └─ Register
  └─ MainTabNav (Bottom Tabs)
      ├─ HomeStack (Dashboard, OutcomeFormModal)
      ├─ DecisionsStack (List, Detail, FormWizard)
      ├─ AIStack (Chat, History)
      ├─ AnalyticsStack (Charts, InsightsList)
      └─ ProfileStack (Settings, Frameworks, Templates)
```

### State Management & Data Fetching
*   **Recommended:** Use **React Query (`@tanstack/react-query`)**.
    *   *Why?* The app relies heavily on rapidly updated server state (decisions, outcomes, AI chats). React Query automatically handles caching, background refetching (on app focus), and gives you clean `isLoading` / `isError` states out of the box. Absolutely critical for a smooth mobile experience.
*   **Auth State:** A lightweight global store (Context API or Zustand) holding the `accessToken`.

### Handling Pending Outcomes (Check-ins)
*   When a user clicks a "Pending Check-in" from the Dashboard, do not navigate away deeply—open a **Bottom Sheet** or **Modal** (`OutcomeFormScreen`).
*   *UI:* "How did [Decision Title] turn out?"
*   *Inputs:* Large Satisfaction Slider (1-10), "Would you do it again?" (Yes/No toggle buttons), Text area for actual results.
*   *Action Flow:* Submit to `POST /api/v1/outcomes`, upon success automatically call `POST /api/v1/outcomes/checkins/:id/complete` to clear the reminder, then close the sheet.

### Markdown Rendering
*   The AI API endpoint outputs structured text (strengths, weaknesses, suggestions).
*   Use a library like `react-native-markdown-display` wrapped around the AI's chat bubble text to ensure bolding, lists, and formatting look native.

### Skeleton Loading (Crucial for the "Premium" Feel)
*   Do not use standard spinning Activity Indicators (`<ActivityIndicator />`) full-screen.
*   When fetching `/api/v1/decisions` or the Dashboard, display 3-4 blank card skeletons with generic container shapes and apply an animated shimmer effect (e.g., `react-native-reanimated-carousel` or custom reanimated shimmer).

---

## 🚀 4. Prompting Google Stitch (idx) / AI Generators

When passing this document into an AI UI generator (like Stitch), use the following directive:

> *"Act as an expert React Native developer. Build an Expo application following the attached **LifeOS Architecture Guide**. Start by generating the `MainTabNav` bottom tab router and the initial `Dashboard` screen. Use a minimalist design strictly adhering to the specified color palette (Accent: `#4F46E5`, Background: `#F9FAFB`). Use React Navigation, functional components with hooks, and cleanly separated StyleSheet objects. Assume the existence of an `api.js` client that handles JWT bearer tokens based on the endpoints described. Prioritize extensive whitespace, rounded corners (sm/md/full), and a highly premium feel over dense or borders-heavy UI."*
