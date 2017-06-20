/**
 * 更换武器弹窗
 */
class ChangeEquipPop extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/changeEquipSkin.exml";
    }

    protected createChildren(): void{
        this.selectId = 0;
        this.changeId = 0;
        this.img_list = [];
        this.img_selectBox = Utils.createBitmap("iconbg_0002_png");
    }

    protected childrenCreated():void {
        this.show();
    }

    private onComplete():void {
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        
        switch (event.target) {
            case this.btn_change:
                this.parent.removeChild(this);
                if (modEquip.EquipData.GetInstance().GetEquipNum() == 0) return;
                this.changeId = this.selectId;
                this.dispatchEventWith(modEquip.EquipSource.CHANGEEQUIP, false, this.changeId);
            break;
            default:
                this.selectId = this.changeId;
                this.parent.removeChild(this);
            break;
        }
    }

    /**设置弹出的内容显示 */
    public show():void {

       for(let i:number = 0; i < this.img_list.length; i++) this.img_list.pop();
       this.img_list = [];
       this.scrollGroup.removeChildren();

       let col, raw;
        let equipData:modEquip.EquipData = modEquip.EquipData.GetInstance();
        for (let i = 0; i < equipData.GetEquipNum(); i++) {
            this.img_list[i] = new eui.Image();
            this.img_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
            let id = equipData.GetEquipFromIndex(i).Id;
            this.img_list[i]["id"] = id;
            this.img_list[i].source = `Sequip${25-id}_png`;
            raw = Math.floor(i / 7);
            col = i % 7;
            this.img_list[i].x = col * 115;
            this.img_list[i].y = raw * 115;
            this.scrollGroup.addChild(this.img_list[i]);

            if(this.changeId == id){
                Common.SetXY(this.img_selectBox, this.img_list[i].x, this.img_list[i].y);
            }
        }

        this.scrollGroup.addChild(this.img_selectBox);

        if (equipData.GetEquipNum() >= 1) {
            if(this.changeId == 0) this.selectId = this.img_list[0]["id"];
            this.img_selectBox.visible = true;
        }
    }

    /**点击装备 */
    private onEquip(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.selectId = target.id;
        Common.SetXY(this.img_selectBox, target.x, target.y);
    }

    private img_list:Array<eui.Image>;

    private scrollGroup:eui.Group;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**购买按钮 */
    private btn_change:eui.Button;

    /*******************图片和文字************************/
    /**选中框 */
    private img_selectBox:egret.Bitmap;
    /**选中的图片索引 */
    private selectId:number;
    private changeId:number;
}