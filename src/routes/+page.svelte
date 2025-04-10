<script lang="ts">
  import { onMount } from 'svelte';

  // Define types for our data
  type Task = {
    title: string;
    description: string;
    resources?: string[];
  };

  type GeneratedProject = {
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    skills: string[];
    objectives: string[];
    tasks: Task[];
    deliverables: string[];
    learningOutcomes: string[];
  };

  // Form state
  let skills = '';
  let skillsList: string[] = [];
  let difficulty = 'intermediate';
  let duration = '1-2 weeks';
  let isGenerating = false;
  let error: string | null = null;
  let generatedProject: GeneratedProject | null = null;
  let completedDeliverables: Record<number, boolean> = {};
  
  onMount(() => {
    // Listen for theme changes to ensure forms update correctly
    window.addEventListener('themeChanged', () => {
      // Force Svelte to update the component
      skills = skills;
    });
  });

  // Handle adding skills
  function addSkill() {
    if (skills.trim() !== '' && !skillsList.includes(skills.trim())) {
      skillsList = [...skillsList, skills.trim()];
      skills = '';
    }
  }

  // Handle removing skills
  function removeSkill(index: number) {
    skillsList = skillsList.filter((_, i) => i !== index);
  }

  // Handle form submission
  async function generateProject() {
    if (skillsList.length === 0) {
      error = 'Please add at least one skill or job requirement';
      return;
    }

    error = null;
    isGenerating = true;
    generatedProject = null;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skills: skillsList,
          difficulty,
          duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate project');
      }

      generatedProject = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      isGenerating = false;
    }
  }
</script>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  header {
    background: linear-gradient(to right, var(--cyan), var(--purple));
    color: white;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  main {
    padding: 1rem 0;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .card {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
    background-color: var(--card-bg);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    font-weight: 500;
    margin-bottom: 0.25rem;
    display: block;
    font-size: 0.875rem;
    color: var(--text-color);
    transition: color 0.3s ease;
  }

  input, select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    width: 100%;
    box-sizing: border-box;
    background-color: var(--card-bg);
    color: var(--text-color);
    transition: all 0.2s ease;
    outline: none;
  }
  
  input:focus, select:focus {
    border-color: var(--cyan);
    box-shadow: 0 0 0 2px rgba(0, 206, 209, 0.2);
  }
  
  input:hover, select:hover {
    border-color: var(--cyan);
  }

  .input-group {
    display: flex;
    align-items: stretch;
  }

  .input-group input {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
  
  .input-group .btn-primary {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }

  .btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(to right, var(--cyan), var(--purple));
    color: white;
    font-weight: 500;
    transition: all 0.15s ease;
  }
  
  .btn-primary:active {
    transform: translateY(0);
  }

  .skill-tag {
    background: rgba(0, 206, 209, 0.1);
    color: #00CED1;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    margin-left: 0.25rem;
    color: inherit;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #00CED1;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .error {
    color: #ef4444;
    margin-bottom: 1rem;
  }

  footer {
    border-top: 1px solid #e5e7eb;
    padding: 1.5rem 0;
    margin-top: 2rem;
  }

  footer p {
    text-align: center;
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }

  ul, ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  .tag {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
  }

  .tag-cyan {
    background-color: rgba(0, 206, 209, 0.1);
    color: var(--cyan);
  }

  .tag-purple {
    background-color: rgba(138, 43, 226, 0.1);
    color: var(--purple);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  /* Checklist styles */
  .checklist {
    margin-top: 0.5rem;
  }
  
  .checklist-item {
    margin-bottom: 0.75rem;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 2rem;
    cursor: pointer;
    user-select: none;
  }
  
  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkmark {
    position: absolute;
    left: 0;
    height: 1.25rem;
    width: 1.25rem;
    background-color: #fff;
    border: 1px solid var(--gray-300);
    border-radius: 0.25rem;
  }
  
  .checkbox-container:hover input ~ .checkmark {
    background-color: var(--gray-100);
  }
  
  .checkbox-container input:checked ~ .checkmark {
    background-color: var(--cyan);
    border-color: var(--cyan);
  }
  
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }
  
  .checkbox-container .checkmark:after {
    left: 0.45rem;
    top: 0.2rem;
    width: 0.25rem;
    height: 0.5rem;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .completed-item {
    text-decoration: line-through;
    color: var(--gray-600);
  }
  
  .deliverables-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--gray-200);
  }
  
  .help-text {
    font-size: 0.875rem;
    color: var(--gray-600);
    margin-bottom: 1rem;
  }
