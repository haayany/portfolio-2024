const themeToggle = document.getElementById('themeToggle');

    // Function to update the theme and button text/title accordingly
    const toggleTheme = () => {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
        themeToggle.textContent = isDarkMode ? 'Enjoying Light Mode' : 'Enjoying Dark Mode';
        themeToggle.title = themeToggle.textContent; // Update title to match the text
    };

    // Set initial theme and button text/title based on user preference or system setting
    const setInitialTheme = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', initialTheme);
        themeToggle.textContent = initialTheme === 'dark' ? 'Enjoying Light Mode' : 'Enjoying Dark Mode';
        themeToggle.title = themeToggle.textContent; // Ensure title is correctly set on initial load
    };

    setInitialTheme();
    themeToggle.addEventListener('click', toggleTheme);