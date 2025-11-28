# Note to Self - Mental Wellness & Journaling App

A modern, calming mental wellness and journaling web application designed to help users reflect, track moods, write daily notes, practice gratitude, and receive gentle affirmations.

## Features

### Home Dashboard
- Personalized welcome message
- Daily affirmation that changes dynamically
- Quick access to journal and insights

### Daily Journal
- Simple text editor for writing thoughts
- Mood tracker with 5 emotional states (Amazing, Good, Okay, Low, Difficult)
- Gratitude section for listing 3 things you're grateful for
- All entries saved with timestamps

### Past Journals
- Browse and review all previous journal entries
- View detailed entry information including mood, date, and gratitude items
- Click to expand and read full journal entries
- Beautiful card-based layout with mood emojis

### Wellness Insights
- Visual mood history using charts
- Statistics showing total entries and weekly activity
- Track your emotional patterns over time

### Affirmations Library
- Curated collection of uplifting affirmations
- Featured affirmation that refreshes randomly
- Beautiful card-based layout

### Profile Settings
- Account information display
- Dark/Light mode toggle
- Export journal entries as text file

## Design System

- **Primary Color**: Blue (#4A90E2)
- **Secondary Color**: Light Blue (#5DADE2)
- **Accent Color**: Sky Blue (#85C1E9)
- **Theme**: Modern dark mode with blue tones, calming and minimalist
- **Default Mode**: Dark mode with optional light mode toggle
- **Visual Style**: Emojis and beautiful imagery for emotional engagement

## Technical Stack

- React 18 (production build)
- TailwindCSS for styling
- Chart.js for data visualization
- Trickle Database for data persistence
- Lucide icons

## Pages

1. `index.html` - Home dashboard with daily affirmation
2. `journal.html` - Daily journaling interface with mood tracker
3. `past-journals.html` - Browse and review past journal entries
4. `insights.html` - Mood analytics and statistics with charts
5. `affirmations.html` - Affirmations library
6. `profile.html` - User settings and data export

## Database Structure

- **user**: Stores user accounts (name, email, password)
- **journal:{userId}**: Stores journal entries per user (entry, mood, gratitude, date)

## Copyright

© 2025 Note to Self. All rights reserved.