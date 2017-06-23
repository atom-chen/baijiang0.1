/**
 * 天赋界面
 */
class TalentDialog extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/talentWindowSkin.exml";
        this.tcTalent = RES.getRes("TcTalent_json");
        TalentDialog.instance = this;
    }

    protected createChildren(): void{
        this.topBtnSkin = [];
        this.topBtn = [];
        this.pages = [];
        this.popupGroup.anchorOffsetX = Common.SCREEN_W/2;
        this.popupGroup.anchorOffsetY = Common.SCREEN_H/2;
        this.popupGroup.x = Common.SCREEN_W/2;
        this.popupGroup.y = Common.SCREEN_H/2;
        this.skillPopupGroup.anchorOffsetX = Common.SCREEN_W/2;
        this.skillPopupGroup.anchorOffsetY = Common.SCREEN_H/2;
        this.skillPopupGroup.x = Common.SCREEN_W/2;
        this.skillPopupGroup.y = Common.SCREEN_H/2;
    }

    protected childrenCreated():void {
        for (let i = 0; i < Common.userData.talentPage.length; i++) {
            this.pages[i] = new TalentIR(i);
        }
        this.show(Common.userData.talentPage.length);
        this.pageGroup.addChild(this.pages[0]);
        Utils.toggleButtonStatus(this.topBtn, 0);
        this.curPage = 0;
    }

    private uiCompleteHandler():void {
        this.btn_add.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_certain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_closeDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upPower.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upDiamond.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
    }

    /**
     * 顶部按钮监听
     */
    private topBtnListener(event:egret.TouchEvent):void {
        this._focusBtn = event.currentTarget;
        switch (this._focusBtn) {
            case this.btn_add:
                this.lab_title.text = "购买天赋";
                this.lab_detail.text = "购买天赋需要花费50玉石";
                this.purchassType = 1;
                Animations.popupOut(this.popupGroup, 500);
                this.popupGroup.visible = true;
                GameLayerManager.gameLayer().maskLayer.addChild(this.popupGroup);
            break;
            case this.btn_reset:
                this.lab_title.text = "重置天赋";
                this.lab_detail.text = "重置天赋需要花费5000金币";
                this.purchassType = 2;
                Animations.popupOut(this.popupGroup, 500);
                this.popupGroup.visible = true;
                GameLayerManager.gameLayer().maskLayer.addChild(this.popupGroup);
            break;
            default:
                GameLayerManager.gameLayer().panelLayer.removeChildren();
            break;
        }
    }

    /**
     * 弹窗按钮回调
     */
    private onPopupBtn(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_certain:
                Animations.popupIn(this.popupGroup, 300, ()=>{
                    GameLayerManager.gameLayer().maskLayer.removeChildren();
                    this.onPurchass(this.purchassType);
                });
            break;
            default:
            Animations.popupIn(this.popupGroup, 300, ()=>{
                GameLayerManager.gameLayer().maskLayer.removeChildren();
            });
            break;
        }
    }

    /**
     * 解锁逻辑
     */
    private _unLockTalent(type:string) {
        if (modTalent.isUnlock(this.curPage, this.curTalentId)) {
            this.update();
            if (type == "power") {

            }else{

            }
        }else{
            let strs = modTalent.getTips(this.curTalentId);
            Animations.showTips(strs, 1, true);
        }
    }

    /**
     * 技能弹窗按钮回调
     */
    private onSkillPop(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_upPower:
                this._unLockTalent("power");
            break;
            case this.btn_upDiamond:
                this._unLockTalent("diamond");
            break;
            default:
                Animations.popupIn(this.skillPopupGroup, 300, ()=>{
                    GameLayerManager.gameLayer().maskLayer.removeChildren();
                });
            break;
        }
    }

    /**
     * 确定按钮方法
     */
    private onPurchass(type:number):void {
        if (type == 1) {
            //购买天赋页
            this.pageGroup.removeChildren();
            let talent = {"name":"", "count":0, "talent":[]};
            Common.userData.talentPage.push(talent);
            let len = Common.userData.talentPage.length;
            this.createToggleBtn(len-1);
            this.btn_add.x = 155 + 55 * len;
            Utils.toggleButtonStatus(this.topBtn, len - 1);
            this.curPage = len - 1;
            this.pages[len- 1] = new TalentIR(len - 1);
            this.pageGroup.addChild(this.pages[len - 1]);
        }else{
            //重置天赋页
            if (Common.userData.talentPage[this.curPage].talent.length == 0) {
                Animations.showTips("无需重置", 1, true);
                return;
            }
            Common.userData.talentPage[this.curPage].talent = [];
            this.pages[this.curPage].reset(this.curPage);
        }
    }

    /**
     * 天赋页按钮监听
     */
    private pageBtnListener(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.curPage = target.id;
        // Common.log(target);
        modTalent.setUnlock(this.curPage);
        this.createTalentPage(target.id);
    }

    /**
     * 创建天赋页选项按钮
     */
    private createToggleBtn(id:number):void {
        var skinName = 
        `<e:Group xmlns:e="http://ns.egret.com/eui">
                <e:ToggleButton label="0">
                    <e:Skin states="up,down,disabled">
                        <e:Image width="100%" height="100%" source="button_0006_png" source.down="button_0007_png"/>
                        <e:Label id="labelDisplay" horizontalCenter="0" verticalCenter="0" textColor.down="0xFFFFFF" bold="true" fontFamily="Microsoft YaHei" textColor="0x111111"/>
                    </e:Skin>
                </e:ToggleButton>
            </e:Group>`;
        var clazz = EXML.parse(skinName);
        this.topBtnSkin[id] = new clazz();
        this.topBtnSkin[id].x = 155 + 55 * id;
        this.topBtnSkin[id].y = 100;
        let toggleBtn:any = this.topBtnSkin[id].getChildAt(0);
        toggleBtn.id = id;
        toggleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pageBtnListener, this);
        this.topBtn.push(toggleBtn);
        toggleBtn.label = `${id + 1}`;
        this.addChild(this.topBtnSkin[id]);
    }

    /**
     * 创建天赋页
     */
    private createTalentPage(pageCount:number):void {
        this.pageGroup.removeChildren();
        this.pages[pageCount].setTalentDetail(pageCount);
        Utils.toggleButtonStatus(this.topBtn, pageCount);
        this.pageGroup.addChild(this.pages[pageCount]);
    }

    /**
     * 更新升级弹窗
     */
    private update():void {
        if (this.curLevel >= 10) {
            Animations.showTips("此天赋已满", 1, true);
            return;
        }
        if (modTalent.isTalentFull(this.curPage, this.curTalentId)) {
            Animations.showTips("天赋已点满", 1, true);
            return;
        }
        this.curLevel ++;
        this.lab_lv.text = `${this.curLevel}/10`;
        if (this.curLevel == 10) this.lab_lv.textColor = Common.TextColors.lvFull;
        //更新能量点
        // this.lab_power
        this.pages[this.curPage].setTalentLv();
        this.pages[this.curPage].setUnlock(this.curTalentId);
        modTalent.setData(this.curPage, this.curTalentId, this.curLevel);
        Animations.showTips("天赋升级成功", 1);
    }

    /**
     * 升级天赋弹窗
     */
    public showPopup(num:number, lv:number):void {
        this.skillPopupGroup.visible = true;
        this.curLevel = lv;
        this.curTalentId = num;
        GameLayerManager.gameLayer().maskLayer.addChild(this.skillPopupGroup);
        Animations.popupOut(this.skillPopupGroup, 500);
        let id:number = 0;
        for (let obj = 0; obj < 21; obj++) {
            if (this.tcTalent[obj].id == num) {
                id = obj;
                break;
            }
        }
        this.lab_name.text = this.tcTalent[id].name;
        this.lab_skillDetail.text = this.tcTalent[id].content;
        this.lab_lv.text = `${lv}/10`;
        if (this.curLevel == 10) {
            this.lab_lv.textColor = Common.TextColors.lvFull;
        }else{
            this.lab_lv.textColor = Common.TextColors.lvNotFull;
        }

        let btn:any = this.btn_upPower.getChildAt(0);
        let diamondBtn:any = this.btn_upDiamond.getChildAt(0);
        if (modTalent.isUnlock(this.curPage, num)) {
            btn.source = "button_0004_png";
            diamondBtn.source = "btn_shopGet_png";
            this.lab_condition.text = "";
        }else{
            btn.source = "button_0010_png";
            diamondBtn.source = "button_0010_png";
            let strs = modTalent.getTips(this.curTalentId, false);
            this.lab_condition.text = strs;
        }
    }

    /**
     * 界面显示
     */
    public show(pages:number):void {
        for (let i = 0; i < pages; i++) {
            if (!this.topBtnSkin[i]) {
                this.createToggleBtn(i);
            }
            this.addChild(this.topBtnSkin[i]);
        }
        this.btn_add.x = 155 + 55 * pages;
        this.lab_power.text = `${Common.userData.power}`;
    }

    public static instance:TalentDialog;
    /**天赋的配置文件 */
    private tcTalent:any;
    /**当前的天赋等级 */
    private curLevel:number;
    /**当前的天赋页 */
    private curPage:number;
    /**当前的天赋Id */
    private curTalentId:number;
	/*******************顶部按钮***********************/
	private topBtnSkin:eui.ToggleButton[];
    private topBtn:Array<any>;
	/*************************************************/
	/*******************技能升级弹窗***********************/
    private skillPopupGroup:eui.Group;
	private btn_closeDetail:eui.Button;
	private btn_upPower:eui.Button;
    private btn_upDiamond:eui.Button;
	private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_condition:eui.Label;
    private lab_skillDetail:eui.Label;
    private lab_consume:eui.Label;
	/*************************************************/
    private _focusBtn:eui.Button;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**重置按钮 */
    private btn_reset:eui.Button;
    /**增加按钮 */
    private btn_add:eui.Button;
    /**能量点 */
    private lab_power:eui.Label;
    /**天赋面板 */
    private pageGroup:eui.Group;
    /**弹出 */
    private popupGroup:eui.Group;
    /**弹窗标题 */
    private lab_title:eui.Label;
    /**弹窗关闭 */
    private btn_close:eui.Button;
    /**确定按钮 */
    private btn_certain:eui.Button;
    /**说明文字 */
    private lab_detail:eui.Label;
    /**购买类型 */
    private purchassType:number;
    private pages:Array<TalentIR>;
}