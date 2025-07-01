import Phaser from 'phaser';
import './styles.css';

class GameScene extends Phaser.Scene {
    private box!: Phaser.GameObjects.Rectangle;
    private ground!: Phaser.GameObjects.Rectangle;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // No assets to preload for this simple game
    }

    create(): void {
        // Create the box sprite
        this.box = this.add.rectangle(400, 500, 80, 80, 0x3498db);
        this.box.setInteractive();
        
        // Add physics to the box
        this.physics.add.existing(this.box);
        
        // Type assertion to access physics body properties
        const boxBody = this.box.body as Phaser.Physics.Arcade.Body;
        boxBody.setCollideWorldBounds(true);
        boxBody.setBounce(0.3);
        
        // Ground
        this.ground = this.add.rectangle(400, 580, 800, 40, 0x2ecc71);
        this.physics.add.existing(this.ground, true); // true makes it static
        
        // Set up collision between box and ground
        this.physics.add.collider(this.box, this.ground);
        
        // Click/tap to jump
        this.box.on('pointerdown', () => {
            this.jumpBox();
        });
        
        // Alternative: click anywhere to jump
        this.input.on('pointerdown', () => {
            this.jumpBox();
        });
        
        // Add some text instructions
        this.add.text(400, 100, 'Click the box (or anywhere) to make it jump!', {
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add a title
        this.add.text(400, 50, 'Jumping Box Game', {
            fontSize: '32px',
            color: '#e74c3c',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add subtitle
        this.add.text(400, 150, 'Built with TypeScript & Phaser 3', {
            fontSize: '16px',
            color: '#95a5a6',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    private jumpBox(): void {
        const boxBody = this.box.body as Phaser.Physics.Arcade.Body;
        
        // Only allow jumping if the box is on the ground (not already jumping)
        if (boxBody.touching.down) {
            boxBody.setVelocityY(-400); // Negative Y is up in Phaser
            
            // Add a little visual feedback - scale animation
            this.tweens.add({
                targets: this.box,
                scaleX: 1.2,
                scaleY: 0.8,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        }
    }
    
    update(): void {
        const boxBody = this.box.body as Phaser.Physics.Arcade.Body;
        
        // Optional: Add some rotation while in air
        if (!boxBody.touching.down) {
            this.box.rotation += 0.05;
        } else {
            // Reset rotation when on ground
            this.box.rotation = 0;
        }
    }
}

// Game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 800 },
            debug: false
        }
    },
    scene: GameScene
};

// Initialize the game
const game = new Phaser.Game(config);

// Export for potential use in other modules
export default game; 