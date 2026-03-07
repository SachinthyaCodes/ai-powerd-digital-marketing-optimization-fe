# Marketing Strategy Recommender - Frontend

A modern, minimalistic Next.js frontend application for collecting comprehensive business information to generate personalized marketing strategy recommendations. This application is designed to work with a Python FastAPI backend.

## Features

✨ **Multi-step Form Interface**
- 8 comprehensive sections covering all aspects of business marketing needs
- Progressive completion with step-by-step navigation
- Real-time form validation and data persistence

🎨 **Modern Design**
- Clean, minimalistic interface with white background
- Flat colors and modern typography
- Responsive design for desktop and mobile
- Tailwind CSS for styling

📋 **Comprehensive Data Collection**
- **Business Profile**: Type, size, stage, location, USP
- **Budget & Resources**: Marketing budget, team capacity, content creation abilities
- **Business Goals**: Primary and secondary marketing objectives
- **Target Audience**: Demographics, interests, buying behavior
- **Platforms & Preferences**: Social media preferences, brand assets
- **Current Challenges**: Marketing pain points and obstacles
- **Strengths & Opportunities**: Business advantages and growth potential
- **Market Situation**: Seasonality, competition, pricing changes

🔄 **Backend Integration Ready**
- Configured for FastAPI backend integration
- API endpoints ready for strategy recommendation requests
- JSON data structure optimized for AI processing

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management and validation
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Gittt

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketing-strategy-recommender-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page with form wizard
├── components/            # Reusable components
│   ├── StepIndicator.tsx  # Progress indicator component
│   └── steps/             # Form step components
│       ├── BusinessProfileStep.tsx
│       ├── BudgetResourcesStep.tsx
│       ├── BusinessGoalsStep.tsx
│       ├── TargetAudienceStep.tsx
│       ├── PlatformsPreferencesStep.tsx
│       ├── CurrentChallengesStep.tsx
│       ├── StrengthsOpportunitiesStep.tsx
│       ├── MarketSituationStep.tsx
│       └── ReviewStep.tsx
├── types/                 # TypeScript type definitions
│   └── index.ts          # Form data interfaces
└── styles/               # Global styles
    └── globals.css       # Tailwind CSS imports and custom styles
```

## Backend Integration

The frontend is configured to work with a FastAPI backend running on `http://localhost:8000`. 

### API Endpoint Expected

```typescript
POST /api/strategy-recommendations
Content-Type: application/json

{
  businessProfile: { ... },
  budgetResources: { ... },
  businessGoals: { ... },
  targetAudience: { ... },
  platformsPreferences: { ... },
  currentChallenges: { ... },
  strengthsOpportunities: { ... },
  marketSituation: { ... }
}
```

### Backend Setup

Make sure your Python FastAPI backend:
1. Accepts the above JSON structure
2. Runs on port 8000
3. Has CORS configured to allow requests from `http://localhost:3000`
4. Returns marketing strategy recommendations

Example FastAPI CORS configuration:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Form Data Structure

The application collects data in a structured format that includes:

### Business Profile
- Business type/industry
- Business size (solo, small team, medium, large)
- Business stage (new, growing, established)
- Location details
- Products/services description
- Unique selling proposition

### Marketing Budget & Resources
- Monthly marketing budget ranges
- Team structure (solo vs team)
- Content creation capabilities

### Business Goals
- Primary marketing goals (brand awareness, leads, sales, etc.)
- Secondary objectives

### Target Audience
- Demographics (age, gender, income)
- Geographic location
- Interests and behaviors
- Buying frequency patterns

### Platform Preferences
- Preferred social media platforms
- Experience level on each platform
- Brand assets (logo, style guide, colors)

### Challenges & Opportunities
- Current marketing challenges
- Business strengths
- Growth opportunities

### Market Situation
- Seasonality factors
- Competitor behavior
- Stock availability
- Recent pricing changes

## Customization

### Styling
The application uses Tailwind CSS with a custom color scheme. You can modify the colors in `tailwind.config.js`:

```javascript
colors: {
  primary: { /* Blue color palette */ },
  secondary: { /* Gray color palette */ },
  success: { /* Green color palette */ },
  warning: { /* Yellow/Orange color palette */ }
}
```

### Adding New Form Sections
1. Create a new step component in `src/components/steps/`
2. Add the step configuration to the `STEPS` array in `src/app/page.tsx`
3. Add the corresponding type definitions in `src/types/index.ts`
4. Update the switch statement in the main page component

### Form Validation
Form validation is handled by React Hook Form. Each step component includes required field validation and custom validation rules as needed.

## Development

### Code Structure
- Components use TypeScript with proper type definitions
- Form state is managed using React Hook Form
- Each step component is self-contained and reusable
- Data flows up to the main page component through callback props

### State Management
- Form data is managed at the page level
- Each step receives current data and an update callback
- Data persists as users navigate between steps
- Form submission is handled centrally

## License

This project is created for marketing strategy recommendation purposes. See LICENSE file for details.

## Support

For technical support or questions about integration:
1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include relevant code snippets and error messages

---

Built with ❤️ using Next.js and modern web technologies.
