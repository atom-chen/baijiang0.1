class EquipUpStarWindow extends Base{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EquipUpStarSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.init();
    }

    private init():void{
        this.equip_list = [];
        this.icon_list =  [];
        this.click_list = [];
        this.source_list = [this.img_source1, this.img_source2, this.img_source3];;

        for(let i:number = 0; i < 3; i++){
            this.icon_list[i] = new egret.Bitmap(RES.getRes("equip_0009_png"));
            this.scrollGroup.addChild(this.icon_list[i]);
        }
        this.lab_lucky.textFlow = <Array<egret.ITextElement>>[{text:"当前幸运值: "}, {text:"90%", style:{"size":45}}];
        this.initData();
    }

    private initData():void{

        for(let i:number = 0; i < 3; i++){
            this.changeObjectStatus(this.source_list[i], "-1", "");
            this.icon_list[i].visible = false;
            this.click_list[i] = 0;
        }

        this.lab_sole.text = "";
    }

    public Show(equip_info:modEquip.EquipInfo):void{
        this.equip_info = equip_info;
        this.initData();
        this.showGoodsView();
        this.Reset();
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upStar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpStar, this);
        for(let i = 0; i < 3; i++){
            this.source_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSource, this);
        }
    }

    public Close(isUpStar:boolean = false):void{
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upStar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpStar, this);

        for(let i = 0; i < 3; i++){
            this.source_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSource, this);
        }

        for(let i:number = 0; i < this.equip_list.length; i++){
            this.equip_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
        }

        this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, isUpStar);

        if(this.parent){
            this.parent.removeChild(this);
        }
    }

    private onTouchUpStar(event:egret.TouchEvent):void{
        if(!this.isEnough()){
            Animations.showTips("装备不足，无法升星", 1, true);
            return;
        }

        for(let i:number = 0; i < this.equip_list.length; i++){
            this.equip_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
        }

        for(let i:number = 0; i < this.click_list.length; i++){
            if(this.click_list[i] != 0) modEquip.EquipData.GetInstance().RemovePointEquip(this.id_list[parseInt(this.source_list[i].name)]);
        }

        let rand = Math.floor(((Math.random() % 100) * 100))
        let type = rand % 3 == 0 ? 3 : rand % 3; 
        let attrType:modEquip.AttrType = new modEquip.AttrType(type, rand % 100);
        this.equip_info.InsertAttrType(attrType);
        this.equip_info.Lv = 0;
        this.equip_info.Star++;
        Animations.showTips("升星成功", 1);

        this.Close(true);
    }

    private onTouchSource(event:egret.TouchEvent):void{
        let target = event.target;
        let index = 0;

        switch(target){
            case this.img_source1:
                index = 0;
                break;
            case this.img_source2:
                index = 1;
                break;
            case this.img_source3:
                index = 2;
                break;
        }

        this.click_list[index] = 0;
        this.icon_list[index].visible = false;
        this.changeObjectStatus(target, "-1", "");
        this.lab_sole.text = "";
    }

    /** 显示当前拥有的装备 */
    private showGoodsView():void{
        let img:eui.Image;
        for(let i:number = 0; i < this.equip_list.length; i++) this.equip_list.pop();

        this.scrollGroup.removeChildren();
        this.id_list = [];

        let index:number = 0;
        let raw:number, col:number;
        let list:any = modEquip.EquipData.GetInstance().GetEquipList();
        for(let i:number = 0; i < list.length; i++){
            if(list[i].Id != this.equip_info.Id){
                raw = Math.floor(index / 4);
                col = index % 4;
                let img:eui.Image = new eui.Image();
                img.source = `Sequip${25-list[i].Id}_png`;
                this.scrollGroup.addChild(img); 
                this.equip_list.push(img);
                Common.SetXY(img, 4 + 104*col, 4 + 104*raw);
                img.name = index + "";
                index++;
                this.id_list.push(list[i].Id)
                img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
            }
        }

        for(let i:number = 0; i < 3; i++){
            this.scrollGroup.addChild(this.icon_list[i]);
        }
    }

    private onTouchEquip(event:egret.TouchEvent):void{
        let target = event.target;

        if(target.name == this.img_source1.name || target.name == this.img_source2.name || target.name == this.img_source3.name) return;

        let index = this.getEmptyIndex();
        if(index == -1){
            return;
        }

        this.icon_list[index].visible = true;
        Common.SetXY(this.icon_list[index], target.x, target.y);
        switch(index)
        {
            case 0:
                this.changeObjectStatus(this.img_source1, target.name, target.source);
                break;
            case 1:
                this.changeObjectStatus(this.img_source2, target.name, target.source);
                break;
            case 2:
                this.changeObjectStatus(this.img_source3, target.name, target.source);
                break;
        }

        if(this.isEnough()) this.lab_sole.text = "10000";
    }

     private getEmptyIndex():number{
        let temp:number = -1;
        for(let i:number = 0; i < 3; i++){
            if(this.click_list[i] == 0) 
            {
                this.click_list[i] = 1;
                temp = i;
                break;
            }
        }
        return temp;
    }

    private isEnough():boolean{
        for(let i:number = 0; i < 3; i++){
            if(this.click_list[i] == 0) return false;
        }
        return true;
    }

    private changeObjectStatus(obj:any, name:string, source:string):void{
        if(obj == null) return;
        obj.source = source;
        obj.name   = name;
    }


    private img_source1:eui.Image;
    private img_source2:eui.Image;
    private img_source3:eui.Image;
    private lab_lucky:eui.Label;
    private lab_sole:eui.Label;

    private btn_close:eui.Button;
    private btn_upStar:eui.Button;

    private scrollGroup:eui.Scroller;
    private equip_list:Array<eui.Image>;
    private icon_list:Array<egret.Bitmap>;
    private click_list:Array<number>;
    private id_list:Array<number>;
    private source_list:any;
    
    private equip_info:modEquip.EquipInfo;
}