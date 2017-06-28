/**
 * PVP战斗场景
 */
class PVPScene extends Base {
    public constructor() {
        super();
        GameData.heros = new Array();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.skinName = "resource/game_skins/pvpSceneSkin.exml"
    }
    protected createChildren(): void{
        this._createMap();
    }

    protected childrenCreated(): void{
        this.init();
    }

    public init():void {
        TimerManager.getInstance().startTimer();
        this._cdTime = 90;
        this.lab_cdTime.text = `${this._cdTime}`;
        this._createHero();
        DragonBonesFactory.getInstance().startTimer();
        TimerManager.getInstance().doTimer(1000, this._cdTime, this._onTimeCD, this, this._onTimeComplete, this);
    }

    /**
     * 停止倒计时
     */
    public stopTimer():void {
        TimerManager.getInstance().stopTimer();
    }

    private uiCompleteHandler():void {
    }

    /**
     * 对象回收
     */
    private _cycleObject():void {

    }

    private _onTimeCD():void {
        this._cdTime --;
        this.lab_cdTime.text = `${this._cdTime}`;
    }

    private _onTimeComplete():void {
        this.stopTimer();
    }

    /**
     * 创建英雄
     */
    private _createHero():void {
        this._hero = ObjectPool.pop("Hero");
        GameData.heros.push(this._hero);
        this._hero.init([GameData.curHero, GameData.hp], true);
        this._hero.x = Common.SCREEN_W/2 - 50;
        this._hero.y = Common.SCREEN_H/2;
        // this.hero.anchorOffsetY = -33;
        this._hero.anchorOffsetY = -50;
        this.addChild(this._hero);
    }

    /**
     * 创建地图
     */
    private _createMap():void {
        this._effectLayer = new egret.DisplayObjectContainer();
        this.addChild(this._effectLayer);
    }

    /**特效层（包括技能/buff等） */
    private _effectLayer:egret.DisplayObjectContainer;
    /**倒计时长 */
    private _cdTime:number;
    /**英雄 */
    private _hero:Hero;
    /**暂停按钮 */
    private btn_pause:eui.Button;
    /**技能释放按钮 */
    private btn_skill:eui.Button;
    /**技能背景 */
    private img_skillBg:eui.Image;
    /**技能cd时的遮罩 */
    private img_skillMask:eui.Image;
    /**技能cd */
    private lab_cdSkill:eui.Label;
    /**pvp倒计时 */
    private lab_cdTime:eui.Label;
    /**伤害量 */
    private lab_value:eui.Label;
}