/**
 * 准备界面
 */
class ReadyDialog extends Base {
    public name = 'ReadyDialog'
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/readyWindowSkin.exml";
        this.viewStack.selectedIndex = 1;
        this.btn_skill.selected = true;
    }

    protected createChildren(): void{
        this.show();
        this.starGroup = new eui.Group();
        this.detailGroup.addChild(this.starGroup);
        this.starGroup.x = 26;
        this.starGroup.y = 16;
        this._armatureGroup = new eui.Group();
        this.addChild(this._armatureGroup);
        this._armatureGroup.x = 260;
        this._armatureGroup.y = 460;
        this._heroArmature = new Array();
        this._curAttr = new Array();
        this._lastAttr = new Array();
        this._selectBox = Utils.createBitmap("img_selectHero_png");
        this._createAttr();
        this._createHeroIcon();
    }

    /**
     * 创建属性
     */
    private _createAttr():void {
        let attr = ["生命", "攻击", "护甲", "闪避", "暴击", "攻速"];
        let heroAttr = HeroData.getHeroData(GameData.curHero).attr;
        for (let i = 0; i < attr.length; i++) {
            let leftText = this._createLabel(attr[i]);
            leftText.left = 35;
            leftText.y = 70 + 40 * i;

            let rightText = this._createLabel(attr[i]);
            rightText.left = 340;
            rightText.y = leftText.y;

            let curAttr = this._createLabel();
            curAttr.textFlow = <Array<egret.ITextElement>>[
                {text:heroAttr[i], style:{"textColor":0x858685}},
                {text:"+0", style:{"textColor":Common.TextColors.green}}
            ];
            curAttr.right = 345;
            curAttr.y = leftText.y;
            this._curAttr.push(curAttr);

            let lastAttr = this._createLabel(`${heroAttr[i]+1}`);
            lastAttr.right = 40;
            lastAttr.y = rightText.y;
            this._lastAttr.push(lastAttr);
        }
    }

    /**
     * 更新属性值
     */
    public updateAttr(isUpgrade:boolean=false):void {
        let heroAttr = HeroData.getHeroData(GameData.curHero).attr;
        for (let i = 0; i < 6; i++) {
            if (isUpgrade) {
                heroAttr[i] ++;
            }
            let attr = heroAttr[i];
            this._curAttr[i].textFlow = [
                {text:attr, style:{"textColor":0x858685}},
                {text:"+0", style:{"textColor":Common.TextColors.green}}
            ];
            this._lastAttr[i].text = `${attr+1}`;
        }
        if (isUpgrade) HeroData.update();
    }

    private _createLabel(str:string = null):eui.Label {
        let text:eui.Label = new eui.Label();
        text.bold = true;
        text.fontFamily = "Microsoft YaHei";
        text.size = 24;
        text.text = str;
        text.textColor = 0x858685;
        this.biographyGroup.addChild(text);
        return text;
    }

    private uiCompleteHandler():void {
        this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_skill.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_detail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_battle.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_up.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.topBtn = [this.btn_upgrade, this.btn_skill, this.btn_detail];
        //每个人物的三个技能属性
        let temp:any;
        for (let i = 0; i < 3; i++) {
            this._skill[i] = new Array();
            switch (i) {
                case 0:
                    temp = [this.lab_skillname1, this.lab_cd1, this.lab_detail1, this.img_skill1, this.img_skill1Bg];
                break;
                case 1:
                    temp = [this.lab_skillname2, this.lab_cd2, this.lab_detail2, this.img_skill2, this.img_skill2Bg];
                break;
                default:
                    temp = [this.lab_skillname3, this.lab_cd3, this.lab_detail3, this.img_skill3, this.img_skill3Bg];
                break;
            }
            for(let j:number = 0; j < 5; j++) this._skill[i][j] = temp[j];
        }
    }

    protected childrenCreated(): void{
        let id = modHero.getIdFromKey(GameData.curHero);
        this.showHero(id);
    }

    private topBtnListener(event:egret.TouchEvent):void {
        this._focusBtn = event.currentTarget;
        switch(this._focusBtn) {
            case this.btn_upgrade:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 0);
            break;
            case this.btn_skill:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 1);
            break;
            case this.btn_detail:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 2);
            break;
            case this.btn_battle:
                this._stopTimer();
                Animations.sceneTransition(()=>{
                    GameLayerManager.gameLayer().sceneLayer.removeChildren();
                    GameLayerManager.gameLayer().panelLayer.removeChildren();
                    if (!SceneManager.battleScene) {
                        SceneManager.battleScene = new BattleScene();
                    }else{
                        SceneManager.battleScene.init();
                    }
                    GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.battleScene);
                });
            break;
            case this.btn_change:
                if (modEquip.EquipData.GetInstance().GetEquipNum() == 0) {
                    Animations.showTips("没有可以更换的武器", 1, true);
                    return;
                }
                if (!this.changeEquipPop) {
                    this.changeEquipPop = new ChangeEquipPop();
                }else{
                    this.changeEquipPop.show();
                }
                this.changeEquipPop.addEventListener(modEquip.EquipSource.CHANGEEQUIP, this.updateUI, this);
                this.addChild(this.changeEquipPop);
            break;
            case this.btn_up:
                this.updateAttr(true);
            break;
            default:
                this._stopTimer();
                GameLayerManager.gameLayer().panelLayer.removeChild(this);
            break;
        }
    }

    /**
     * 显示英雄的信息
     */
    public showHero(num:number) {
        let hero_id:number = 0;
        //英雄的id
        hero_id = modHero.getIndextFromId(num);
        //名字
        this.lab_heroName.text = ConfigManager.tcHero[hero_id].name;
        for (let i = 0; i < this._heroArmature.length; i++) {
            if (hero_id == i) {
                this._heroArmature[i].visible = true;
            }else{
                this._heroArmature[i].visible = false;
            }
        }
        //技能
        for (let i = 0; i < ConfigManager.tcHero[hero_id].skill.length; i++) {
            let skillId = ConfigManager.tcHero[hero_id].skill[i];
            for (let j = 0; j < ConfigManager.tcSkill.length; j++) {
                if (ConfigManager.tcSkill[j].id == skillId) {
                    this._skill[i][0].text = ConfigManager.tcSkill[j].name;
                    if (ConfigManager.tcSkill[j].cd == 0) {
                        this._skill[i][1].text = "被动";
                    }
                    else {
                        this._skill[i][1].text = `冷却：${ConfigManager.tcSkill[j].cd}秒`;
                    }
                    this._skill[i][2].text = ConfigManager.tcSkill[j].content;
                    this._skill[i][3].source = `skill_${ConfigManager.tcSkill[j].image_id}_png`;
                    this._skill[i][4].source = `${GameData.curHero}_skillBg_png`;
                    break;
                }
            }
        }
        //武器
        for (let i = 0; i < this.detailGroup.numChildren; i++){
            let obj:any = this.detailGroup.getChildAt(i);
            obj.visible = false;
        }
        this.btn_change.visible = true;
        let data = HeroData.list[GameData.curHero];
        let equipId = data.equip;
        if (equipId != 0){
            let equip = modEquip.EquipData.GetInstance().GetEquipFromId(equipId, 0);
            this.updateEquip(equip);
            this.btn_change.label = "替换";
        }else{
            this.btn_change.label = "装备";
        }

        HeroData.setCurHeroData(GameData.curHero);
    }

    /**
     * 更新武器信息
     */
    public updateEquip(equip:any):void{
        this.starGroup.removeChildren();
        for (let i = 0; i < equip.quality+1; i++) {
            let img_star:egret.Bitmap = Utils.createBitmap("star_00_png");
            img_star.x = 36 * i;
            this.starGroup.addChild(img_star);
        }
        for (let i = 0; i < equip.attrType.length; i++) {
            let imgId = 0;
            for (let j = 0; j < modShop.affixValueRolls.length; j++) {
                let affixInfo = modShop.affixValueRolls[j];
                if (equip.attrType[i].Value >= affixInfo[0] && equip.attrType[i].Value <= affixInfo[1]) {
                    imgId = j + 1;
                    break;
                }
            }
            let img_affix:egret.Bitmap = Utils.createBitmap(`star_0${imgId}_png`);
            img_affix.x = 36 * i;
            this.starGroup.addChild(img_affix);
        }
        this.btn_change.label = "替换";
        this.lab_equipLv.visible = true;
        this.lab_equipLv.text = `等级：${equip.lv}/100`;
        this.img_equip.source = `equip${25-equip.id}_png`;
        this.starGroup.visible = true;
        this.img_equip.visible = true;
    }

    /**
     * 更新界面
     */
    public updateUI(event:egret.Event):void {
        this.changeEquipPop.removeEventListener(modEquip.EquipSource.CHANGEEQUIP, this.updateUI, this);
        let id = event.data;
        let heroData = HeroData.getHeroData(GameData.curHero);
        heroData.equip = id;
        HeroData.update();
        let equip:any;
        // for (let i = 0; i < ConfigManager.tcEquip.length; i++) {
        //     if (ConfigManager.tcEquip[i].id == id) {
        //         equip = ConfigManager.tcEquip[i];
        //         break;
        //     }
        // }
        equip = modEquip.EquipData.GetInstance().GetEquipFromId(id, 0);
        this.updateEquip(equip);
        // this.lab_equipName.text = equip.name;
    }
    /**
     * 显示界面
     */
    public show():void {
        this._startTimer();
    }

    /**更新英雄列表 */
    public updateList():void {
        let group:eui.Group = new eui.Group();
        let count = 0;
        this._heroArmature = [];
        this._armatureGroup.removeChildren();
        for (var key in HeroData.list) {
            let tempGroup:eui.Group = new eui.Group();
            let img_head = Utils.createBitmap(`img_${key}_png`);
            tempGroup.addChild(img_head);
            tempGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onSelete, this);
            tempGroup.x = count * 70;
            tempGroup.name = key;
            count ++;
            group.addChild(tempGroup);
            this._createArmature(key);
        }
        this._scrollHero.viewport = group;
        this._scrollHero.addChild(this._selectBox);
    }

    private _startTimer():void {
        TimerManager.getInstance().startTimer();
        DragonBonesFactory.getInstance().startTimer();
    }

    private _stopTimer():void {
        TimerManager.getInstance().stopTimer();
        DragonBonesFactory.getInstance().stopTimer();
    }

    /**创建骨架 */
    private _createArmature(name:string):void {
        let armature:DragonBonesArmatureContainer = new DragonBonesArmatureContainer();
        this._armatureGroup.addChild(armature);
        armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 10), [
            "idle"
        ]);
        armature.scaleX = 4;
        armature.scaleY = 4;
        if (GameData.curHero != name) {
            armature.visible = false;
        }
        armature.play("idle", 0);
        this._heroArmature.push(armature);
    }

    /**创建英雄头像 */
    private _createHeroIcon():void {
        GameData.curHero = "diaochan";
        this.updateList();
        this._selectBox.x = 0;
    }

    private _onSelete(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        GameData.curHero = target.name;
        this._selectBox.x = target.x;
        this.updateAttr();
        let id = modHero.getIdFromKey(target.name);
        this.showHero(id);
    }

    // public static instance:ReadyDialog;
    private _curAttr:Array<eui.Label>;
    private _lastAttr:Array<eui.Label>;
    /**属性组 */
    private biographyGroup:eui.Group;
    /**武器信息组 */
    private detailGroup:eui.Group;
    /**星级组 */
    private starGroup:eui.Group;
    /**人物骨架组 */
    private _armatureGroup:eui.Group;
    /**替换武器弹窗 */
    private changeEquipPop:ChangeEquipPop;
    /**叠层 */
    private viewStack:eui.ViewStack;
    private _skill:any[] = [];
	/*******************顶部按钮***********************/
	private btn_upgrade:eui.ToggleButton;
	private btn_skill:eui.ToggleButton;
	private btn_detail:eui.ToggleButton;
	private topBtn:eui.ToggleButton[];
	/*************************************************/

    private _focusBtn:eui.ToggleButton;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**出战按钮 */
    private btn_battle:eui.Button;
    /**替换按钮 */
    private btn_change:eui.Button;
    /**人物升级按钮 */
    private btn_up:eui.Button;
    /**武将头像滑动框 */
    private _scrollHero:eui.Scroller;
    /**选中框 */
    private _selectBox:egret.Bitmap;
    /**骨架 */
    private _heroArmature:Array<DragonBonesArmatureContainer>;

	/*******************文字和图片***********************/
    /**名字 */
    private lab_heroName:eui.Label;
    /**技能相关 */
    private lab_skillname1:eui.Label;
    private lab_skillname2:eui.Label;
    private lab_skillname3:eui.Label;
    private lab_cd1:eui.Label;
    private lab_cd2:eui.Label;
    private lab_cd3:eui.Label;
    private lab_detail1:eui.Label;
    private lab_detail2:eui.Label;
    private lab_detail3:eui.Label;
    private img_skill1Bg:eui.Image;
    private img_skill2Bg:eui.Image;
    private img_skill3Bg:eui.Image;
    private img_skill1:eui.Image;
    private img_skill2:eui.Image;
    private img_skill3:eui.Image;
    /**武器属性相关 */
    private lab_life:eui.Label;
    private lab_attack:eui.Label;
    private lab_attSp:eui.Label;
    private lab_armor:eui.Label;
    private lab_speed:eui.Label;
    private lab_equipName:eui.Label;
    private lab_equipLv:eui.Label;
    private img_equip:eui.Image;
	/*************************************************/
}