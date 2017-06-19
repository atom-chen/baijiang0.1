class EquipUpWindow extends Base{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EquipUpSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Show(equip_info:modEquip.EquipInfo):void{

        this.equip_info = equip_info;
        let equip_data = modEquip.TcEquipData.GetInstance().GetEquipInfoFromId(this.equip_info.Id);
        this.img_weapon.source = RES.getRes(`Sequip${25-this.equip_info.Id}_png`)
        this.txt_weapon.text   = equip_data.name;
        let attr:any = this.equip_info.GetEquipAttr();
        this.showUpgradeInfo(attr);

        this.Reset();
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
    }

    public Close():void{

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
        this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, -1);

        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    private onTouchUpGrade(event:egret.TouchEvent):void{

        if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
            Animations.showTips("等级已满", 1, true);
            return;
        }
        
        let attr:any = this.equip_info.GetEquipAttr();
        this.equip_info.Lv = this.equip_info.Lv + 1;
        this.equip_info.SetEquipAttr(attr.attack + 20, attr.defend + 10, attr.blood + 50);
        attr = this.equip_info.GetEquipAttr();
        this.showUpgradeInfo(attr);
        Animations.showTips("升级成功", 1);
        this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, this.equip_info.Lv);
    }

    private showUpgradeInfo(attr:any):void{
        this.txt_front_attr_1.text = "攻击力 " + attr.attack;
        this.txt_front_attr_2.text = "防御力 " + attr.defend;
        this.txt_front_attr_3.text = "生命值 " + attr.blood;
        this.txt_rear_attr_1.text = "攻击力 " + (attr.attack + 20);
        this.txt_rear_attr_2.text = "防御力 " + (attr.defend + 10);
        this.txt_rear_attr_3.text = "生命值 " + (attr.blood + 50);
    }
   
   /**  */
    private img_weapon:eui.Image;
 
    /**  */
    private txt_weapon:eui.Label;
    private txt_front_attr_1:eui.Label;
    private txt_front_attr_2:eui.Label;
    private txt_front_attr_3:eui.Label;
    private txt_rear_attr_1:eui.Label;
    private txt_rear_attr_2:eui.Label;
    private txt_rear_attr_3:eui.Label;
    private txt_exp:eui.Label;
    private txt_sole:eui.Label;

    /** */
    private btn_close:eui.Button;
    private btn_upLevel:eui.Button;

    /**  */
    private equip_info:modEquip.EquipInfo;
}