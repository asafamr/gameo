import Phaser from 'phaser';

const babaFrames = {
    moving: 0,
    idle: 1,
    punch: 2,
    docking: 3,
    kick: 4,
    hurt: 5,
    hurt2: 6,
    flying: 7,
    dead: 8
   
}

const lipsFrames ={ 
idle: 0,
idle2: 1,
ball1: 2,
ball2: 3,
ball: 4,
yoga: 5,
muscle: 6,
handcross: 7,
muscle2: 8,
}

export class MainScene extends Phaser.Scene {
    private babaHealthShape!: Phaser.GameObjects.Shape;
    private lipshHealthShape!: Phaser.GameObjects.Shape;
    private babaHealthTween!: Phaser.Tweens.Tween | null;
    private lipshHealthTween!: Phaser.Tweens.Tween | null;
    private babaHealth: number = 100;
    private lipshHealth: number = 100;

    private baba!: Phaser.Physics.Arcade.Sprite;
    private lips!: Phaser.Physics.Arcade.Sprite;

    private bg!: Phaser.GameObjects.Image;

    private currentMusic!: Phaser.Sound.BaseSound;

    private readonly MOVE_SPEED = 400;
    private readonly JUMP_VELOCITY = -800;
    private readonly DRAG = 300; // Air resistance/friction

    private  babaAction = "idle";
    private lipsAction = "idle";

