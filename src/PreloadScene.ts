import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {


    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(): void {
       
       
    }
    

    create(): void {
      const { width, height } = this.cameras.main;
      this.cameras.main.setBackgroundColor('#000000');
        const switchButton = this.add.text(width/2, height/2, 'GO!', {
            fontSize: '30px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#2c3e50',
            padding: { x: 30, y: 30 }
        }).setOrigin(0.5, 0.5).setInteractive();
        
        switchButton.on('pointerdown', () => {
            this.scene.start('IntroScene');
            // this.scene.start('MainScene');
        });

        // Add control instructions at the bottom
        this.add.text(width/2, height * 0.85, '"w,a,s,d" for movement, "q,e" for attack', {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5);

        
    }
} 