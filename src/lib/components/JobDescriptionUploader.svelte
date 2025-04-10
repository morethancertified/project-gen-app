<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let skillsList: string[] = [];
  
  let jobDescription = '';
  let isProcessing = false;
  let error: string | null = null;
  
  const dispatch = createEventDispatcher();
  
  async function extractSkills() {
    if (!jobDescription.trim()) {
      error = 'Please enter a job description';
      return;
    }
    
    error = null;
    isProcessing = true;
    
    try {
      const response = await fetch('/api/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobDescription })
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract skills from job description');
      }
      
      const data = await response.json();
      
      // Add extracted skills to the list
      if (data.skills && data.skills.length > 0) {
        const newSkills = data.skills.filter(
          (skill: string) => !skillsList.includes(skill.trim())
        );
        
        if (newSkills.length > 0) {
          dispatch('updateSkills', { skills: [...skillsList, ...newSkills] });
          jobDescription = '';
        } else {
          error = 'No new skills found in the job description';
        }
      } else {
        error = 'No skills found in the job description';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'An unexpected error occurred';
    } finally {
      isProcessing = false;
    }
  }
  
  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      jobDescription = e.target?.result as string || '';
    };
    
    reader.onerror = () => {
      error = 'Failed to read file';
    };
    
    reader.readAsText(file);
  }
</script>

<div class="job-description-uploader">
  <h3>Extract Skills from Job Description</h3>
  <p class="help-text">Paste a job description or upload a file to automatically extract relevant technologies</p>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <div class="upload-area">
    <textarea
      bind:value={jobDescription}
      placeholder="Paste job description here..."
      rows="6"
      class="job-description-input"
    ></textarea>
    
    <div class="file-upload">
      <label for="file-upload" class="btn btn-secondary">
        <span>Upload File</span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".txt,.pdf,.docx,.md"
        on:change={handleFileUpload}
        class="hidden-input"
      />
    </div>
    
    <button
      class="btn btn-primary extract-btn"
      on:click={extractSkills}
      disabled={isProcessing || !jobDescription.trim()}
    >
      {#if isProcessing}
        <span>Processing...</span>
      {:else}
        <span>Extract Skills</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .job-description-uploader {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }
  
  .help-text {
    font-size: 0.875rem;
    color: var(--text-color);
    opacity: 0.8;
    margin-bottom: 1rem;
  }
  
  .job-description-input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--border-color);
    background-color: var(--card-bg);
    color: var(--text-color);
    font-size: 0.875rem;
    resize: vertical;
    margin-bottom: 1rem;
    transition: all 0.2s ease;
  }
  
  .job-description-input:focus {
    border-color: var(--cyan);
    box-shadow: 0 0 0 2px rgba(0, 206, 209, 0.2);
    outline: none;
  }
  
  .job-description-input:hover {
    border-color: var(--cyan);
  }
  
  .file-upload {
    margin-bottom: 1rem;
  }
  
  .hidden-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .error {
    color: #ef4444;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
  
  .extract-btn {
    width: 100%;
  }
</style>
