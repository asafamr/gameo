import Phaser from 'phaser';
import './styles.css';
import { IntroScene } from './IntroScene';
import { PreloadScene } from './PreloadScene';
import { MainScene } from './MainScene';

// Mobile-optimized game configuration
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Calculate optimal game size for landscape mobile gaming
const getGameDimensions = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (isMobile) {
        // Force landscape aspect ratio on mobile
        const isLandscape = screenWidth > screenHeight;
        
        if (isLandscape) {
            // Use full screen in landscape mode
            return {
                width: screenWidth,
                height: screenHeight
            };
        } else {
            // In portrait mode, prepare for landscape (this will be handled by CSS)
            // Use landscape aspect ratio (16:9 or similar)
            const landscapeWidth = Math.max(screenWidth, screenHeight);
            const landscapeHeight = Math.min(screenWidth, screenHeight);
            
            return {
                width: landscapeWidth,
                height: landscapeHeight
            };
        }
    } else {
        // Desktop - use landscape aspect ratio
        const maxWidth = screenWidth * 0.9;
        const maxHeight = screenHeight * 0.9;
        
        return {
            width: Math.min(maxWidth, 1000),
            height: Math.min(maxHeight, 600)
        };
    }
};

const { width, height } = getGameDimensions();

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    // Mobile performance optimizations
    render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: false, // Disable for better mobile performance
        roundPixels: true
    },
    // Scale manager optimized for landscape mobile gaming
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // Landscape-oriented minimum dimensions
        min: {
            width: 480,
            height: 320
        },
        max: {
            width: 1920,
            height: 1080
        },
        // Auto-resize when orientation changes
        autoRound: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            debug: false,
            // Mobile optimization
            fps: isMobile ? 30 : 60 // Lower FPS on mobile for better performance
        }
    },
    // Mobile-specific settings
    input: {
        touch: true,
        mouse: true,
        // Better pointer handling for mobile
        activePointers: 3
    },
    scene: [PreloadScene, IntroScene, MainScene]
};

// Handle orientation changes for better mobile experience
if (isMobile) {
    window.addEventListener('orientationchange', () => {
        // Small delay to ensure the viewport has updated
        setTimeout(() => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }, 100);
    });
    
    // Also handle window resize
    window.addEventListener('resize', () => {
        setTimeout(() => {
            game.scale.resize(window.innerWidth, window.innerHeight);
        }, 100);
    });
}

// Initialize the game
const game = new Phaser.Game(config);

export default game; 