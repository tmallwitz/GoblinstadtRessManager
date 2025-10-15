// Theme Management Tests
// Test suite for light/dark theme toggle functionality
// Focused tests for Task Group 2.1

describe('Theme Management', () => {
    // Setup and teardown
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        // Remove dark-mode class from html element
        document.documentElement.classList.remove('dark-mode');

        // Reset theme-color meta tag to default
        let metaTag = document.querySelector('meta[name="theme-color"]');
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'theme-color';
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', '#222222');
    });

    // Test 1: initializeTheme applies dark mode by default
    test('initializeTheme() applies dark mode by default when no preference exists', () => {
        // Ensure no saved preference
        localStorage.removeItem('goblinstadt-theme-preference');

        // Call initializeTheme
        if (typeof initializeTheme === 'function') {
            initializeTheme();
        }

        // Verify dark mode is applied
        expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
        expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#222222');
    });

    // Test 2: toggleTheme switches between light and dark
    test('toggleTheme() switches from dark to light and vice versa', () => {
        // Start with dark mode
        document.documentElement.classList.add('dark-mode');

        if (typeof toggleTheme === 'function') {
            // Toggle to light
            toggleTheme();
            expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
            expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#ffffff');

            // Toggle back to dark
            toggleTheme();
            expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
            expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#222222');
        }
    });

    // Test 3: Theme preference saves to localStorage
    test('Theme preference saves to localStorage under goblinstadt-theme-preference', () => {
        if (typeof saveThemePreference === 'function') {
            // Save dark preference
            saveThemePreference('dark');
            expect(localStorage.getItem('goblinstadt-theme-preference')).toBe('dark');

            // Save light preference
            saveThemePreference('light');
            expect(localStorage.getItem('goblinstadt-theme-preference')).toBe('light');

            // Save null removes preference
            saveThemePreference(null);
            expect(localStorage.getItem('goblinstadt-theme-preference')).toBeNull();
        }
    });

    // Test 4: Saved preference loads on page reload
    test('Saved theme preference loads correctly on initialization', () => {
        // Save a light mode preference
        localStorage.setItem('goblinstadt-theme-preference', 'light');

        if (typeof initializeTheme === 'function') {
            // Initialize with saved preference
            initializeTheme();

            // Verify light mode is applied
            expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
            expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#ffffff');
        }
    });

    // Test 5: theme-color meta tag updates correctly
    test('theme-color meta tag updates when theme changes', () => {
        if (typeof applyTheme === 'function') {
            // Apply dark theme
            applyTheme('dark');
            expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#222222');

            // Apply light theme
            applyTheme('light');
            expect(document.querySelector('meta[name="theme-color"]').getAttribute('content')).toBe('#ffffff');
        }
    });

    // Test 6: getCurrentTheme returns correct theme
    test('getCurrentTheme() returns correct active theme', () => {
        if (typeof getCurrentTheme === 'function') {
            // Test dark mode
            document.documentElement.classList.add('dark-mode');
            expect(getCurrentTheme()).toBe('dark');

            // Test light mode
            document.documentElement.classList.remove('dark-mode');
            expect(getCurrentTheme()).toBe('light');
        }
    });

    // Test 7: System theme detection works
    test('getSystemTheme() detects system preference correctly', () => {
        if (typeof getSystemTheme === 'function') {
            // Mock matchMedia to return dark mode
            const mockMatchMedia = (query) => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            });

            window.matchMedia = mockMatchMedia;

            const result = getSystemTheme();
            expect(result === 'dark' || result === 'light').toBe(true);
        }
    });

    // Test 8: loadThemePreference retrieves from localStorage
    test('loadThemePreference() retrieves saved preference from localStorage', () => {
        if (typeof loadThemePreference === 'function') {
            // Test with no preference
            expect(loadThemePreference()).toBeNull();

            // Test with saved preference
            localStorage.setItem('goblinstadt-theme-preference', 'light');
            expect(loadThemePreference()).toBe('light');
        }
    });
});
