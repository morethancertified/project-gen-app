import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { generateDevOpsProject } from '$lib/services/openai';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { skills, difficulty, duration } = await request.json();
    
    // Validate input
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return json({ error: 'Skills are required and must be an array' }, { status: 400 });
    }
    
    if (!difficulty) {
      return json({ error: 'Difficulty is required' }, { status: 400 });
    }
    
    if (!duration) {
      return json({ error: 'Duration is required' }, { status: 400 });
    }
    
    // Generate project using OpenAI
    const project = await generateDevOpsProject(skills, difficulty, duration);
    
    return json(project);
  } catch (error) {
    console.error('Error generating project:', error);
    return json({ error: 'Failed to generate project' }, { status: 500 });
  }
};
