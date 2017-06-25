/**
 * 进入游戏场景
 */
class EnterGameScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.skinName = "resource/game_skins/enterGameSkin.exml"
    }

    private uiCompleteHandler():void {
        // Common.kbengine.Event.register("onConnectionState", this, "onConnectionState");
        this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterGame, this);
        this.btn_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRank, this);
    }

    protected createChildren(): void{
    }

    protected childrenCreated(): void{
        //加入敏感词
        let array = RES.getRes("sensitiveWords_json");
        SensitiveWordFilter.GetInstance().regSensitiveWords(array);
    }

    /**
     * 进入游戏
     */
    private onEnterGame():void {
        GameLayerManager.gameLayer().sceneLayer.removeChildren();
        SceneManager.mainScene = new MainScene();
        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
    }
    private onConnectionState(status:boolean):void {
        if (status) {
            Common.log("链接服务器成功，正在登陆");
        }else{
            Common.log("faild");
        }
    }
    /**
     * 排行榜
     */
    private onRank():void {

    }

    /**开始游戏按钮 */
    private btn_begin:eui.Button;
    /**排行榜按钮 */
    private btn_rank:eui.Button;
}