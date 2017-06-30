/**
 * 主界面
 */
class MainScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.skinName = "resource/game_skins/mainSceneSkin.exml"
    }

    protected childrenCreated(): void{

    }

    private uiCompleteHandler():void {
        this.btn_ready.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_talent.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_setting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_applicate.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_pvp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.InitScene();
    }

    private InitScene():void{
        this.createMainScene();
        this.onChangeData();

        GameLayerManager.gameLayer().addEventListener(UserData.CHANGEDATA, this.onChangeData, this);
    }

    private onChangeData():void{
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.lab_power.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("power"));
    }

    private createMainScene():void{
        this.star_list = [];
        let starPosition = [[54,174],[75,42],[242,39],[622,80],[738,69],[958,110],[550,170],[1060,122],[1058,335],[1072,412]]
        let star_scale_list = [0.12, 0.1, 0.22, 0.08, 0.23, 0.2, 0.05, 0.1, 0.26, 0.13];
        for(let i:number = 0; i < 10; i++){
            this.star_list[i] = new egret.Bitmap(RES.getRes("0_0000_yinghuochongda01_png"));
            this.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], starPosition[i][0], starPosition[i][1]);
            this.star_list[i].anchorOffsetX = this.star_list[i].width / 2;
            this.star_list[i].anchorOffsetY = this.star_list[i].height / 2;
        }
        
        let fire = new MovieClipManager("fire");
        Common.SetXY(fire, 382, 384);
        this.addChildAt(fire, 2);
        fire.Action("fire", -1);

        let zhaoyun = new MovieClipManager("zhaoyun");
        Common.SetXY(zhaoyun, 424, 207);
        this.addChildAt(zhaoyun, 1);
        zhaoyun.Wait();

        let hair = new MovieClipManager("hair");
        Common.SetXY(hair, 593, 133);
        this.addChild(hair);
        hair.Action("hair", -1);

        let buxiaomang = new MovieClipManager("buxiaoman");
        Common.SetXY(buxiaomang, 605, 118);
        this.addChild(buxiaomang);
        buxiaomang.Wait();

        let diaochan = new MovieClipManager("diaochan");
        Common.SetXY(diaochan, 688, 275);
        this.addChild(diaochan);
        diaochan.Action("action", -1);

        let long = new MovieClipManager("long");
        Common.SetXY(long, 231, 27);
        this.addChild(long);
        long.Action("long",-1);

        let guanyu = new MovieClipManager("guanyu");
        Common.SetXY(guanyu, 185, 9);
        this.addChild(guanyu);
        guanyu.Wait();

        let sunluban = new MovieClipManager("sunluban");
        Common.SetXY(sunluban, 11, 242);
        this.addChild(sunluban);
        sunluban.Action("action2", 4)

        let timeNum = 100;
        let lightNum = 0;
        let time = new egret.Timer(200);
        let isScale:boolean = true;
        this.img_light.scaleX = 3.2, this.img_light.scaleY = 3.2;
        time.addEventListener(egret.TimerEvent.TIMER, ()=>{

            if(isScale){
                this.img_light.scaleX += 0.1;
                this.img_light.scaleY += 0.1;
                for(let i:number = 0; i < 10; i++){
                    this.star_list[i].scaleX += star_scale_list[i];
                    this.star_list[i].scaleY += star_scale_list[i];;
                }
            }
            else
            {
                this.img_light.scaleX -= 0.1;
                this.img_light.scaleY -= 0.1;
                 for(let i:number = 0; i < 10; i++){
                    this.star_list[i].scaleX -= star_scale_list[i];;
                    this.star_list[i].scaleY -= star_scale_list[i];;
                }
            }

            if(timeNum == 0) sunluban.Action("action2", 4) ;
            if(timeNum == 1500) buxiaomang.Action("action", 2);
            else if(timeNum == 3000) guanyu.Action();
            else if(timeNum == 4000)  sunluban.Action("action1", 2);
            else if(timeNum == 4500) zhaoyun.Action();
            timeNum += 100;
            if(timeNum > 6000) timeNum = 0;

            lightNum++;
            if(lightNum == 6){
                lightNum = 0;
                isScale = !isScale;
            }
        }, this);
        time.start();        
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
                SceneManager.nextScene = "battleScene";
                WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
				break;
			case this.btn_equip:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                WindowManager.GetInstance().GetWindow("EquipDialog").Show();
				break;
            case this.btn_pvp:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                WindowManager.GetInstance().GetWindow("PVPWindow").Show();
                break;
			case this.btn_talent:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                WindowManager.GetInstance().GetWindow("TalentDialog").Show();
				break;
			case this.btn_setting:
				this.popupGroup.visible = true;
				break;
            case this.btn_shop:
				GameLayerManager.gameLayer().panelLayer.removeChildren();
                WindowManager.GetInstance().GetWindow("ShopDialog").Show();
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

    private btn_pvp:eui.Button;

    private img_light:eui.Image;
    private star_list:Array<egret.Bitmap>;

    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
    private lab_diamond:eui.Label;
    private lab_power:eui.Label;

    /**设置弹出 */
    private popupGroup:eui.Group;
}