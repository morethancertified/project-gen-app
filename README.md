# DevOps Project Generator

A SvelteKit application that uses OpenAI's GPT-4o to generate customized DevOps projects based on skills, job requirements, difficulty level, and duration.

## Features

- Generate DevOps projects based on specified skills/job requirements
- Customize difficulty level (beginner, intermediate, advanced)
- Set project duration (from days to months)
- Dark/light mode support
- Responsive design following the MTC style guide
- Powered by OpenAI's GPT-4o model

## Setup

1. Clone the repository
2. Install dependencies with `bun install`
3. Create a `.env` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Development

Start the development server:

```bash
bun run dev
```

Open the app in a new browser tab:

```bash
bun run dev --open
```

## Building for Production

Create a production build:

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## How It Works

1. Enter skills or job requirements (e.g., Docker, Kubernetes, AWS)
2. Select difficulty level and project duration
3. Click "Generate Project"
4. The app sends a request to OpenAI's GPT-4o model
5. The model generates a structured DevOps project with:
   - Title and description
   - Required skills
   - Project objectives
   - Detailed tasks with resources
   - Deliverables
   - Learning outcomes
