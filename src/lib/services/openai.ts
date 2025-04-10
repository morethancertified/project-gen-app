import { env } from '$env/dynamic/private';
import OpenAI from 'openai';

// Initialize the OpenAI client
const apiKey = env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key' // Fallback to prevent crash, will fail gracefully
});

/**
 * Generate a DevOps project based on the provided parameters
 * @param skills - List of skills or job requirements
 * @param difficulty - Difficulty level of the project
 * @param duration - Expected duration to complete the project
 * @returns The generated project details
 */
export async function generateDevOpsProject(
  skills: string[],
  difficulty: string,
  duration: string
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a DevOps project generator. Create a detailed, practical DevOps project based on the provided skills, difficulty level, and duration. 
          The project should be realistic, educational, and help someone practice the specified skills.
          
          Format your response as a JSON object with the following structure:
          {
            "title": "Project title",
            "description": "Brief overview of the project",
            "skills": ["skill1", "skill2", ...],
            "difficulty": "beginner/intermediate/advanced",
            "duration": "estimated completion time",
            "objectives": ["objective1", "objective2", ...],
            "tasks": [
              {
                "title": "Task 1",
                "description": "Detailed description of task 1",
                "resources": ["resource1", "resource2", ...]
              },
              ...
            ],
            "deliverables": ["deliverable1", "deliverable2", ...],
            "learningOutcomes": ["outcome1", "outcome2", ...]
          }`
        },
        {
          role: 'user',
          content: `Generate a DevOps project with the following parameters:
          - Skills/Job Requirements: ${skills.join(', ')}
          - Difficulty: ${difficulty}
          - Duration: ${duration}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating DevOps project:', error);
    throw error;
  }
}
