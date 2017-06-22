class EquipUpWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EquipUpSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.group_list = [];
        this.txt_front_title = [];
        this.txt_front_list = [];
        this.txt_rear_title = [];
        this.txt_rear_list = [];
        this.imgStar_list = [];
        let txt_list = ["生命", "攻击", "护甲", "暴击", "闪避"];
        for(let i:number = 0; i < 5; i++){
            this.group_list[i] = new eui.Group();
            this.addChild(this.group_list[i]);
            Common.SetXY(this.group_list[i], this.curr_lv.x + 10, this.curr_lv.y + this.curr_lv.height + 18 + i * (35));

            this.txt_front_title[i] = this.createLabel(txt_list[i]);
            this.group_list[i].addChild(this.txt_front_title[i]);

            this.txt_front_list[i] = this.createLabel("400");
            this.group_list[i].addChild(this.txt_front_list[i]);
            this.txt_front_list[i].width = 170;
            this.txt_front_list[i].textAlign = "right";
            Common.SetXY(this.txt_front_list[i], this.txt_front_title[i].x + this.txt_front_title[i].width, 0);

            this.txt_rear_title[i] = this.createLabel(txt_list[i]);
            this.group_list[i].addChild(this.txt_rear_title[i]);
            Common.SetXY(this.txt_rear_title[i], this.txt_front_list[i].x + this.txt_front_list[i].width + 55, 0);

            this.txt_rear_list[i] = this.createLabel("400");
            this.group_list[i].addChild(this.txt_rear_list[i]);
            this.txt_rear_list[i].width = 170;
            this.txt_rear_list[i].textAlign = "right";
            Common.SetXY(this.txt_rear_list[i], this.txt_rear_title[i].x + this.txt_rear_title[i].width, 0);
        }

        this.starGroup = new eui.Group();
        this.addChild(this.starGroup);

        for(let i:number = 0; i < 6; i++) this.imgStar_list[i] = new egret.Bitmap();
    }

    private hide_attr_info(index:number, isVisible:boolean):void{
        for(let i:number = index; i < 5; i++){
            this.group_list[i].visible = isVisible;
        }
    }

    public Show(equip_info:modEquip.EquipInfo):void{
        super.Show();

        this.hide_attr_info(0, true);
        this.equip_info = equip_info;
        let equip_data = modEquip.TcEquipData.GetInstance().GetEquipInfoFromId(this.equip_info.Id);
        this.img_weapon.source = RES.getRes(`Sequip${25-this.equip_info.Id}_png`)
        this.txt_weapon.text   = equip_data.name;
        this.hide_attr_info(this.equip_info.Quality + 1, false);

        let attr:any = this.equip_info.GetEquipAttr();
        this.showUpgradeInfo(attr);
        this.showStar();
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
    }

    public Close():void{
        super.Close();

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
        this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, -1);
    }

    private onTouchUpGrade(event:egret.TouchEvent):void{

        if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
            Animations.showTips("等级已满", 1, true);
            return;
        }
        
        let attr:any = this.equip_info.GetEquipAttr();
        this.equip_info.Lv = this.equip_info.Lv + 1;
        for(let i:number = 0; i < attr.length; i++) attr[i] += 50;
        this.equip_info.SetEquipAttr(attr);
        this.showUpgradeInfo(attr);
        Animations.showTips("升级成功", 1);
        this.curr_lv.text = "Lv." + this.equip_info.Lv;
        this.next_lv.text = "Lv." + (this.equip_info.Lv + 1);
        this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, this.equip_info.Lv);
    }

    private showUpgradeInfo(attr:any):void{
        let quality:number = this.equip_info.Quality + 1;
        let num = quality >= 5 ? 5 : quality;
        for(let i:number = 0; i < num; i++){
            this.txt_front_list[i].text = attr[i];
            this.txt_rear_list[i].text = attr[i] + 50;
        }
    }

    private createLabel(name:string):eui.Label{
        let txt:eui.Label = new eui.Label;
        txt.fontFamily = "Microsoft YaHei";
        txt.size = 24;
        txt.bold = true;
        txt.textColor = 0x858685;
        txt.text = name;
        return txt;
    }

    private showStar():void{
        this.starGroup.removeChildren();
        let value:number;

        for(let i:number = 0; i < this.equip_info.Quality + 1; i++){
            if(this.equip_info.GetAttrType().length > i){
                value = this.equip_info.GetAttrType()[i].Value;
            }
            else value = 0;
            this.imgStar_list[i].texture = RES.getRes(modEquip.GetEquipLvFromValue(value).img);
            this.starGroup.addChild(this.imgStar_list[i]);
            Common.SetXY(this.imgStar_list[i], i * 32, 0);
        }
        this.starGroup.width = this.equip_info.Quality * 32;
        Common.SetXY(this.starGroup, this.img_weapon.x + (this.img_weapon.width - this.starGroup.width) / 2 - 20, this.img_weapon.y - 45);
    }
   
   /**  */
    private img_weapon:eui.Image;
 
    /**  */
    private txt_weapon:eui.Label;
    private txt_exp:eui.Label;
    private txt_sole:eui.Label;
    private curr_lv:eui.Label;
    private next_lv:eui.Label;
    private txt_front_list:Array<eui.Label>;
    private txt_rear_list:Array<eui.Label>;
    private txt_front_title:Array<eui.Label>;
    private txt_rear_title:Array<eui.Label>;
    private group_list:Array<eui.Group>;
    private imgStar_list:Array<egret.Bitmap>;
    private starGroup:eui.Group;

    /** */
    private btn_close:eui.Button;
    private btn_upLevel:eui.Button;

    /**  */
    private equip_info:modEquip.EquipInfo;
}