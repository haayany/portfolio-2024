document.addEventListener('DOMContentLoaded', function() {
    const canvases = document.querySelectorAll('.dot-canvas');

    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        // Set canvas to full available size
        canvas.width = width;
        canvas.height = height;

        // Constants for dots
        const spacing = 40;
        const baseSize = 2;
        const colorThreshold = 200;
        const baseColor = { r: 196, g: 187, b: 165 };
        const hoverColor = { r: 249, g: 92, b: 58 };

        function drawDot(x, y, size, color) {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }

        function populateDots() {
    ctx.clearRect(0, 0, width, height);
    // Start from 10 pixels down from the top and stop before 10 pixels from the bottom
    for (let y = 20; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
            drawDot(x, y, baseSize, 'rgb(196, 187, 165)');
        }
    }
}

        function interpolateColor(color1, color2, ratio) {
            const r = Math.round(color1.r + (color2.r - color1.r) * ratio);
            const g = Math.round(color1.g + (color2.g - color1.g) * ratio);
            const b = Math.round(color1.b + (color2.b - color1.b) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        }

        function adjustDotSizes(x, y) {
    ctx.clearRect(0, 0, width, height);
    // Adjust loop for padding as well
    for (let py = 20; py < height; py += spacing) {
        for (let px = 0; px < width; px += spacing) {
            const dx = x - px;
            const dy = y - py;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const size = baseSize * Math.max(1, 3 - distance / 100);
            let ratio = Math.min(distance / colorThreshold, 1);
            const color = interpolateColor(baseColor, hoverColor, 1 - ratio);

            drawDot(px, py, size, color);
        }
    }
}

        populateDots();

        let throttled = false;
        canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect(); // Gets the bounds of the canvas
    const scaleX = canvas.width / rect.width;    // Scale factor between actual canvas size and displayed size
    const scaleY = canvas.height / rect.height;  // Same for height

    // Adjusting the mouse position to be relative to the canvas
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    if (!throttled) {
        adjustDotSizes(canvasX, canvasY);
        throttled = true;
        setTimeout(() => { throttled = false; }, 10);
    }
});

        window.addEventListener('resize', function() {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            populateDots();
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const urlbutton = document.querySelector('.url');
    const display = document.querySelector('.display');
    const list = document.querySelector('.dropdown-list');
    let typingInterval;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '';  // This will be the blinking cursor
  let originalText = display.textContent;  // Store the initial text

    // Toggle list display on click
    urlbutton.addEventListener('click', function() {
        list.hidden = !list.hidden;
    });

    // Hide list when clicking outside
    document.addEventListener('click', function(event) {
        if (!urlbutton.contains(event.target) && !list.contains(event.target)) {
            list.hidden = true;
            display.textContent = originalText;  // Reset to original text
            display.appendChild(cursor);  // Ensure cursor is visible
        }
    }); 

    // Hover effect and temporary text display
    const listItems = document.querySelectorAll('.dropdown-list li');
    listItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (typingInterval) clearInterval(typingInterval);
            startTypingEffect(display, item.textContent);
        });
      item.addEventListener('mouseleave', function() {

            display.textContent = originalText;  // Reset to original text when mouse leaves

            display.appendChild(cursor);

        });
        item.addEventListener('click', function() {
            originalText = item.textContent;  // Update original text upon selection
            display.textContent = item.textContent;
            display.appendChild(cursor);  // Ensure cursor is visible after selection
            list.hidden = true;
            listItems.forEach(li => li.classList.remove('selected'));
            item.classList.add('selected');
        });
    });

    function startTypingEffect(element, text) {
        let i = 0;
        element.textContent = ''; // Clear text first
        element.appendChild(cursor);  // Append cursor to the display
        typingInterval = setInterval(() => {
            if (i < text.length) {
                cursor.before(text[i]);  // Insert text before the cursor
                i++;
            } else {
                clearInterval(typingInterval);
                cursor.style.animation = 'none';  // Stop the cursor from blinking once typing is complete
                setTimeout(() => { cursor.style.animation = ''; }, 51); // Restart blinking after some time
            }
        }, 50); // Typing speed
    }
});

// Wait for the DOM content to be fully loaded before executing the code.
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize handling for scrollable elements and table of contents (TOC).
    generateTOCHTML('toc');
});

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
        tocLink.innerHTML = `<div class='button toc-item' title='${info.id}'>${info.id}</div>`;
        tocContainer.appendChild(tocLink);
    });
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

document.addEventListener('DOMContentLoaded', function() {
    const targetElement = document.querySelector('.toc-list-wrapper'); 

    function toggleVisibilityOnScroll() {
        if (window.scrollY > 100) {
            targetElement.classList.add('visible');
            targetElement.classList.remove('hidden');
        } else {
            targetElement.classList.add('hidden');
            targetElement.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleVisibilityOnScroll);
});