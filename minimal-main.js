// Minimal test version
console.log("Minimal main.js loaded successfully!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded!");
    
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        console.log("Canvas found!");
        canvas.style.backgroundColor = '#222';
        canvas.width = 800;
        canvas.height = 600;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Game Canvas Working!', 50, 50);
    } else {
        console.error("Canvas not found!");
    }
});