</style>

<div>
  <header class="site-header">
    <div class="container">
      <h1>DevOps Project Generator</h1>
    </div>
  </header>

  <main>
    <div class="container">
      <div class="grid">
        <!-- Form Section -->
        <div class="card">
          <h2>Create Your Custom DevOps Project</h2>
          
          {#if error}
            <div class="error">{error}</div>
          {/if}
          
          <form on:submit|preventDefault={generateProject}>
            <div>
              <label for="skills">Skills / Job Requirements</label>
              <div class="input-group">
                <input
                  id="skills"
                  type="text"
                  bind:value={skills}
                  placeholder="e.g., Docker, Kubernetes, CI/CD"
                  on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  class="btn btn-primary"
                  on:click={addSkill}
                  disabled={!skills.trim()}
                >
                  Add
                </button>
              </div>
            </div>
            
            {#if skillsList.length > 0}
              <div class="skill-tags">
                {#each skillsList as skill, index}
                  <div class="skill-tag">
                    {skill}
                    <button
                      type="button"
                      on:click={() => removeSkill(index)}
                      class="remove-btn"
                    >
                      &times;
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
            
            <div>
              <label for="difficulty">Difficulty Level</label>
              <select
                id="difficulty"
                bind:value={difficulty}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label for="duration">Project Duration</label>
              <select
                id="duration"
                bind:value={duration}
              >
                <option value="1-2 days">1-2 days</option>
                <option value="3-5 days">3-5 days</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="3-4 weeks">3-4 weeks</option>
              </select>
            </div>
            
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isGenerating || skillsList.length === 0}
            >
              {#if isGenerating}
                <span>Generating...</span>
              {:else}
                <span>Generate Project</span>
              {/if}
            </button>
          </form>
          
          <!-- Deliverables Checklist Component -->
          {#if generatedProject}
            <div class="deliverables-section">
              <h3>Project Deliverables Checklist</h3>
              <p class="help-text">Track your progress by checking off completed items</p>
              <div class="checklist">
                {#each generatedProject.deliverables as deliverable, index}
                  <div class="checklist-item">
                    <label class="checkbox-container">
                      <input type="checkbox" bind:checked={completedDeliverables[index]} />
                      <span class="checkmark"></span>
                      <span class={completedDeliverables[index] ? 'completed-item' : ''}>{deliverable}</span>
                    </label>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        
        <!-- Results Section -->
        <div>
          {#if isGenerating}
            <div class="loading-container">
              <div class="spinner"></div>
            </div>
          {:else if generatedProject}
            <div class="card">
              <h2>{generatedProject.title}</h2>
              
              <div class="tags">
                <span class="tag tag-cyan">
                  {generatedProject.difficulty}
                </span>
                <span class="tag tag-purple">
                  {generatedProject.duration}
                </span>
              </div>
              
              <p>{generatedProject.description}</p>
              
              <h3>Skills</h3>
              <div class="tags">
                {#each generatedProject.skills as skill}
                  <span class="tag tag-cyan">{skill}</span>
                {/each}
              </div>
              
              <h3>Objectives</h3>
              <ul>
                {#each generatedProject.objectives as objective}
                  <li>{objective}</li>
                {/each}
              </ul>
              
              <h3>Tasks</h3>
              <ol>
                {#each generatedProject.tasks as task}
                  <li>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    {#if task.resources && task.resources.length > 0}
                      <div>
                        <strong>Resources:</strong>
                        <ul>
                          {#each task.resources as resource}
                            <li>{resource}</li>
                          {/each}
                        </ul>
                      </div>
                    {/if}
                  </li>
                {/each}
              </ol>
              
              <h3>Deliverables</h3>
              <ul>
                {#each generatedProject.deliverables as deliverable}
                  <li>{deliverable}</li>
                {/each}
              </ul>
              
              <h3>Learning Outcomes</h3>
              <ul>
                {#each generatedProject.learningOutcomes as outcome}
                  <li>{outcome}</li>
                {/each}
              </ul>
            </div>
          {:else}
            <div class="card" style="border-style: dashed; height: 16rem; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #6b7280;">
              <svg xmlns="http://www.w3.org/2000/svg" style="height: 3rem; width: 3rem; margin-bottom: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p style="text-align: center; font-size: 0.875rem;">Fill out the form and click "Generate Project" to create your custom DevOps project</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>
        Powered by OpenAI GPT-4o • More Than Certified DevOps Project Generator
      </p>
    </div>
  </footer>
</div>
