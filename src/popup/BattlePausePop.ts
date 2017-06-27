/**
 * 战斗暂停弹窗
 */
class BattlePausePop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/battlePausePopSkin.exml";
    }

    protected childrenCreated():void {
        
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        this.parent.removeChild(this);
        switch (event.currentTarget) {
            case this.btn_continue:
                TimerManager.getInstance().startTimer();
                modBattle.start();
            break;
            default:
                Animations.sceneTransition(()=>{
                    SceneManager.battleScene.cleanChildren();
                    DragonBonesFactory.getInstance().removeTimer();
                    GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
                });
            break;
        }
    }

    /**设置弹出的内容显示 */
    public Show():void {
        super.Show();
    }

    public Reset():void{
        this.btn_leave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close():void{
        super.Close();

        this.btn_leave.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**离开 */
    private btn_leave:eui.Button;
    /**继续 */
    private btn_continue:eui.Button;

    /*******************图片和文字************************/
    
}