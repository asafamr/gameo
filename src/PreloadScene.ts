import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {


    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(): void {
        // Load the font
        this.load.font('PressStart2P', 'PressStart2P-Regular.ttf');
        
        // Load images
        this.load.image('baba', 'baba.gif');
        this.load.image('chev', 'chev.jpg');
        this.load.image('harbu', 'harbu.gif');
        this.load.image('lips', 'lips.gif');

        // Load audio
        this.load.audio('intro', 'intro2.mp3');
        this.load.audio('game', 'game2.mp3');
        this.load.audio('hadouken', 'hadu.mp3');
        this.load.audio('morte', 'morte.mp3');
        this.load.audio('punch', 'punch.mp3');
        this.load.audio('grunt', 'grunt.mp3');
       
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