    private wasdKeys!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        Q: Phaser.Input.Keyboard.Key;
        E: Phaser.Input.Keyboard.Key;
    };
    private lipsFrameTime: number =600;
    private lipsstrong: boolean = false;

    constructor() {
        super({ key: 'MainScene' });
    }

    preload(): void {
        // Load the font
        this.load.font('PressStart2P', 'PressStart2P-Regular.ttf');
        
        // Load the baba image
        this.load.image('chev', 'chev.png');
        this.load.audio('game', 'game.mp3');
        this.load.audio('grunt', 'grunt.mp3');
        this.load.audio('morte', 'morte.mp3');
        this.load.audio('punch', 'punch.mp3');
        this.load.audio('hadouken', 'hadu.mp3');


        // this.load.image('baba', 'baba-sprite.png');
        this.load.spritesheet('babasprite', 'baba-sprite.png', {
            frameWidth:256,
            frameHeight: 256,
            
        });
        this.load.spritesheet('lipssprite', 'lips-sprite.png', {
            frameWidth:256,
            frameHeight: 256,
        });
        this.babaAction = "idle";
        this.babaHealthTween = null;
       
    }
    

    create(): void {
        const { width, height } = this.cameras.main;
        const [wp, hp] = [width/100, height/100];
        this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D,Q,E') as any;

        // Set background color to black
        this.cameras.main.setBackgroundColor('#000000');

        this.currentMusic = this.sound.add('game', {
            loop: true,
            volume: 1.0
        });
        const music = this.currentMusic;
        music.play();
        this.bg = this.add.image(50*wp, 50*hp, 'chev');
        this.bg.setScale(1* width/this.bg.width);
        this.bg.setAlpha(1);

        // Load the sprite as a spritesheet with 3x3 frames

       
       
        this.baba = this.physics.add.sprite(50*wp, 70*hp, 'babasprite', babaFrames.idle);
        this.baba.body!.setSize(this.baba.width * 0.3, this.baba.height );
        this.baba.setScale(0.4* height/this.baba.height);
        // // Add "hello world" text at the top using PressStart2P font
        // this.add.text(width / 2, height * 0.2, 'hello world', {
        //     fontFamily: 'PressStart2P',
        //     fontSize: '32px',
        //     color: '#ffffff',
        //     stroke: '#000000',
        //     strokeThickness: 4
        // }).setOrigin(0.5);

        // this.baba.setCollideWorldBounds(true); // Don't let character go off screen
        // this.baba.setBounce(0.1); // Small bounce when hitting ground
        // this.baba.setDragX(this.DRAG);
        this.baba.setBounceY(0.1);
        this.baba.setDrag(this.DRAG);
        this.baba.setDragX(this.DRAG*3);
        this.physics.world.gravity.y = 1200; // Increase gravity
        const ground = this.physics.add.staticGroup();
        const groundHeight = 10;
        ground.create(width/2, height - groundHeight/2)
              .setSize(width, groundHeight)
              .setVisible(false); // Make invisible, just for collision
        
        let left = this.physics.add.staticGroup();
        left.create(0, 0)
            .setSize(10, height*2)
            .setVisible(false);
        let right = this.physics.add.staticGroup();
        right.create(width-70, 0)
            .setSize(10, height*2)
            .setVisible(false);
        
        this.physics.add.collider(this.baba, ground);
        this.physics.add.collider(this.baba, left);
        this.physics.add.collider(this.baba, right);   
        
        this.lips = this.physics.add.sprite(93*wp, 70*hp, 'lipssprite', lipsFrames.idle);
        this.lips.setScale(0.43* height/this.lips.height);
        this.lips.setFlipX(true);
        this.physics.add.collider(this.lips, ground);
        this.physics.add.collider(this.lips, left);
        this.physics.add.collider(this.lips, right);

        // Create health bar
        const healthBarWidth = width*0.4;
        const healthBarHeight = 20;
        const healthBarX = 20;
        const healthBarY = 20;
        

        const createHealthBar = (name: string,fromRight:boolean = false) => {
            const healthBarXFinal = fromRight ? width -healthBarX : healthBarX;
            const healthBarBg = this.add.rectangle(healthBarXFinal, healthBarY, healthBarWidth, healthBarHeight, 0xff0000);
            
            healthBarBg.setOrigin(fromRight ? 1 : 0, 0);
            
            // Health bar foreground (green)
            const h2 =this.add.rectangle(healthBarXFinal, healthBarY, healthBarWidth, healthBarHeight, 0xfff700);
            h2.setOrigin(fromRight ? 1 : 0, 0);
            // Add "Baba" text label
            this.add.text(healthBarXFinal, healthBarY + healthBarHeight*2, name, {
                fontFamily: 'PressStart2P',
                fontSize: '16px',
                color: '#ffff00'
            }).setOrigin(fromRight ? 1 : 0, 0.5);
            return h2
        }

        this.babaHealthShape = createHealthBar('BABA');
        this.lipshHealthShape = createHealthBar('LIPS',true);

        // lipshHealth.setScale(0.5,1);
        // Health bar background (red)
        

        
        // Health bar border
        // const healthBarBorder = this.add.rectangle(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        // healthBarBorder.setOrigin(0, 0);
        // healthBarBorder.setStrokeStyle(2, 0xffffff);

        // Allow tapping to skip the intro
        // this.input.on('pointerdown', () => {
        //     this.scene.start('GameScene');
        //     this.currentMusic.stop();
        // });

        // Add keyboard input for Y key to change baba frame
        
       
    }

    update(): void {

        if (this.babaAction.startsWith("dying") == false){
        if (Phaser.Input.Keyboard.DownDuration(this.wasdKeys.A,100000) && this.baba.body?.touching.down) {
            this.baba.setVelocityX(-this.MOVE_SPEED);
            this.baba.setFlipX(true); // Face left
        } else if (Phaser.Input.Keyboard.DownDuration(this.wasdKeys.D,100000) && this.baba.body?.touching.down) {
            this.baba.setVelocityX(this.MOVE_SPEED);
            this.baba.setFlipX(false); // Face right
        }
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.W) && this.baba.body?.touching.down) {
            this.baba.setVelocityY(this.JUMP_VELOCITY);
        }
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.S) && this.baba.body?.touching.down) {
            this.babaAction = "docking";
            // Set a timer to change action back to idle after 2 seconds
            this.time.delayedCall(1000, () => {
                if (this.babaAction === "docking") {
                    this.babaAction = "idle";
                }
            });
        }
        var hitting = ''
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.Q) && this.babaAction == "idle") {
            this.babaAction = "punch";
            hitting='punch'
            // Set a timer to change action back to idle after 2 seconds
            this.time.delayedCall(300, () => {
                if (this.babaAction === "punch") {
                    this.babaAction = "idle";
                }
            });
            
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.E)  && this.babaAction == "idle") {
            this.babaAction = "kick";
            hitting='kick'
            // Set a timer to change action back to idle after 2 seconds
            this.time.delayedCall(300, () => {
                if (this.babaAction === "kick") {
                    this.babaAction = "idle";
                }
            });
        }
        if (hitting) {
            this.sound.play('punch', { seek: 0.1, volume: 0.5 });
            if (Math.abs(this.baba.x - this.lips.x )< 120 && this.baba.flipX==false){
                this.lipshHealth = Math.max(this.lipshHealth - (this.lipsstrong? 3: 12), 12);
                if (this.lipshHealthTween){
                    this.lipshHealthTween.stop();
                    this.lipshHealthTween.destroy();
                }
                this.lipshHealthTween = this.tweens.add({
                    targets: this.lipshHealthShape,
                    scaleX: this.lipshHealth/100,
                    duration: 300,
                    ease: 'easeOut',
                });
                if (this.lipshHealth <= 20){
                    this.lipsAction="healing";
                }
            }
            
        }

        if (this.babaAction == "docking") {
            this.baba.setFrame(babaFrames.docking);
        }
        if (this.babaAction == "idle") {
            this.baba.setFrame(babaFrames.idle);
        }
        if (this.babaAction == "punch") {
            this.baba.setFrame(babaFrames.punch);
        }
        if (this.babaAction == "kick") {
            this.baba.setFrame(babaFrames.kick);
        }
        if (this.babaAction == "hurt") {
            this.babaAction = "hurt_";
            this.baba.setFrame(Math.random()<0.5? babaFrames.hurt: babaFrames.hurt2);
            this.sound.play('grunt', { seek: 0.7, volume: 2.8 });
            this.time.delayedCall(300, () => {
                if (this.babaAction == "hurt_") {
                    this.babaAction = "idle";
                }
            });
        }
    }
    else{
        
        if (this.babaAction == "dying"){
            this.baba.setFrame(babaFrames.flying);
            this.sound.play('morte', { seek: 0.1, volume: 0.5 });
            this.babaAction = "dying1"
            this.baba.setVelocityY(-600);
            this.baba.setGravity(0.001);
            this.baba.setBounce(0.5);
            this.time.delayedCall(800, () => {
                this.baba.setFrame(babaFrames.dead);
            });
        }
        
    }
    if (this.lipsAction == "healing"){
        this.lipsstrong = true;
        this.lipsFrameTime = 50;
        this.lips.setFrame(lipsFrames.yoga);
        this.lipshHealth=100;
        if (this.lipshHealthTween){
            this.lipshHealthTween.stop();
            this.lipshHealthTween.destroy();
        }
        this.lipshHealthTween = this.tweens.add({
            targets: this.lipshHealthShape,
            scaleX: this.lipshHealth/100,
            duration: 3000,
            ease: 'easeOut',
        });
        this.lipsAction = "healing_"
        this.time.delayedCall(3000, () => {
            if (this.lipsAction.startsWith("happy"))return;
            this.lipsAction ="idle"
            this.lips.setFrame(lipsFrames.idle);
        });
    }
        if (this.lipsAction == "idle") {
            this.lipsAction = "_idle2";
            this.time.delayedCall(this.lipsFrameTime, () => {
                if (this.lipsAction.startsWith("happy")||this.lipsAction.startsWith("healing"))return;
                this.lipsAction ="idle2"
                this.lips.setFrame(lipsFrames.idle2);
            });
        }
        if (this.lipsAction == "idle2") {
            this.lipsAction = "_idle3";
            this.time.delayedCall(this.lipsFrameTime, () => {
                if (this.lipsAction.startsWith("happy")||this.lipsAction.startsWith("healing"))return;
                this.lipsAction ="idle3"
                this.lips.setFrame(lipsFrames.idle);
            });
        }
        if (this.lipsAction == "idle3") {
            this.lipsAction = "_ball1";
            this.time.delayedCall(this.lipsFrameTime, () => {
                if (this.lipsAction.startsWith("happy")||this.lipsAction.startsWith("healing"))return;
                this.lipsAction ="ball1"
                this.lips.setFrame(lipsFrames.ball1);
            })
        }
        if (this.lipsAction == "ball1") {
            this.lipsAction = "_ball2";
            this.time.delayedCall(this.lipsFrameTime, () => {
                if (this.lipsAction.startsWith("happy")||this.lipsAction.startsWith("healing"))return;
                this.lipsAction ="ball2"
                this.lips.setFrame(lipsFrames.ball2);
            })
        }
        if (this.lipsAction == "ball2") {
            this.lipsAction = "_idle";
            this.time.delayedCall(this.lipsFrameTime, () => {
                if (this.lipsAction.startsWith("happy")||this.lipsAction.startsWith("healing"))return;
                this.lipsAction = "idle";
                this.lips.setFrame(lipsFrames.idle);
                // Create a ball sprite and move it along -x axis
                const ballSprite = this.physics.add.sprite(this.lips.x-70, this.lips.y+35, 'lipssprite');
                // Set the collision body to half the image size
                ballSprite.body.setSize(ballSprite.width * 0.2, ballSprite.height * 0.2);
                ballSprite.setFrame(lipsFrames.ball);
                ballSprite.setScale(this.lips.scaleX*0.8, this.lips.scaleY*0.8);
                ballSprite.body.setAllowGravity(false);
                this.sound.play('hadouken', { seek: 0.1, volume: 0.3 });
                // Move the ball along -x axis
                this.tweens.add({
                    targets: ballSprite,
                    x: ballSprite.x - 2000,
            
                    duration: 1300,
                    ease: 'Linear',
                    onComplete: () => {
                        ballSprite.destroy();
                    }
                });
                // Check for collision with baba
                this.physics.add.overlap(ballSprite, this.baba, () => {
                    // Handle collision - reduce baba's health or trigger damage effect
                    // this.takeDamage('baba');
                    this.babaHealth = Math.max(this.babaHealth - 37, 0);
                    this.babaAction = "hurt";
                    if (this.babaHealthTween){
                        this.babaHealthTween.stop();
                        this.babaHealthTween.destroy();
                    }
                    this.babaHealthTween = this.tweens.add({
                        targets: this.babaHealthShape,
                        scaleX: this.babaHealth/100,
                        duration: 300,
                        ease: 'easeOut',
                    });
                    if (this.babaHealth <= 0){
                        this.babaAction="dying";
                        this.lipsAction="happy";
                    }
                    ballSprite.destroy();
                    
                });
            });
            

        }
        if (this.lipsAction == "happy"){
            this.lips.setFrame(lipsFrames.idle);
            this.lipsAction = "happy2"
            this.time.delayedCall(1000, () => {
                this.lips.setFrame(lipsFrames.muscle);
            });
            this.time.delayedCall(3000, () => {
                this.lips.setFrame(lipsFrames.handcross);
            });
            this.time.delayedCall(4000, () => {
                this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'LIPS WON!', {
                    fontSize: '64px',
                    fontFamily: 'PressStart2P',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            });
        }
        
        
    }
} 