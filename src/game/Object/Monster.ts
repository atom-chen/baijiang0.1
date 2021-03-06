/**
 * 怪物
 */
class Monster extends Enermy {
    public constructor() {
        super();
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 2), [
            BaseGameObject.Action_Idle,
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            Enermy.Action_Run01,
            Enermy.Action_Run02,
            Enermy.Action_Run03,
            Enermy.Action_Dead,
            Monster.Action_Ready01,
            Monster.Action_Ready02
        ]);
        //释放主动技能动画
        if (ConfigManager.isInArmatures(`${name}_skill`)) {
            this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature(`${name}_skill`, `${name}_skill`, 10), [
                "skill01_01",
                "skill01_02"
            ]);
            this.skillArmature.addFrameCallFunc(this.skillArmatureFrame, this);
        }
        //增加动画帧执行函数
        this.armature.addFrameCallFunc(this.armatureFrame, this);
        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
        this.skillArmature.scaleX = 1.5;
        this.skillArmature.scaleY = 1.5;
    }

    public init(data:Array<any>, isElite:boolean = false, isSummon:boolean = false) {
        this.attr.initEnermyAttr(data[1].attr);
        super.init(data);
        this.initDragonBonesArmature(data[0]);
        this.isSummon = isSummon;
        this.isElite = isElite;
        this.speed = 10;
        this.readyCount = 0;
        this.skill_atkStatus = false;
        //增加动画完成函数
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        this.gotoEnter();
    }

    /**
     * 到达边缘
     */
    private _bound():void {
        this.skillArmature.play("skill01_01", 1);
        this.deltaX = 0;
        this.deltaY = 0;
        this._remote = false;
    }

    /**
     * 技能释放或远程攻击状态
     */
    public skillFly() {
        this.skillArmature.x += this._deltaX;
        this.skillArmature.y += this._deltaY;
        //初始点的对角点
        let skillPoint = this.skillArmature.localToGlobal();
        if (!this.skill_atkStatus) {
            let dis = MathUtils.getDistance(skillPoint.x, skillPoint.y, GameData.heros[0].x, GameData.heros[0].y);
            if (dis <= 30) {
                let state = GameData.heros[0].getCurState();
                if (state == "attack") {
                    this._bound();
                }else{
                    GameData.heros[0].gotoHurt(this.attr.atk);
                }
                this.skill_atkStatus = true;
            }
        }
        if (skillPoint.x < 20) this._bound();
        if (skillPoint.y < 20) this._bound();
        if (skillPoint.x > Common.SCREEN_W - 20) this._bound();
        if (skillPoint.y > Common.SCREEN_H - 20) this._bound();
    }

    public update(time:number):void {
        super.update(time);
        if (this._remote) {
            this.skillFly();
        }
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**死亡状态 */
    public state_dead(time:number):void {

    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number):void {
        super.state_run(time);
    }

    /**
     * 蓄力状态
     */
    public state_xuli01(time:number):void {
        
    }

    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        // Common.log(this.effectArmature.getState(this.curState));
    }

    /**攻击状态 */
    public state_attack(time:number):void {
        if (Math.abs(this.sumDeltaX) > this.atk_rangeX || Math.abs(this.sumDeltaY) > this.atk_rangeY) {
            if (this.curState == BaseGameObject.Action_Hurt) {
                return;
            }
            this.gotoRun();
            this.isComplete = false;
            this.atk_timer.start();
            //怪物到英雄的距离
            // var dis = MathUtils.getDistance(this.centerX, this.centerY, GameData.heros[0].x, GameData.heros[0].y);
            // var dx = dis*Math.cos(this.heroRadian);
            // var dy = dis*Math.sin(this.heroRadian);
            // if ((Math.abs(dx) <= this.atk_distance/2) && (Math.abs(dy) <= 33)) {
            //     GameData.heros[0].gotoHurt();
            // }else{
            // }
        }

        this.x = this.x + this.deltaX;
        this.y = this.y + this.deltaY;
        this.sumDeltaX = this.sumDeltaX + this.deltaX;
        this.sumDeltaY = this.sumDeltaY + this.deltaY;
        if (!this.skill_atkStatus) {
            var dis = MathUtils.getDistance(this.x, this.y, GameData.heros[0].x, GameData.heros[0].y);
            if (dis < 33) {
                GameData.heros[0].gotoHurt(this.attr.atk);
                this.skill_atkStatus = true;
            }
        }
    }

    /**
     * 进场
     */
    public gotoEnter() {
        super.gotoEnter();
        this.armature.play(BaseGameObject.Action_Idle, 0);
    }

    /**奔跑 */
    public gotoRun() {
        super.gotoRun();
    }

    /**
     * 技能
     */
    public gotoSkill() {
        this.curState = "skill";
        let useSpeed = this.atk_distance * 0.02;
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this._deltaX = Math.cos(this.radian) * useSpeed;
        this._deltaY = Math.sin(this.radian) * useSpeed;
        this.skillArmature.rotation = MathUtils.radianToAngle(this.radian);
        this.skillArmature.visible = true;
        this.skillArmature.x = 0;
        this.skillArmature.y = -50;
        SceneManager.battleScene.effectLayer.addChild(this.skillArmature);
        this.skillArmature.x = this.x;
        this.skillArmature.y = this.y;
        this.skillArmature.play("skill01_02", 0);
        this._remote = true;
        this.skill_atkStatus = false;
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        let useSpeed = this.atk_distance * 0.05;

        let animation = this.getWalkPosition("attack", this.radian);
        let dx = Math.cos(this.radian) * this.atk_distance;
        let dy = Math.sin(this.radian) * this.atk_distance;
        this.atk_rangeX = Math.abs(dx);
        this.atk_rangeY = Math.abs(dy);
        /**中心点 */
        this.centerX = (2*this.originX + dx)/2;
        this.centerY = (2*this.originY + dy)/2;
        this.heroRadian = MathUtils.getRadian2(this.centerX, this.centerY, GameData.heros[0].x, GameData.heros[0].y);

        this.deltaX = Math.cos(this.radian) * useSpeed;
        this.deltaY = Math.sin(this.radian) * useSpeed;
        this.armature.play(animation, 0);
        this.skill_atkStatus = false;
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        super.gotoHurt(hurtValue, isSkillHurt);
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**蓄力 */
    public gotoReady() {
        if (!this.canMove) return;
        this.curState = Monster.Action_Ready01;
        this.readyCount = 0;
        this.armature.play(Monster.Action_Ready01, 3);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
    }

    /**消失 */
    public disappear():void {
        super.disappear();
        let index = GameData.monsters.indexOf(this);
        GameData.monsters.splice(index, 1);
    }

    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:any):void {
        super.armatureFrame(event);
    }

    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        super.effectArmaturePlayEnd();
    }

    public skillArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "evtFracture") {
            this.skillArmature.visible = false;
            this._remote = false;
            this.addChild(this.skillArmature);
        }
    }

    /**
     * 动画播放完成函数
     */
    public armaturePlayEnd():void {
        super.armaturePlayEnd();
        switch (this.curState) {
            case Monster.Action_Ready01:
                this.readyCount ++;
                if (this.readyCount == 3) {
                    if (this.isRemote){
                        this.gotoSkill();
                        this.isComplete = false;
                        this.atk_timer.start();
                        this.gotoRun();
                    }else{
                        this.gotoAttack();
                    }
                }
                else if (this.readyCount == 2 && this.isElite) {
                    Animations.fadeOutIn(this.img_sigh, 200);
                }
            break;
        }
    }

    /**
     * 停止动画
     */
    public removeComplete():void {
        super.removeComplete();
    }

    /**
     * 停止人物动作动画
     */
    public removeActComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this);
    }

    public addEffectComplete() {
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    /**停止特效动画 */
    public removeEffectComplete():void {
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    public isSkillHurt:boolean;
    private readyCount:number;
    private heroRadian:number;
    /**远程攻击标志 */
    private _remote:boolean;
    private _deltaX:number;
    private _deltaY:number;
    /**远程攻击击中 */
    private skill_atkStatus:boolean;
    /*************英雄的动作***************/
    private static Action_Ready01:string = "xuli01";
    private static Action_Ready02:string = "xuli02";
    private static Action_Skill:string = "skill01"
    /************************************/
}