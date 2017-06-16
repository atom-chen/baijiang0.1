class ResetEqiopAttrWindow extends Base{

    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/ResetEquipAttrSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Show(equipInfo:modEquip.EquipInfo, index:number):void{
        this._index = index;
        this.equip_info = equipInfo;
        let attrType = this.equip_info.GetPointTypeFromIndex(index);
        this.changeAttrInfo(attrType.Type, attrType.Value);
        this.lab_money.textFlow = <Array<egret.ITextElement>>[{text:"花费"}, {text:"10000钻石", style:{"textColor":0x06d5d6}},{text:"重置"}];
        this.reset();
    }

    private reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
    }

    public Close():void{
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
        this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, -1);
        
        if(this.parent) this.parent.removeChild(this);
    }

    private onTouchReset(event:egret.TouchEvent):void{

        let rand = Math.floor((Math.random() % 100 * 100));
        let type = rand % 3 == 0 ? 3:rand % 3;
        this.equip_info.ChangeAttrType(this._index, type, rand % 100);
        this.lab_attr.text = modEquip.GetAttrInfo(type, rand % 100);
        this.changeAttrInfo(type, rand % 100);
        this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, {type:type,value:rand % 100,index:this._index})
    }

    private changeAttrInfo(type:number, value:number){
        this.lab_attr.text = modEquip.GetAttrInfo(type, value);
        let data = modEquip.GetEquipLvFromValue(value);
        this.lab_attr.textColor = data.color;
        this.imgStar.source = data.img;
    }

    private imgStar:eui.Image;

    private lab_attr:eui.Label;
    private lab_money:eui.Label;

    private btn_reset:eui.Button;
    private btn_close:eui.Image;

    private equip_info:modEquip.EquipInfo;
    private _index:number;
}