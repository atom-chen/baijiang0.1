/**
 * 主界面
 */
class MainScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.skinName = "resource/game_skins/mainSceneSkin.exml"
    }

    private uiCompleteHandler():void {
        this.btn_ready.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_talent.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_setting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_applicate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.createFire();
        LeanCloud.GetInstance().InitData();
    }

    /**
     * 创建火光
     */
    private createFire():void {
        let bg:egret.Bitmap = Utils.createBitmap("firePot_png");
        this.addChild(bg);
        bg.x = 392;
        bg.y = 368;
        //获取纹理
        var texture = RES.getRes("ballParticle_png");
        //获取配置
        var config = RES.getRes("ballParticle_json");
        //创建 GravityParticleSystem
        var system = new particle.GravityParticleSystem(texture, config);
        //启动粒子库
        system.start();
        system.x = bg.x + 70;
        system.y = bg.y + 170;
        system.emitterX = 0;
        system.emitterY = 0;
        system.scaleX = system.scaleY = 1.5;
        this.addChild(system);
    }

    /**
     * 按钮处理
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        this._btnFocus = event.currentTarget;
		switch (this._btnFocus) {
			case this.btn_ready:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                if (!this.readyDialog) {
                    this.readyDialog = new ReadyDialog();
                }else{
                    this.readyDialog.show();
                }
                Common.curPanel = this.readyDialog;
                GameLayerManager.gameLayer().panelLayer.addChild(this.readyDialog)
				break;
			case this.btn_equip:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                if (!this.equipDialog) {
                    this.equipDialog = new EquipDialog();
                }
                else
                {
                    this.equipDialog.Show();
                }
                GameLayerManager.gameLayer().panelLayer.addChild(this.equipDialog);
				break;
			case this.btn_talent:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                if (!this.talentDialog) {
                    this.talentDialog = new TalentDialog();
                }else{
                    this.talentDialog.show(Common.userData.talentPage.length);
                }
                GameLayerManager.gameLayer().panelLayer.addChild(this.talentDialog);
				break;
			case this.btn_setting:
				this.popupGroup.visible = true;
				break;
            case this.btn_shop:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                if (!this.shopDialog) {
                    this.shopDialog = new ShopDialog();
                }
                GameLayerManager.gameLayer().panelLayer.addChild(this.shopDialog);
                break;
            case this.btn_applicate:
                this.popupGroup.visible = false;
                break;
			default:
                this.popupGroup.visible = false;
				break;
		}
    }

    private _btnFocus:eui.Button;
    /**准备出战 */
    private btn_ready:eui.Button;
    public readyDialog:ReadyDialog;
    /**装备 */
    private btn_equip:eui.Button;
    public equipDialog:EquipDialog;
    /**天赋 */
    private btn_talent:eui.Button;
    public talentDialog:TalentDialog;
    /**设置 */
    private btn_setting:eui.Button;
    /**应用 */
    private btn_applicate:eui.Button;
    /**商城 */
    private btn_shop:eui.Button;
    private shopDialog:ShopDialog;
    /**退出弹窗 */
    private btn_close:eui.Button;
    /**设置弹出 */
    private popupGroup:eui.Group;
}