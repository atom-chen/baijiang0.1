/**
 * 增加人物的基础属性
 * 
 */
class AddProperty extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "AddProperty";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_Overlay;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.duration = options.duration;
        this.buffData.id = options.id;

        if (this.buffData.duration > 0) {
            let count = 50 * this.buffData.duration;
            if (!this._tempTimer) this._tempTimer = new egret.Timer(20, count);
            this._tempTimer.stop();
            this._tempTimer.addEventListener(egret.TimerEvent.TIMER, this._onUpdate, this);
            this._tempTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this._onComplete, this);
        }
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
        switch (this.buffData.id) {
            //狂怒
            case 20:
                //获取等级
                let talent = modTalent.getTestData(1);
                let lv = talent[1];
                let index:number = modTalent.getIndexFromId(1);
                let value:number = ConfigManager.tcTalent[index].value[lv-1];
                this.target.attr.wsp *= (1 - value/100);
                this.target.setWSPDelay();
            break;
            //巫术
            case 21:
            break;
        }
    }

    /**结束 */
    public buffEnd() {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        this._isReset = true;
        this.target.speed = 40;
        Common.log("增加属性buff")
        //增加的属性(后续扩展可以增加任何属性)

        this.target.speed *= (1+0.5);
        this._extraValue = Math.floor(this.target.attr.atk * 0.15);
        this.target.attr.atk += this._extraValue;

        if (this.buffData.duration > 0) this._tempTimer.start();
    }

    /**
     * 定时过程刷新数据
     */
    private _onUpdate(event:egret.TimerEvent) {
        if (this._isReset) {
            this._tempTimer.reset();
            this._tempTimer.start();
            this._isReset = false;
        }
    }

    /**
     * 定时完成
     */
    private _onComplete(event:egret.TimerEvent) {
        this._isReset = false;
        Common.log("buff 结束");
        //恢复原来数值(后续扩展)
        this.target.speed = 40;
        this.target.attr.atk -= this._extraValue;
        this._tempTimer.reset();
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

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.skillArmature.visible = false;
    }

    /**回收buff */
    public recycleBuff() {
        super.recycleBuff();
        if (this.buffData.duration > 0) this._tempTimer.reset();
    }

    private target:any;
    private _extraValue:number;
    private _extraBuff:UnableMove;
    private _tempTimer:egret.Timer;
    private _isReset:boolean;
}