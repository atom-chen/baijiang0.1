/**
 * 七进七出
 * 全屏敌人七次伤害
 */
class SevenInOut extends SkillBase {
    public constructor() {
        super();
        this.copySkillArmature = new Array();
    }

    public init() {
        super.init();
        this.cd = 300;
        this.mask = Utils.createBitmap("sevenInOut_png");
        this.mask.width = Common.SCREEN_W;
        this.mask.height = Common.SCREEN_H;
        this.mask.alpha = 0;
        SceneManager.curScene.addChild(this.mask);
        for (let i = 0; i < 6; i++) {
            let sevenInOut:DragonBonesArmatureContainer = new DragonBonesArmatureContainer();
            SceneManager.curScene.addChild(sevenInOut);
            sevenInOut.register(DragonBonesFactory.getInstance().makeArmature("zhaoyun_skill", "zhaoyun_skill", 10), [
                "skill01"
            ]);
            sevenInOut.scaleX = 1.5;
            // sevenInOut.scaleY = 1.5;
            sevenInOut.x = this.position[i][0];
            sevenInOut.y = this.position[i][1];
            sevenInOut.rotation = this.position[i][2];
            sevenInOut.addFrameCallFunc(this.armatureFrame, this);
            this.copySkillArmature.push(sevenInOut);
            sevenInOut.addCompleteCallFunc((i)=>{
                sevenInOut.visible = false;
            }, this);
        }
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.gotoIdle();
        target.skillArmature.play(animation, 1);
        SceneManager.curScene.addChild(target.skillArmature);
        target.skillArmature.x = 600;
        target.skillArmature.y = 200;
        target.skillArmature.rotation = 200;
        for (let i = 0; i < this.copySkillArmature.length; i++) {
            egret.setTimeout(()=>{
                this.copySkillArmature[i].visible = true;
                this.copySkillArmature[i].play(animation, 1, 2, 2);
            }, this, 100 *(i+1));
        }
        egret.setTimeout(()=>{
            target.visible = true;
        }, this, 700);
        Animations.fadeOut(this.mask, 500, null, ()=>{
            Animations.fadeIn(this.mask, 200);
        });
    }

    public update(target:any) {
        target.setEnermy();
        let enermy = target.getEnermy();
        for (let i = 0; i < enermy.length; i++) {
            if (!this.target.isPVP) enermy[i].removeActComplete();
            if (enermy[i].hp > 0) {
                enermy[i].setCurState("none");
            }
            enermy[i].gotoHurt();
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    private armatureFrame(event:dragonBones.FrameEvent):void {
        // let evt:string = event.frameLabel;
        this.update(this.target)
    }

    private buff:UnableMove;
    private target:any;
    private copySkillArmature:Array<DragonBonesArmatureContainer>;
    private position = [
        [400, 500, 0],
        [900, 200, 160],
        [400, 300, 130],
        [600, 400, 30],
        [850, 300, 100],
        [350, 150, -10]
    ];
    private mask:egret.Bitmap;
}