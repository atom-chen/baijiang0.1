class Enermy extends BaseGameObject {
    public constructor() {
        super();
        this.colorFlilter = new egret.ColorMatrixFilter(this.colorMatrix);
        this.defaultFlilter = new egret.ColorMatrixFilter(this.defaultMatrix);
        this.atk_timer = new egret.Timer(1000);
        this.atk_timer.stop();
        this.atk_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
    }

    public initDragonBonesArmature(name:string):void {
        //受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("daoguang_effect", "daoguang_effect", 8), [
            BaseGameObject.Action_Hurt
        ]);
        //死亡受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("blood_die", "blood_die", 8), [
            Enermy.Action_HurtDie
        ]);
        //出场动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("enter_monster_01", "enter_monster_01", 10.0), [
            BaseGameObject.Action_Enter
        ]);

        //buff动画
        this.buffArmature.register(DragonBonesFactory.getInstance().makeArmature("buff", "buff", 10), [
            "Burning"
        ]);
        this.buffArmature.visible = false;
        this.effectArmature.scaleX = 1.5;
        this.effectArmature.scaleY = 1.5;
        this.buffArmature.scaleX = 1.5;
        this.buffArmature.scaleY = 1.5;
    }

    public init(data:Array<any>) {
        super.init(data);
        this.buff = [];
        this.isEnemy = true;
        this.isSummon = false;
        this.isBoss = false;
        this.isSkillHurt = false;
        this.isReadSkill = false;
        this.lastAnimation = "";
        this.atk_distance = ConfigManager.enermyConfig[data[0]].mov;
        this.away_distance = ConfigManager.enermyConfig[data[0]].away;
        this.atk_timer.repeatCount = ConfigManager.enermyConfig[data[0]].cd;
        this.isComplete = true;
        this.isRemote = ConfigManager.enermyConfig[data[0]].isRemote;
        // this.maskImprisoned.mask = this;
    }

    public update(time:number):void {
        super.update(time);
    }

    /*******************状态的帧回调**********************/
    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**死亡状态 */
    public state_dead(time:number):void {

    }

    /**
     * 受到攻击状态
     */
    public state_hurt(time:number):void {
        
    }

    /**攻击状态 */
    public state_attack(time:number):void {

    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number):void {
        if (!this.canMove) return;
        this.moveToTarget(GameData.heros[0].x, GameData.heros[0].y, ()=>{
            let useSpeed:number = this.speed * 0.1;
            this.radian = MathUtils.getRadian2(this.x, this.y, this.endX, this.endY);
            let animation = this.getWalkPosition("run", this.radian);
            this.deltaX = Math.cos(this.radian) * useSpeed;
            this.deltaY = Math.sin(this.radian) * useSpeed;
            this.x = this.x + this.deltaX;
            this.y = this.y + this.deltaY;
            this.reverse(this, this.radian);
            if (animation != this.lastAnimation) {
                this.lastAnimation = animation;
                this.armature.play(animation, 0);
            }
            if (this.isComplete == true) {
                let dis:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
                if (dis <= this.atk_distance) {
                    this.gotoReady();
                }
                // else if ((dis > 100) && (dis <= 200) && this.isRemote) {
                //     this.gotoSkill();
                // }
            }
        });
    }
    /****************************************************/


    /*******************进入状态**************************/
    /**
     * 进入待机状态
     */
    public gotoIdle() {
        this.curState = BaseGameObject.Action_Idle;
        super.gotoIdle();
    }

    /**
     * 进场
     */
    public gotoEnter() {
        this.curState = BaseGameObject.Action_Enter;
        this.effectArmature.visible = true;
        this.effectArmature.y = 10;
        this.effectArmature.play(this.curState, 1);
    }

    /**奔跑 */
    public gotoRun() {
        this.lastAnimation = "";
        this.curState = "run";
    }

    /**攻击 */
    public gotoAttack() {
        this.curState = "attack";
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this.reverse(this, this.radian);
    }

    /**
     * 技能
     */
    public gotoSkill() {
        
    }

    /**受到攻击 */
    public gotoHurt(isSkillHurt:boolean = false) {
        if ((this.curState == Enermy.Action_Dead) || (this.curState == BaseGameObject.Action_Hurt)) return;
        ShakeTool.getInstance().shakeObj(SceneManager.battleScene, 1, 5, 5);
        this.curState = BaseGameObject.Action_Hurt;
        this.armature.play(this.curState, 0);
        this.effectArmature.visible = true;
        if (!isSkillHurt) {
            if (this.hp == 1) {
                this.effectArmature.play(Enermy.Action_HurtDie, 1);
                this.effectArmature.x = 0;
                this.effectArmature.y = 0;
            }else{
                this.effectArmature.play(BaseGameObject.Action_Hurt, 1);
                this.effectArmature.x = -15;
                this.effectArmature.y = 0;
                if (this.hp < 0) this.gotoDead();
            }
            this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        }
        this.hp --;
    }

    /**蓄力 */
    public gotoReady() {
        
    }

    /**死亡 */
    public gotoDead() {
        this.curState = Enermy.Action_Dead;
        this.armature.play(Enermy.Action_Dead, 1);
        Common.dispatchEvent(GameEvents.EVT_PRODUCEMONSTER, this);
        //隐藏buff动画
        this.buffArmature.visible = false;
        TimerManager.getInstance().doTimer(5000, 0, this.disappear, this);
    }
    /****************************************************/

    /***********************其他函数**********************/
    /**
     * 攻击cd结束
     */
    public onComplete():void {
        this.atk_timer.reset();
        Common.log("攻击结束")
        this.isComplete = true;
    }
    /**
     * 设置状态
     */
    public setCurState(state:string):void {
        this.curState = state;
    }
    /**
     * 移动到指定的位置
     * 
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        super.moveToTarget(gotoX, gotoY, func);
        if (func != null) {
            func();
        }
    }
    /**消失 */
    public disappear():void {
        TimerManager.getInstance().remove(this.disappear, this);
        if (this.curState != Enermy.Action_Dead) return;
        ObjectPool.push(this);
        if (this.parent && this.parent.removeChild) this.parent.removeChild(this);
    }
    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:any):void {
        
    }
    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        if (this.curState == BaseGameObject.Action_Enter || this.curState == BaseGameObject.Action_Hurt) {
            this.effectArmature.visible = false;
        }
        if (this.hp == 0) {
            this.gotoDead();
        }else{
            this.gotoRun();
            // this.gotoIdle();
        }
    }

    public armaturePlayEnd():void {
        
    }
    /**
     * 停止动画
     */
    public removeComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }
    /**回收技能和buff */
    public recycle():void {
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.className) {
                this.buff[i].recycleBuff();
            }
        }
    }
    /****************************************************/

    public colorMatrix = [
        1,0,0,0.4,0,
        1,0,0,0,0,
        1,0,0,0,0,
        0,0,0,1,0
    ]
    public colorFlilter:egret.ColorMatrixFilter;
    public defaultMatrix = [
        1,0,0,0,0,
        0,1,0,0,0,
        0,0,1,0,0,
        0,0,0,1,0
    ]
    public defaultFlilter:egret.ColorMatrixFilter;
    /**受到的伤害是否为技能伤害 */
    public isSkillHurt:boolean;
    /**是否远程攻击 */
    public isRemote:boolean;
    /**攻击距离 */
    public atk_distance:number;
    /**逃离距离 */
    public away_distance:number;
    /**攻击间隔计数器 */
    public atk_timer:egret.Timer;
    /**攻击cd结束标志 */
    public isComplete:boolean;
    /**是否为召唤兵 */
    public isSummon:boolean;
    /**是否为boss */
    public isBoss:boolean;
    /**是否技能准备 */
    public isReadSkill:boolean;

    /*************敌方的状态***************/
    public static Action_Run01:string = "run01";
    public static Action_Run02:string = "run02";
    public static Action_Run03:string = "run03";
    public static Action_Dead:string = "dead";
    public static Action_HurtDie:string = "hurt_die";

}