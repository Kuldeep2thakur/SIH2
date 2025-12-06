# SymbioMed Terminology Service - Project Structure

## 📁 Complete File Structure

```
symbiomed1/
├── public/
│   ├── WhatsApp Image 2025-09-23 at 15.12.01_7162a348.jpg  # Custom logo
│   └── vite.svg                                             # (not used)
│
├── src/
│   ├── components/                    # Reusable UI Components
│   │   ├── ApiCard.jsx               # Card wrapper for API sections
│   │   ├── ErrorMessage.jsx          # Error display with retry
│   │   ├── Layout.jsx                # Main layout with navbar & footer
│   │   └── Loading.jsx               # Loading spinner component
│   │
│   ├── pages/                        # Page Components (Routes)
│   │   ├── SearchPage.jsx           # Page 1: Unified Search
│   │   ├── MappingPage.jsx          # Page 2: NAMASTE → TM2 Mapping
│   │   ├── FHIRBuilder.jsx          # Page 3: FHIR Condition Builder
│   │   └── APIPlayground.jsx        # Page 4: API Testing Playground
│   │
│   ├── App.jsx                       # Main app with routing
│   ├── App.css                       # Additional styles (minimal)
│   ├── index.css                     # Main Tailwind CSS & custom styles
│   └── main.jsx                      # App entry point
│
├── index.html                        # HTML template with favicon
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
│
├── API_INTEGRATION_SUMMARY.md        # 📄 API integration documentation
├── TESTING_GUIDE.md                  # 📄 Testing instructions
└── README.md                         # Project readme

```

---

## 📄 File Descriptions

### Components

#### `Layout.jsx`
**Purpose**: Main layout wrapper with navbar and footer

**Features**:
- Custom logo image (no SVG icon)
- "SYMBIOMED" branding (uppercase)
- Mobile-responsive navbar with hamburger menu
- Desktop navigation with 3 main links
- Footer with branding
- GSAP page transition animations

**Navigation Items**:
- 🔍 Unified Search
- 📝 FHIR Builder  
- 🧪 API Playground

#### `ApiCard.jsx`
**Purpose**: Reusable card component for consistent UI

**Props**:
- `title` - Card title
- `description` - Card description
- `icon` - Emoji icon
- `children` - Card content

**Used In**: All pages for consistent card design

#### `Loading.jsx`
**Purpose**: Loading spinner with customizable message

**Props**:
- `message` - Loading message (default: "Loading...")

**Features**:
- Animated spinner
- Blue gradient color scheme

#### `ErrorMessage.jsx`
**Purpose**: Error display component

**Props**:
- `message` - Error message text
- `onRetry` - Optional retry callback

**Features**:
- Red error styling
- Optional retry button

---

### Pages

#### `SearchPage.jsx` (/)
**API**: `GET /fhir/ValueSet/$expand`

**State Management**:
- `searchTerm` - User input
- `results` - Search results array
- `loading` - Loading state
- `error` - Error message
- `hasSearched` - Track if search was performed

**Features**:
- Search input with auto-focus
- Animated result cards (GSAP stagger)
- Click to navigate to mapping page
- Empty state handling
- Info section explaining how it works

#### `MappingPage.jsx` (/mapping/:code)
**APIs**: 
- `GET /fhir/CodeSystem/$lookup`
- `GET /fhir/ConceptMap/$translate`

**State Management**:
- `codeDetails` - Lookup result
- `mappingData` - Translation result
- `loading` - Loading state
- `error` - Error message

**Features**:
- Two-column layout (code details + mapping)
- "Back to Search" button
- "Generate FHIR Condition" button
- "Test in API Playground" button
- Collapsible raw JSON viewer
- Color-coded information cards

#### `FHIRBuilder.jsx` (/fhir-builder)
**APIs**:
- `POST /fhir/ingest/problem-list`
- `POST /fhir/validate/dual-code`

**State Management**:
- `formData` - Form fields object
- `loading` - Create operation loading
- `validating` - Validation operation loading
- `error` - Error message
- `response` - Create response
- `validationResponse` - Validation response

**Form Fields**:
- AYUSH Code (text input)
- AYUSH System (text input, pre-filled)
- Clinical Status (dropdown)
- Verification Status (dropdown)
- Encounter Class (dropdown)
- Onset Date (date picker, auto-filled)

**Features**:
- Two separate operations (create & validate)
- Success/failure visual feedback
- JSON response display
- Pre-population from navigation state
- Info section about problem list entries

#### `APIPlayground.jsx` (/api-playground)
**APIs**: All 10 endpoints

**State Management**:
- `activeTab` - Current tab (lookup/translate/validate/bundle)
- Tab-specific state for each operation
- `loading`, `error`, `response` - Shared API states

**Tabs**:
1. **$lookup** - CodeSystem lookup
2. **$translate** - ConceptMap translation
3. **$validate-code** - Validation (GET & POST)
4. **Bundle** - Get & Upload bundle

**Features**:
- Tab navigation
- Input forms for each endpoint
- JSON response viewer
- Health check section
- Clear API endpoint labels

---

### Styling

#### `index.css`
**Purpose**: Main stylesheet with Tailwind + custom styles

