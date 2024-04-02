const themeToggle = document.getElementById('themeToggle');

    const toggleTheme = () => {
        // Toggle the data-theme attribute on the <html> element
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = 'Enjoying Dark Mode';
            themeToggle.title="Enjoying Dark Mode";
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = 'Enjoying Light Mode';
          themeToggle.title="Enjoying Light Mode";
        }
    };

    // Set button text based on initial theme
    const setInitialButtonText = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = 'Enjoying Light Mode';
        }
    };

    setInitialButtonText();

    themeToggle.addEventListener('click', toggleTheme);

// Wait for the DOM content to be fully loaded before executing the code.
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize handling for scrollable elements and table of contents (TOC).
    adjustHeaderOnScroll();
    initScrollableElements();
    await handleScrollPositionReset();
    generateTOCHTML('toc');


    // Setup click event handlers for anchor links.
    setupAnchorClickHandlers();
});

// Initialize scrollable elements by adding event listeners for scroll and wheel events.
function initScrollableElements() {
    const scrollables = document.querySelectorAll(".scrollable");
    scrollables.forEach(scrollable => {
        setupScrollEvent(scrollable);
        setupWheelEvent(scrollable);
    });
}

// Add a scroll event listener to a scrollable element to reset its scroll position after scrolling stops.
function setupScrollEvent(scrollable) {
    scrollable.addEventListener("scroll", () => {
        clearTimeout(scrollable.timeout);
        scrollable.timeout = setTimeout(handleScrollPositionReset, 666); // Delay to prevent excessive function calls.
    });
}

// Add a wheel event listener to prevent default scrolling behavior and apply custom scrolling speed.
function setupWheelEvent(scrollable) {
    scrollable.addEventListener("wheel", (event) => {
        event.preventDefault(); // Prevent default scrolling.
        let speed = event.deltaY / 11; // Custom scroll speed.
        scrollable.scrollTop += speed; // Apply custom scroll.
    });
}

// Async function to reset the scroll position of all elements with the class 'scrollable'.
async function handleScrollPositionReset() {
    const targetItemId = "current"; // Target item identifier.
    document.querySelectorAll(".scrollable").forEach(scrollable => {
        const targetItem = scrollable.querySelector(`#${targetItemId}`);
        if (targetItem) {
            // Smooth scroll to the target item.
            targetItem.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    });
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function adjustHeaderOnScroll() {
    window.addEventListener('scroll', throttle(async () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('header');
        const tocListWrappers = document.querySelectorAll(".toc-list-wrapper");

        if (scrollTop > 69) {
            header.classList.add('header-fixed');
            tocListWrappers.forEach(wrapper => {
                wrapper.style.visibility = 'visible';
                wrapper.style.opacity = '100%';
            });
        } else {
            header.classList.remove('header-fixed');
            tocListWrappers.forEach(wrapper => {
                wrapper.style.visibility = 'hidden';
                wrapper.style.opacity = '0';
            });
        }

        await handleScrollPositionReset();
    }, 1));
}

// Function to get the position and ID of elements with a specified class name.
function getPositionAndId(className) {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length === 0) return null;

    const elementsInfo = [];
    const documentHeight = document.body.scrollHeight; // Total height of the document.
    elements.forEach(element => {
        // Calculate element's position as a percentage of total document height.
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const percentage = (elementPosition / documentHeight) * 100;
        elementsInfo.push({ percentage, id: element.getAttribute('id') });
    });

    return elementsInfo;
}

// Generate HTML content for the TOC based on elements with a specific class name.
function generateTOCHTML(elementId) {
    const elementsInfo = getPositionAndId(elementId);
    const tocContainer = document.getElementById('toc');
    if (!elementsInfo || !tocContainer) return;

    // Create and append link elements for each TOC item.
    elementsInfo.forEach(info => {
        const tocLink = document.createElement('a');
        tocLink.className = 'toc-item-wrapper';
        tocLink.href = `#${info.id}`;
        tocLink.style.top = `${info.percentage}%`; // Position based on document height percentage.
        tocLink.innerHTML = `<div class='toc-item outline small' title='${info.id}'>${info.id}</div><div class='toc-item-marker'></div>`;
        tocContainer.appendChild(tocLink);
    });
}

// Setup click event handlers for anchor links to smoothly scroll to the target section.
function setupAnchorClickHandlers() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior.
            const targetId = this.getAttribute('href').substring(1); // Extract target ID.
            const targetElement = document.getElementById(targetId); // Find target element.
            if (targetElement) {
                // Smooth scroll to the target element.
                targetElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }
        });
    });
}

// Add event listeners for hover and mouse leave on the TOC element.
document.getElementById('toc')?.addEventListener('mouseenter', handleTocHover);
document.getElementById('toc')?.addEventListener('mouseleave', handleTocMouseLeave);

// Handle hover over TOC element by making all child TOC items fully opaque.
function handleTocHover(event) {
    event.currentTarget.querySelectorAll('.toc-item').forEach(child => {
        child.style.opacity = '100%';
    });
}

// Handle mouse leaving TOC element by reducing the opacity of all child TOC items.
function handleTocMouseLeave(event) {
    event.currentTarget.querySelectorAll('.toc-item').forEach(child => {
        child.style.opacity = '50%';
    });
}