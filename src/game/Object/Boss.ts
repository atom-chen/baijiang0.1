/**
 * Boss
 * 技能1的范围: 宽:180, 高:85
 */
class Boss extends Enermy {
    public constructor() {
        super();
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 4.0), [
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            Enermy.Action_Dead,
            Enermy.Action_Run01,
            Enermy.Action_Run02,
            Enermy.Action_Run03,
            Boss.Action_Idle01,
            Boss.Action_Skill01_01,
            Boss.Action_Skill01_02,
            Boss.Action_Skill01_03,
            Boss.Action_Skill02
        ]);
        //增加动画帧执行函数
        this.armature.addFrameCallFunc(this.armatureFrame, this);

        //释放主动技能动画
        this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature("Boss01_effect01", "Boss01_effect01", 2.0), [
            "skill01"
        ]);

        //boss技能
        let bossConfig = ConfigManager.enermyConfig[name];
        this._skill = ObjectPool.pop(bossConfig.skill.name);
        this._skill.init(this);

        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
        // this.skillArmature.scaleX = 1.5;
        // this.skillArmature.scaleY = 1.5;
    }

    public init(data:Array<any>) {
        super.init(data);
        this.initDragonBonesArmature(data[0]);
        this.skillPoint = new egret.Point();
        this.offset = [[50, -25], [25, -25], [0, 0], [-50, 0], [-50, -25]]
        this.speed = 10;
        this.atk_range = 200;
        this.atk_speed = 50;
        this.skill_status = 0;
        this.hp = data[1];
        //增加动画完成函数
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        this.skillArmature.addCompleteCallFunc(this.skillArmaturePlayEnd, this);
        this.gotoEnter();
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**
     * 释放技能
     */
    public state_skill01(time:number):void {
        if (this.skill_status == 1) {
            this.skillArmature.x = this.skillArmature.x + this.deltaX;
            this.skillArmature.y = this.skillArmature.y + this.deltaY;
            //人物到技能的坐标
            let dx = 82 * Math.cos(this.radian+Math.PI/2);
            let dy = 82 * Math.sin(this.radian+Math.PI/2);
            //初始点的对角点
            this.skillPoint = this.skillArmature.localToGlobal();
            let beginX = this.skillPoint.x;
            let beginY = this.skillPoint.y;
            let x1;
            let y1;
            if (this.scaleX == -1) {
                x1 = beginX + this.skillArmature.width * Math.cos(this.radian) + dx;
                y1 = beginY + this.skillArmature.width * Math.sin(this.radian) + dy;
            }else{
                x1 = beginX + this.skillArmature.width * Math.cos(this.radian) - dx;
                y1 = beginY + this.skillArmature.width * Math.sin(this.radian) - dy;
            }
            let centerX = (beginX + x1)/2;
            let centerY = (beginY + y1)/2;
            let dis = MathUtils.getDistance(centerX, centerY, GameData.heros[0].x, GameData.heros[0].y);
            let tempRadian = MathUtils.getRadian2(centerX, centerY, GameData.heros[0].x, GameData.heros[0].y);
            let angle = Math.abs(tempRadian - this.radian);
            let deltax = dis*Math.cos(angle);
            let deltay = dis*Math.sin(angle);
            if ((Math.abs(deltax) <= 45) && (Math.abs(deltay) <= 43)) {
                if (!this.skill_atkStatus) {
                    this.skill_atkStatus = true;
                    GameData.heros[0].gotoHurt();
                }
            }
        }
    }

    /**
     * 奔跑状态
     */
    public state_run(time:number):void {
        super.state_run(time);
    }

    /**
     * 攻击状态
     */
    public state_attack(time:number):void {
        this.x = this.x + this.deltaX;
        this.y = this.y + this.deltaY;
        if (!this.skill_atkStatus) {
            var dis = MathUtils.getDistance(this.x, this.y, GameData.heros[0].x, GameData.heros[0].y);
            if (dis < 33) {
                this.skill_atkStatus = true;
                GameData.heros[0].gotoHurt();
            }
        }
    }
    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        
    }

    /**奔跑 */
    public gotoRun() {
        super.gotoRun();
    }

    /**
     * 受伤
     */
    public gotoHurt(isSkillHurt:boolean = false) {
        super.gotoHurt();
        // this.filters = [this.defaultFlilter];
        this.skillArmature.visible = false;
    }

    /**蓄力 */
    public gotoReady() {
        this.gotoAttack();
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        this.deltaX = 0;
        this.deltaY = 0;

        this.atk_direction = this.getWalkPosition("attack", this.radian);
        this.armature.play(this.atk_direction, 1);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
    }

    /**
     * 技能
     */
    public gotoSkill() {
        this.curState = "skill01";
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this.atk_direction = this.getWalkPosition("skill01_", this.radian);
        this.armature.play(this.atk_direction, 1);
    }

    /**
     * 进场
     */
    public gotoEnter() {
        super.gotoEnter();
        this.armature.play(Boss.Action_Idle01, 0);
    }

    /**
     * 技能特效的角度及移动距离
     */
    private skillRadian() {
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        this.originX = this.x;
        this.originY = this.y;
        let useSpeed = this.atk_speed * 0.1;
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        let animation = this.getAttackPosition(this.radian);
        this.offsetIndex = animation["id"];

        this.deltaX = Math.cos(this.radian) * useSpeed;
        this.deltaY = Math.sin(this.radian) * useSpeed;

        this.skillArmature.scaleX = 1;
        this.skillArmature.scaleY = 1;
        this.skillArmature.rotation = MathUtils.getAngle(this.radian) + 360;
        if (this.reverse(this, this.radian)) {
            this.skillArmature.scaleX = -1;
            this.skillArmature.scaleY = -1;
            this.skillArmature.rotation = 360 - MathUtils.getAngle(this.radian);
            this.deltaX = -this.deltaX;
        }
        this.skillArmature.x = this.offset[this.offsetIndex][0];
        this.skillArmature.y = this.offset[this.offsetIndex][1];
        let dx = Math.cos(this.radian) * this.atk_range;
        let dy = Math.sin(this.radian) * this.atk_range;
        this.atk_rangeX = Math.abs(dx);
        this.atk_rangeY = Math.abs(dy);
    }

    /**增加buff */
    public addBuff(buff:any) {
        if (this.curState == Boss.Action_Dead || this.curState == BaseGameObject.Action_Hurt) return;
        if (this.isExistBuff(buff) && (buff.buffData.controlType == ControlType.YES) && (buff.buffData.superpositionType == SuperpositionType.SuperpositionType_None)) return;
        this.buff.push(buff);
        this.armature.play(BaseGameObject.Action_Hurt);
        buff.buffStart(this);
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
    }
    /**消失 */
    public disappear():void {
        super.disappear();
        let index = GameData.boss.indexOf(this);
        GameData.boss.splice(index, 1);
    }
    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "skill01") {
            this.skillArmature.visible = true;
            this.skill_atkStatus = false;
            this.skillRadian();
            this.skillArmature.play(this.curState, 1);
            this.skill_status = 1;
        }
        else if (evt == "attack") {
            //怪物到英雄的距离
            let useSpeed = this.atk_distance * 0.035;
            this.deltaX = Math.cos(this.radian) * useSpeed;
            this.deltaY = Math.sin(this.radian) * useSpeed;
            this.skill_atkStatus = false;
        }
        else if (evt == "call") {
            this._skill.update();
        }
    }


    public skillArmaturePlayEnd():void {
        if (this.curState == "skill01") {
            this.skillArmature.visible = false;
            this.skill_status = 0;
            this.gotoRun();
        }
    }
    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        super.effectArmaturePlayEnd();
    }

    public armaturePlayEnd():void {
        super.armaturePlayEnd();
        switch (this.curState) {
            case BaseGameObject.Action_Enter:
                this.gotoRun();
            break;
            case "attack":
                this.gotoRun();
                this.isComplete = false;
                this.atk_timer.start();
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


    /**技能 */
    private _skill:any;
    public isSkillHurt:boolean;
    /**技能的坐标 */
    private skillPoint:egret.Point;

    /*************英雄的动作***************/
    private static Action_Skill01_01:string = "skill01_01"
    private static Action_Skill01_02:string = "skill01_02"
    private static Action_Skill01_03:string = "skill01_03"
    private static Action_Skill02:string = "skill02";
    private static Action_Idle01:string = "idle01";

    private atk_direction:string;
    /**技能状态 0:没有释放 1:开始释放 */
    private skill_status:number;
    /**技能攻击状态 0:没有攻击到 1:已经攻击到 */
    private skill_atkStatus:boolean;
    /************************************/

    private offset:any[];
    private offsetIndex:number;
}