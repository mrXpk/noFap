# NoFap Commitment Journal App 🎯

A powerful mobile application built with React Native and Expo to help users develop self-discipline and maintain healthy lifestyle habits through streak tracking and motivational tools.

## ✨ Features

### 🏛️ Complete Onboarding Flow
- **Welcome Screen**: Bible-inspired sacred aesthetic with wooden textures
- **Commitment Agreement**: Digital signature pad for ceremonial commitment
- **Quiz Screens**: Multiple-choice questionnaires for motivation and struggles
- **WHY Reflection**: Personal journaling for goal setting
- **Visualization**: Cinematic motivation and goal visualization
- **Final Push**: Inspirational testimonials and account creation

### 🔐 Authentication System
- **Login/Signup**: Secure user authentication
- **Get Premium**: Modern subscription screen with multiple plans
- **Data Security**: Secure storage of user progress and commitments

### 🏠 Main Dashboard
- **Streak Counter**: Large golden serif display of current streak
- **Daily Ritual**: "Sign Today" button for daily check-ins
- **Panic Button**: Emergency motivation access (floating button)
- **Navigation**: Quick access to Calendar, History, and Your WHY

### 💎 Premium Features
- Advanced Analytics for pattern tracking
- Unlimited Panic Button quotes
- Accountability Mode with progress reports
- Custom themes and personalization
- Priority community access

## 🎨 Design System

### Bible-Inspired Aesthetic
- **Colors**: Warm wooden tones, parchment backgrounds, golden accents
- **Typography**: Sacred serif fonts with proper hierarchy
- **Components**: Ceremonial feel with manuscript-style cards
- **Sacred Symbols**: Cross icons and biblical verse references

### Modern Premium UI
- **Glassmorphism**: Semi-transparent cards with blur effects
- **Gradients**: Smooth color transitions for premium feel
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Optimized for various screen sizes

## 🔧 Technical Stack

- **Framework**: React Native with Expo (v54.0.7)
- **Language**: TypeScript for type safety
- **Navigation**: expo-router for file-based routing
- **Styling**: expo-linear-gradient, custom StyleSheet
- **Storage**: AsyncStorage for local data persistence
- **Architecture**: Modular component-based structure

## 📱 Navigation Flow

```
Welcome → Commitment → Quiz (Motivation) → Quiz (Struggles) → WHY Reflection 
    ↓
Visualization → Final Push → Login/Signup → Get Premium → Dashboard
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- Android Studio or Xcode (for emulators)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd noFap2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Scan QR code with Expo Go app
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

## 📂 Project Structure

```
noFap2/
├── app/                          # Navigation routes
│   ├── index.tsx                # Welcome screen route
│   ├── commitment.tsx           # Commitment agreement route
│   ├── quiz-motivation.tsx      # Motivation quiz route
│   ├── quiz-struggle.tsx        # Struggle quiz route
│   ├── why-reflection.tsx       # WHY reflection route
│   ├── visualization.tsx        # Visualization route
│   ├── final-push.tsx          # Final push route
│   ├── login.tsx               # Login route
│   ├── signup.tsx              # Signup route
│   ├── get-premium.tsx         # Premium subscription route
│   └── dashboard.tsx           # Main dashboard route
├── components/                   # Reusable UI components
│   ├── WelcomeScreen.tsx
│   ├── CommitmentAgreementScreen.tsx
│   ├── QuizMotivationScreen.tsx
│   ├── QuizStruggleScreen.tsx
│   ├── WhyReflectionScreen.tsx
│   ├── VisualizationScreen.tsx
│   ├── FinalPushScreen.tsx
│   ├── GetPremiumScreen.tsx
│   ├── MainDashboard.tsx
│   └── ProgressIndicator.tsx
├── constants/
│   └── theme.ts                 # Color palette and design tokens
└── package.json
```

## 🎯 Key Components

### WelcomeScreen
- Sacred sunrise animation with crosses and stars
- Bible verse inspiration
- "I'm Ready" call-to-action button

### CommitmentAgreementScreen
- Scrollable manifesto text
- Digital signature pad (optional)
- Ceremonial confirmation dialog

### Quiz Screens
- Multiple selection capability
- Progress indicators
- Dynamic button text based on selections

### GetPremiumScreen
- Modern subscription UI with 3 plans
- Conversion-focused design
- Orange/amber gradient theme

### MainDashboard
- Golden streak counter
- Floating panic button with glow effects
- Bottom navigation for key features

## 🔄 State Management

- React hooks for local state
- AsyncStorage for persistent data
- Context-free architecture for simplicity

## 🎨 Styling Approach

- Bible-inspired color palette
- Consistent spacing and typography
- Glassmorphism and gradient effects
- Platform-specific shadow handling

## 📦 Dependencies

```json
{
  "expo": "~54.0.7",
  "react": "^18.3.1",
  "react-native": "0.81.4",
  "expo-router": "6.0.4",
  "expo-linear-gradient": "~14.0.2",
  "react-native-signature-canvas": "^4.7.2",
  "typescript": "^5.9.2"
}
```

## 🚢 Deployment

### Expo Build Service
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for production
eas build --platform all
```

## 📝 Development Notes

- Components follow modular architecture for reusability
- Navigation uses expo-router file-based system
- Styling maintains consistency with design system
- TypeScript ensures type safety throughout
- AsyncStorage provides offline-first experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Bible verses and spiritual inspiration
- Modern app design patterns
- React Native and Expo communities
- Contributors and testers

---

**Built with ❤️ for personal transformation and self-discipline**