**Custom Classes**:
- `.btn-primary` - Blue gradient button
- `.btn-secondary` - Orange gradient button
- `.input-field` - Styled input with focus state
- `.badge` - Badge component (4 color variants)
- `.section-title` - Page title styling
- `.page-container` - Page wrapper with padding
- `.loading-spinner` - Spinner animation
- `.code-block` - JSON code block (dark theme)
- `.glass-card` - Glassmorphism card effect
- `.text-gradient` - Blue gradient text
- `.text-gradient-ayush` - Orange gradient text

**Features**:
- Google Fonts (Inter, Outfit)
- Custom scrollbar styling
- Smooth scroll behavior
- Focus-visible accessibility
- Responsive utilities

#### `App.css`
**Purpose**: Minimal additional styles (mostly unused Vite defaults)

---

### Configuration Files

#### `package.json`
**Key Dependencies**:
- `react` - UI framework
- `react-router-dom` - Routing
- `gsap` - Animations
- `tailwindcss` - Styling
- `vite` - Build tool

#### `vite.config.js`
- React plugin configuration
- Dev server settings

#### `tailwind.config.js`
- Tailwind CSS configuration
- Custom color extensions (if any)

#### `index.html`
**Important**:
- Custom favicon: `/WhatsApp Image 2025-09-23 at 15.12.01_7162a348.jpg`
- SEO meta tags
- Title: "SymbioMed Terminology Service - SIH 2024"

---

## 🔄 Data Flow

### Search Flow
```
User Input → SearchPage
    ↓
GET /fhir/ValueSet/$expand
    ↓
Display Results
    ↓
Click Result → Navigate to MappingPage(code)
```

### Mapping Flow
```
MappingPage receives code parameter
    ↓
Parallel API calls:
  - GET /fhir/CodeSystem/$lookup (code details)
  - GET /fhir/ConceptMap/$translate (mapping)
    ↓
Display both results
    ↓
User clicks "Generate FHIR Condition"
    ↓
Navigate to FHIRBuilder with state { code, codeDetails }
```

### FHIR Builder Flow
```
FHIRBuilder receives state (optional)
    ↓
Pre-fill form with passed code
    ↓
User fills/modifies form
    ↓
Submit → POST /fhir/ingest/problem-list
    ↓
Display JSON response
    ↓
Optional: Validate → POST /fhir/validate/dual-code
    ↓
Display validation result
```

### API Playground Flow
```
User selects tab
    ↓
Fill input fields
    ↓
Click action button
    ↓
Make API call (GET or POST)
    ↓
Display JSON response
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (`blue-600`, `blue-700`, etc.)
- **Secondary**: Orange (`#dd8000`, `#b46600`)
- **Success**: Green (`green-50`, `green-700`)
- **Error**: Red (`red-50`, `red-700`)
- **Warning**: Yellow (`yellow-50`, `yellow-700`)
- **Neutral**: Slate (`slate-50` to `slate-900`)

### Typography
- **Display Font**: Outfit (headings, branding)
- **Body Font**: Inter (paragraphs, UI)
- **Code Font**: Monospace (JSON, endpoints)

### Spacing
- Cards: `p-6`, `p-8`
- Sections: `mb-8`, `mb-12`
- Grid gaps: `gap-4`, `gap-6`

### Animations
- Page transitions: GSAP fade + slide up
- Result stagger: GSAP stagger animation
- Hover effects: Tailwind transitions
- Button states: Scale, shadow, color changes

---

## 🚀 Build & Deploy

### Development
```bash
npm install
npm run dev
```
Runs on `http://localhost:5173`

### Production Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview Production Build
```bash
npm run preview
```

---

## 📊 Component Hierarchy

```
App
  └── Router
       └── Layout
            ├── Navbar (custom logo, nav links)
            ├── Routes
            │    ├── Route "/" → SearchPage
            │    │    └── ApiCard
            │    │         ├── Search form
            │    │         ├── Loading
            │    │         ├── ErrorMessage
            │    │         └── Result cards
            │    │
            │    ├── Route "/mapping/:code" → MappingPage
            │    │    ├── ApiCard (code details)
            │    │    ├── ApiCard (mapping)
            │    │    ├── ApiCard (actions)
            │    │    ├── Loading
            │    │    └── ErrorMessage
            │    │
            │    ├── Route "/fhir-builder" → FHIRBuilder
            │    │    ├── ApiCard (form)
            │    │    ├── ApiCard (response)
            │    │    ├── ApiCard (validation)
            │    │    └── ErrorMessage
            │    │
            │    └── Route "/api-playground" → APIPlayground
            │         ├── Tab buttons
            │         ├── ApiCard (input)
            │         ├── ApiCard (response)
            │         └── ApiCard (health check)
            │
            └── Footer
```

---

## ✅ Code Quality

### Best Practices Implemented
- ✅ Component reusability (ApiCard, Loading, ErrorMessage)
- ✅ Consistent error handling
- ✅ Loading states for all async operations
- ✅ Clean separation of concerns
- ✅ Responsive design throughout
- ✅ Accessibility (focus states, semantic HTML)
- ✅ Hardcoded URLs (no environment variables needed)
- ✅ Pure client-side (no server required)

### Performance
- ✅ Lazy loading not needed (small app)
- ✅ Optimized animations (GSAP)
- ✅ Efficient re-renders (React best practices)
- ✅ Minimal dependencies

---

**Last Updated**: December 5, 2025  
**Project Status**: ✅ Complete & Production Ready
