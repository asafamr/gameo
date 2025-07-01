import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    private babaSprite!: Phaser.GameObjects.Image;
    private harbuSprite!: Phaser.GameObjects.Image;
    private lipsSprite!: Phaser.GameObjects.Image;
    private bg!: Phaser.GameObjects.Image;

    private currentMusic!: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: 'IntroScene' });
    }

    preload(): void {
        // Load the font
        this.load.font('PressStart2P', 'PressStart2P-Regular.ttf');
        
        // Load the baba image
        this.load.image('baba', 'baba.png');
        this.load.image('chev', 'chev.png');
        this.load.image('harbu', 'harbu.png');
        this.load.image('lips', 'lips.png');

        this.load.audio('intro', 'intro.mp3');

       
       
    }
    

    create(): void {
        const { width, height } = this.cameras.main;
        const [wp, hp] = [width/100, height/100];

        // Set background color to black
        this.cameras.main.setBackgroundColor('#000000');

        this.currentMusic = this.sound.add('intro', {
            loop: true,
            volume: 1.0
        });
        const music = this.currentMusic;
        music.play();
  
        

        
        // // Add "hello world" text at the top using PressStart2P font
        // this.add.text(width / 2, height * 0.2, 'hello world', {
        //     fontFamily: 'PressStart2P',
        //     fontSize: '32px',
        //     color: '#ffffff',
        //     stroke: '#000000',
        //     strokeThickness: 4
        // }).setOrigin(0.5);
        this.bg = this.add.image(50*wp, 50*hp, 'chev');
        this.bg.setScale(1* width/this.bg.width);
        this.bg.setAlpha(0.5);

        
        // Create baba sprite starting from the left side, off-screen
        this.babaSprite = this.add.image(150*wp, 50*hp, 'baba');
        this.babaSprite.setScale(1* height/this.babaSprite.height);

        this.lipsSprite = this.add.image(-300, 50*hp , 'lips');
        this.lipsSprite.setScale(1* height/this.lipsSprite.height);
        this.lipsSprite.setFlipX(true);

        this.harbuSprite = this.add.image(50*wp, 40*hp, 'harbu');
        this.harbuSprite.setScale(0.0);
      

        this.tweens.add({
            targets: this.harbuSprite,
            scale: 0.40,
            duration: 1000,
            ease: 'Linear',
            delay: 2000,
        });

        this.tweens.add({
            targets: this.lipsSprite,
            x:  200,
            duration: 1500,
            ease: 'Linear',
            delay: 100,
        });
        // Create a slow scrolling animation from left to right
        this.tweens.add({
            targets: this.babaSprite,
            x: width - 200, // Move to right side off-screen
            duration: 1500, // 8 seconds for slow movement
            ease: 'Linear',
            delay: 100,
            // onComplete: () => {
            //     // After animation completes, transition to the main game scene
            //     this.scene.start('GameScene');
            // }
        });

        // Create the skip text but make it invisible initially
        const skipText = this.add.text(width / 2, height * 0.7, 'Press any key to start', {
            fontFamily: 'PressStart2P',
            fontSize: '18px',
            stroke: '#000000',
            color: 'yellow'
        }).setOrigin(0.5);
        skipText.setAlpha(0);

        // Make the text appear after 2 seconds, then start blinking
        this.time.delayedCall(3000, () => {
            skipText.setAlpha(1);
            
            // Create blinking effect
            this.tweens.add({
                targets: skipText,
                alpha: 0,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                
            });
        });
       

        // Allow tapping to skip the intro
        this.input.on('pointerdown', () => {
            this.scene.start('MainScene');
            this.currentMusic.stop();
        });

       
    }
} 