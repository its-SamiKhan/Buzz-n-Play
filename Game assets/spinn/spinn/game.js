const wheel = document.querySelector('.wheel');
const spinBtn = document.querySelector('.spinBtn');
const timerDisplay = document.querySelector('.timer');
let value = 0; // Track total rotation

// Websites for each segment (clockwise order from top)
const websites = [
    "https://slicer01.netlify.app", 
    "https://maze-09.netlify.app", 
    "https://sudoku07.netlify.app", 
    "https://snake06.netlify.app", 
    "https://buzzingbee05.netlify.app", 
    "https://fighting-game04.netlify.app", 
    "https://connect-thedots03.netlify.app", 
    "https://2048-02.netlify.app",
];

// Spin button functionality
spinBtn.onclick = function () {
    // Ensure the button can be clicked
    if (spinBtn.disabled) return;

    // Generate a random spin value (multiple full rotations + random final position)
    const spinValue = Math.ceil(Math.random() * 3600) + 360; 
    
    // Accumulate total rotation
    value += spinValue;

    // Apply spinning transformation with cubic-bezier for smooth animation
    wheel.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${value}deg)`;

    // Disable spin button during spin
    spinBtn.textContent = "❌";
    spinBtn.style.cursor = "not-allowed";
    spinBtn.disabled = true;

    // Determine the result after the spin animation
    setTimeout(() => {
        // Normalize the rotation to 0-360 degrees
        const normalizedValue = value % 360;
        
        // Calculate which segment was landed on
        const segment = Math.floor((normalizedValue + 22.5) / 45) % 8;
        const websiteLink = websites[segment];

        // Open the website
        window.location.href = websiteLink;


        // Re-enable spin button
        spinBtn.textContent = "Spin";
        spinBtn.style.cursor = "pointer";
        spinBtn.disabled = false;
    }, 4100); // Slightly longer than spin animation to ensure rotation is complete
};






