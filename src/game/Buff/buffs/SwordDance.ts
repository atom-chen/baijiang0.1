/**
 * 剑舞
 * 每隔10s向周围X个单位发射剑气
 */
class SwordDance extends BuffBase {
    public constructor() {
        super();
        this.buffInit();
    }

    /**初始化 */
    public buffInit() {
        super.buffInit();
        this.buffData.className = "SwordDance";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.cd = 10;
        this.buffData.id = 6;
        this.effectName = "skill03_01";
    }

    /**开始 */
    public buffStart(target:any) {
        this.setPassiveEffect();
        this.AddEffect(target);
        let duration = this.buffData.cd * 1000;
        TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
    }

    /**
     * 被动技能的特效
     */
    private setPassiveEffect():void {
        this.passiveLight = [];
        this.passiveOffset = [[40,50,-90], [-40,-35,90], [-40,50,0]];
        this.passiveDelta = [[4,0], [-4,0], [0,4]]
        for (let i = 0; i < 3; i++) {
            this.passiveLight[i] = Utils.createBitmap("swordDance_png");
            this.passiveLight[i].scaleX = 1.5;
            this.passiveLight[i].scaleY = 1.5;
            this.passiveLight[i].visible = false;
            SceneManager.battleScene.effectLayer.addChild(this.passiveLight[i])
        }
    }

    /**结束 */
    public buffEnd() {
        this.target.setPassiveRelease();
        this.passiveSumDeltaX = [];
        this.passiveSumDeltaY = [];
        for (let i = 0; i < 3; i++) {
            this.passiveLight[i].visible = true;
            this.passiveLight[i].x = this.target.x + this.passiveOffset[i][0];
            this.passiveLight[i].y = this.target.y + this.passiveOffset[i][1];
            this.passiveLight[i].rotation = this.passiveOffset[i][2];
            this.passiveSumDeltaX[i] = 0;
            this.passiveSumDeltaY[i] = 0;
        }
    }

    /**刷新数据 */
    public update() {
        for (let i = 0; i < 3; i++) {
            if (Math.abs(this.passiveSumDeltaX[i]) > 150 || Math.abs(this.passiveSumDeltaY[i]) > 150) {
                this.target.passiveRelease = false;
                this.passiveLight[i].visible = false;
            }
            this.passiveLight[i].x = this.passiveLight[i].x + this.passiveDelta[i][0];
            this.passiveLight[i].y = this.passiveLight[i].y + this.passiveDelta[i][1];
            let radian = 0;
            let centX = this.passiveLight[i].x + 50;
            let centY = this.passiveLight[i].y + this.passiveLight[i].height/2;
            switch (this.passiveLight[i].rotation) {
                case -90:
                radian = -Math.PI/2;
                centX = this.passiveLight[i].x + this.passiveLight[i].height/2;
                centY = this.passiveLight[i].y - 50;
                break;
                case 90:
                radian = Math.PI/2;
                centX = this.passiveLight[i].x - this.passiveLight[i].height/2;
                centY = this.passiveLight[i].y + 50;
                break;
            }
            this.passiveSumDeltaX[i] = this.passiveSumDeltaX[i] + this.passiveDelta[i][0];
            this.passiveSumDeltaY[i] = this.passiveSumDeltaY[i] + this.passiveDelta[i][1];
            this.target.setEnermy();
            for (let i = 0; i < this.target.enermy.length; i++) {
                let dis = MathUtils.getDistance(centX, centY, this.target.enermy[i].x, this.target.enermy[i].y);
                let tempRadian = MathUtils.getRadian2(centX, centY, this.target.enermy[i].x, this.target.enermy[i].y);
                let deltax = dis*Math.cos(tempRadian + radian);
                let deltay = dis*Math.sin(tempRadian + radian);
                if ((Math.abs(deltax) <= 65) && (Math.abs(deltay) <= 8)) {
                    this.target.enermy[i].gotoHurt();
                }
            }
        }
    }

    /**动画播放完成监听 */
    private armaturePlayEnd():void {
        // this.target.skillEffectArmature[3].visible = false;
        this.target.skillEffectArmature[4].visible = true;
        this.target.skillEffectArmature[4].play(this.target.skillEffect["passive2_2"], 0);
        this.position(this.target.skillEffectArmature[4]);
        // this.target.skillEffectArmature[1].removeCompleteCallFunc(this.armaturePlayEnd, this);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
        this.ShowEffect();
        target.skillEffectArmature[3].play(target.skillEffect["passive2_1"], 0);
        target.skillEffectArmature[4].play(target.skillEffect["passive2_2"], 0);
        target.setChildIndex(target.skillEffectArmature[4], 0)
        // target.skillEffectArmature[3].addCompleteCallFunc(this.armaturePlayEnd, this);
        this.position(target.skillEffectArmature[3]);
        this.position(this.target.skillEffectArmature[4]);
    }

    /**作用点 */
    private position(target:any):void {
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.x = 0;
                target.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.x = 0;
                target.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.x = 0;
                target.y = 0;
            break;
        }
    }

    /**显示特效 */
    public ShowEffect() {
        // this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        // this.target.skillArmature.visible = false;
    }

    private target:any;
    private passiveOffset:any[];
    private passiveLight:egret.Bitmap[];
    private passiveDelta:any[];
    private passiveSumDeltaX:any[];
    private passiveSumDeltaY:any[];
}