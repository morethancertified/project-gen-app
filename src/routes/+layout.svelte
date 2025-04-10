<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	
	// Handle dark/light mode
	let darkMode = false;
	
	// Apply dark mode to document
	function applyDarkMode(isDark: boolean): void {
		if (isDark) {
			document.documentElement.classList.add('dark-mode');
			document.body.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
			document.body.classList.remove('dark-mode');
		}
	}
	
	onMount(() => {
		// Check for saved theme preference or system preference
		const savedTheme = localStorage.getItem('mtc-dark-mode');
		
		// If there's a saved preference, use that
		if (savedTheme) {
			darkMode = savedTheme === 'true';
		} else {
			// Otherwise check system preference
			darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		
		// Apply dark mode if needed
		applyDarkMode(darkMode);
		
		// Force initial update
		setTimeout(() => {
			const event = new CustomEvent('themeChanged', { detail: { darkMode } });
			window.dispatchEvent(event);
		}, 0);
	});
	
	// Function to toggle dark mode
	function toggleDarkMode() {
		// Toggle dark mode state
		darkMode = !darkMode;
		
		// Apply dark mode changes
		applyDarkMode(darkMode);
		
		// Store user preference in localStorage
		localStorage.setItem('mtc-dark-mode', darkMode ? 'true' : 'false');
		
		// Force update of components
		const event = new CustomEvent('themeChanged', { detail: { darkMode } });
		window.dispatchEvent(event);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app-container">
	<div class="theme-toggle">
		<div class="theme-label">
			<span>Theme</span>
			<button 
				class="theme-toggle-button" 
				on:click={toggleDarkMode} 
				aria-label="Toggle dark mode"
				aria-pressed={darkMode}
			>
				<div class="toggle-track" class:dark={darkMode}>
					<div class="toggle-thumb"></div>
					<div class="toggle-icon sun" class:active={!darkMode}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="5"></circle>
							<line x1="12" y1="1" x2="12" y2="3"></line>
							<line x1="12" y1="21" x2="12" y2="23"></line>
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
							<line x1="1" y1="12" x2="3" y2="12"></line>
							<line x1="21" y1="12" x2="23" y2="12"></line>
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
						</svg>
					</div>
					<div class="toggle-icon moon" class:active={darkMode}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
						</svg>
					</div>
				</div>
			</button>
		</div>
	</div>
	
	<main>
		<slot />
	</main>
</div>

<style>
	.app-container {
		position: relative;
		min-height: 100vh;
		background-color: var(--background-color);
		color: var(--text-color);
		transition: background-color 0.3s ease, color 0.3s ease;
	}
	
	main {
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		padding-top: 4rem;
	}
	
	.theme-toggle {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 100;
		background-color: var(--card-bg);
		border-radius: 0.5rem;
		padding: 0.5rem 1rem;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		transition: background-color 0.3s ease;
	}
	
	.theme-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-color);
	}
	
	/* New toggle button styles */
	.theme-toggle-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		margin-left: 0.5rem;
	}
	
	.toggle-track {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 28px;
		border-radius: 34px;
		background: linear-gradient(to right, var(--cyan), var(--purple));
		opacity: 0.3;
		transition: all 0.3s ease;
	}
	
	.toggle-track.dark {
		opacity: 0.7;
	}
	
	.toggle-thumb {
		position: absolute;
		top: 4px;
		left: 4px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: white;
		transition: transform 0.3s ease;
		z-index: 2;
	}
	
	.toggle-track.dark .toggle-thumb {
		transform: translateX(32px);
	}
	
	.toggle-icon {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		transition: opacity 0.3s ease;
		opacity: 0.5;
	}
	
	.toggle-icon.active {
		opacity: 1;
	}
	
	.sun {
		left: 8px;
		color: #f59e0b;
	}
	
	.moon {
		right: 8px;
		color: #f3f4f6;
	}
</style>
