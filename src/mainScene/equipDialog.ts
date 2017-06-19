/**
 * 武器库
 */
class EquipDialog extends Base {
    public constructor() {
        super();
        this.weapon_list = [];
        this.star_list   = [];
        this.goods_index = 0;
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/equipWindowSkin.exml";
    }

    private onComplete():void {
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchClose, this);
        this.btn_weapon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchWeapon, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChange, this);
        this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseReset, this);
        this.createEquip()
        this.init();
    }

    /** 初始化数据 */
    private init():void{
        this.resetGroup = new eui.Group();
        this.scrollGroup.addChild(this.resetGroup);
        this.reset_list = [];
        this.reset_btn_list = [];
        this.img_star_list = [];
        this.txt_attr_list = [];
        for(let i:number = 0; i < 6; i++){
            this.reset_list[i] = new eui.Group();
            this.resetGroup.addChild(this.reset_list[i]);
            Common.SetXY(this.reset_list[i], 0, 105 * i)

            this.reset_btn_list[i] = new eui.Image();
            this.img_star_list[i] = new egret.Bitmap();
            this.txt_attr_list[i] = new egret.TextField();
        }
    }

    /**
     * 创建武器组
     */
    private createEquip():void {

        this.equipGroup = new eui.Group();
        this.scrollGroup.addChild(this.equipGroup);

        let equip_data = [24, 5, 7, 9, 11, 22, 3, 4, 6, 18];
        for (let i = 0; i < equip_data.length; i++) {
            let equipInfo:modEquip.EquipInfo = new modEquip.EquipInfo();
            equipInfo.Id = equip_data[i];
            equipInfo.Star = Math.ceil(equip_data[i] / 4);
            this.insertAttrType(equipInfo);
            modEquip.EquipData.GetInstance().Add(equipInfo);
        }

        for(let i:number = 0; i < 6; i++){
            this.star_list[i] = new egret.Bitmap(RES.getRes("star_00_png"));
            this.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], i * 32 + 20, this.btn_back.y + this.btn_back.height + 30)
        }

        this.imgClick = new egret.Bitmap( RES.getRes("equip_0009_png"));
        this.btn_weapon.currentState = "down";

        this.CreateGoods();

        let len = modEquip.EquipData.GetInstance().GetEquipNum();
        if(len > 0) this.ShowGoodsInfo(0);
        else this.imgClick.visible = false;
    }

    /** 点击升级按钮 */    
    private onTouchUpGrade(event:egret.TouchEvent):void{
        if(this.equip_up_window == null){
            this.equip_up_window = new EquipUpWindow();
        }

        this.equip_up_window.addEventListener(modEquip.EquipSource.UPGRADE, this.upGradeGoodsInfo, this);
        this.equip_up_window.Show(this.equip_info);
        this.addChild(this.equip_up_window);
    }

    /** 升级按钮的事件监听 */
    private upGradeGoodsInfo(event:egret.Event):void{
        if(event.data == -1){
            event.target.removeEventListener(modEquip.EquipSource.UPGRADE, this.upGradeGoodsInfo, this);
        }
        else
        {
            this.lab_lv.textFlow = <Array<egret.ITextElement>>[
                {text:"等级: " + event.data + "/", style:{"textColor":0x877575}},
                {text:"100", style:{"textColor":0xf28b01}}
            ]
        }
    }

    /** 点击物品 */
    private onTouchGoods(event:egret.TouchEvent):void{
        let target = event.target;
        let id = parseInt(target.name);
        if(this.goods_index == id) return;

        Common.SetXY(this.imgClick, target.x, target.y);
        this.goods_index = id;
        this.ShowGoodsInfo(id);
    }

    /** 关闭洗练 */
    private onCloseReset(event:egret.TouchEvent):void{
        this.setGroupStatus(true, false, "兵器库", "down", "null");
    }

    /** 点击兵器库 */
    private onTouchWeapon(event:egret.TouchEvent):void{
        if(this.btn_weapon.currentState == "down") return;
        this.setGroupStatus(true, false, "兵器库", "down", "null");
    }

    /** 点击关闭洗练 */
    private onTouchChange(event:egret.TouchEvent):void{
        if(this.btn_change.currentState == "down") return;
        this.setGroupStatus(false, true, "洗练", "null", "down");
        this.showResetGroup();
    }

    private onEquip(event:egret.TouchEvent):void {
        let name = event.currentTarget.name;
        Common.log(name+typeof(name));
        if (!this.equipInfo) {
            this.equipInfo = new EquipInfoDialog(parseInt(name));
        }else{
            this.equipInfo.createEquip(parseInt(name))
        }
        this.addChild(this.equipInfo);
    }

    private onTouchClose():void{
        this.setGroupStatus(true, false, "兵器库", "down", "null");
        GameLayerManager.gameLayer().panelLayer.removeChildren();
    }

    /** 创建物品信息 */
    public CreateGoods():void{

        //移除所有的对象
        for(let i:number = 0; i < this.weapon_list.length; i++) this.weapon_list.pop();
        this.equipGroup.removeChildren();

        //获得当前拥有的物品
        let raw, col;
        let equip_list = modEquip.EquipData.GetInstance().GetEquipList();
        for (let i = 0; i < equip_list.length; i++) {
            raw = Math.floor(i / 6);
            col = i % 6;
            let img:eui.Image = new eui.Image();
            img.source = `Sequip${25-equip_list[i].Id}_png`;
            this.equipGroup.addChild(img); 
            img.name = i + "";
            this.weapon_list.push(img);
            img.x = 100*col;
            img.y = 100*raw;
            img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGoods, this);

            //判断当前选择的物品再哪里 因为是重新创建所以要做一个判断
             if(this.equip_info){
                if(this.equip_info.Id == equip_list[i].Id){
                    Common.SetXY(this.imgClick, img.x, img.y);
                }
            }
        }
        this.equipGroup.addChild(this.imgClick);
    }

    /** 显示物品信息 */
    public ShowGoodsInfo(index:number){
        this.equip_info = modEquip.EquipData.GetInstance().GetEquipFromIndex(index);
        let equip_data = modEquip.TcEquipData.GetInstance().GetEquipInfoFromId(this.equip_info.Id);
        this.lab_name.text = equip_data.name;
        this.img_weapon.source = RES.getRes(`equip${25-this.equip_info.Id}_png`);
        this.lab_lv.textFlow = <Array<egret.ITextElement>>[
            {text:"等级: " + this.equip_info.Lv + "/", style:{"textColor":0x877575}},
            {text:"100", style:{"textColor":0xf28b01}}
        ]

        this.showEquipStar(this.equip_info.Star);
    }

    /** 显示装备星级 */
    private showEquipStar(star:number):void{
        for(let i:number = 0; i < 6; i++){
            if(star > i){
                let data = modEquip.GetEquipLvFromValue(this.equip_info.GetPointTypeFromIndex(i).Value)
                this.star_list[i].texture = RES.getRes(data.img);
            }
            else 
            {
                this.star_list[i].texture = RES.getRes("star_00_png");
            }
        }
    }

    /** 插入属性类型和值 */
    private insertAttrType(equipInfo:modEquip.EquipInfo):void{
        for(let i:number = 1; i <= equipInfo.Star; i++){
            let type = i % 3 == 0 ? 3: i % 3;
            let attrType:modEquip.AttrType = new modEquip.AttrType(type, Math.floor(100 / i));
            equipInfo.InsertAttrType(attrType);
        }
    }

    /** 创建洗练界面 */
    private createResetView(group:eui.Group, index:number, isActive:boolean):void{
        let strType:string, strImg:string;
        let value:number = 0;

        if(isActive){
            let attrType:modEquip.AttrType = this.equip_info.GetPointTypeFromIndex(index);
            strType = modEquip.GetAttrInfo(attrType.Type, attrType.Value);
            strImg = "button_0016_png";
            value = attrType.Value;
        }
        else
        {
            strType = "可升星";
            strImg = "button_0017_png";
        }

        let imgBg:egret.Bitmap = new egret.Bitmap(RES.getRes("equip_0005_png"));
        group.addChild(imgBg);

        let data = modEquip.GetEquipLvFromValue(value);
        this.img_star_list[index].texture = RES.getRes(data.img);
        Common.SetXY(this.img_star_list[index], this.img_star_list[index].width, imgBg.height - this.img_star_list[index].height >> 1);
        group.addChild(this.img_star_list[index]);

        group.addChild(this.txt_attr_list[index]);
        this.txt_attr_list[index].text = strType;
        this.txt_attr_list[index].textColor = data.color;
        Common.SetXY(this.txt_attr_list[index], imgBg.width - this.txt_attr_list[index].width >> 1, imgBg.height - this.txt_attr_list[index].height >> 1);

        this.reset_btn_list[index].source = strImg;
        this.reset_btn_list[index].name = index + "";
        group.addChild(this.reset_btn_list[index]);
        Common.SetXY(this.reset_btn_list[index], imgBg.width - this.reset_btn_list[index].width - 20, imgBg.height - this.reset_btn_list[index].height >> 1);
        this.reset_btn_list[index].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickResetBtn, this);
    }

    private onClickResetBtn(event:egret.TouchEvent):void{
        let target = event.target;
        let index:number = parseInt(target.name);
        
        if(this.equip_info.Star > index){

            if(this.reset_equip_attr == null){
                this.reset_equip_attr = new ResetEqiopAttrWindow();
            }
            let attrType = this.equip_info.GetPointTypeFromIndex(index);
            let attrData = modEquip.GetEquipLvFromValue(attrType.Value);
            this.reset_equip_attr.Show(this.equip_info, index);
            this.addChild(this.reset_equip_attr);
            this.reset_equip_attr.addEventListener(modEquip.EquipSource.RESETATTR, this.onResetEquipAttr, this);
        }
        else
        {
            if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
                if(this.equip_up_star == null){
                    this.equip_up_star = new EquipUpStarWindow();
                }
                this.equip_up_star.Show(this.equip_info);
                this.addChild(this.equip_up_star);
                this.equip_up_star.addEventListener(modEquip.EquipSource.UPSTAR, this.onUpStar, this);
            }
            else
            {
                Animations.showTips("等级不足，无法升星", 1, true);
            }
        }
    }

    private onUpStar(event:egret.Event):void{
        this.equip_up_star.removeEventListener(modEquip.EquipSource.UPSTAR, this.onUpStar, this);
        if(event.data == true){
            this.CreateGoods();
            let starIndex = this.equip_info.Star - 1;
            this.lab_lv.textFlow = <Array<egret.ITextElement>>[{text:"等级: 0/", style:{"textColor":0x877575}},{text:"100", style:{"textColor":0xf28b01}}]
            this.star_list[starIndex].texture = RES.getRes(modEquip.GetEquipLvFromValue(this.equip_info.GetPointTypeFromIndex(starIndex).Value).img);
            this.showResetGroup();
        }
    }

    private onResetEquipAttr(event:egret.Event):void{
        if(event.data == -1){
            this.reset_equip_attr.removeEventListener(modEquip.EquipSource.RESETATTR, this.onResetEquipAttr, this);
            return;
        }

        let index = event.data.index;
        let data = modEquip.GetEquipLvFromValue(event.data.value);

        this.txt_attr_list[index].text = modEquip.GetAttrInfo(event.data.type, event.data.value);
        this.txt_attr_list[index].textColor = data.color;
        this.img_star_list[index].texture = RES.getRes(data.img);
        this.star_list[index].texture = RES.getRes(data.img)
    }

    /** 显示洗练的租 */
    private showResetGroup():void{
        let star = this.equip_info.Star == 6 ? 6 : this.equip_info.Star + 1
        for(let i:number = 0; i < 6; i++) this.reset_list[i].removeChildren();

        for(let i:number = 0; i < star; i++){
            if(this.equip_info.Star > i){
                this.createResetView(this.reset_list[i], i, true);
            }
            else
            {
                this.createResetView(this.reset_list[i], i, false);
            }
        }
    }

    /** 设置租的状态 */
    private setGroupStatus(isShowWeapon:boolean, isShowReset:boolean, title:string, weaponStatus:string, resetStatus:string):void{
        this.equipGroup.visible = isShowWeapon;
        this.resetGroup.visible = isShowReset;
        this.btn_close.visible  = isShowReset;
        this.lab_title.text     = title;
        this.btn_weapon.currentState = weaponStatus;
        this.btn_change.currentState = resetStatus;
        this.scrollGroup.scrollV = 0;
    }

    private equipInfo:EquipInfoDialog;
    private scrollGroup:eui.Group;
    private equipGroup:eui.Group;
    private resetGroup:eui.Group;
    private goods_index:number;

    /** 按钮 */
    private btn_weapon:eui.Button;
    private btn_back:eui.Button;
    private btn_change:eui.Button;
    private btn_upgrade:eui.Button;
    private btn_close:eui.Button;

    /** 装备 */
    private imgClick:egret.Bitmap;
    private img_weapon:eui.Image;
    private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_title:eui.Label;

    /** 列表数据 */
    private weapon_list:Array<eui.Image>;
    private star_list:Array<egret.Bitmap>;
    private reset_btn_list:Array<eui.Image>;
    private img_star_list:Array<egret.Bitmap>;
    private txt_attr_list:Array<egret.TextField>;
    private reset_list:Array<eui.Group>;

    /** lei */
    private equip_up_window:EquipUpWindow;
    private equip_info:modEquip.EquipInfo;
    private equip_up_star:EquipUpStarWindow;
    private reset_equip_attr:ResetEqiopAttrWindow;

}