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
        this.selectIndex = 0;
        this.createEquip();
    }

    protected childrenCreated():void {
        this.show();
    }

    private onComplete():void {
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    private createEquip():void {
        for (let i = 1; i <= 24; i++) {
            let equipGroup:eui.Group = new eui.Group();
            this.equipGroup.push(equipGroup)
            this.scrollGroup.addChild(equipGroup);
            let bg1:eui.Image = new eui.Image();
            bg1.source = "iconbg_0001_png";
            equipGroup.addChild(bg1);
            equipGroup.x = 115*((i-1)%7);
            equipGroup.y = 115*(Math.ceil(i/7)-1);
        }
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_change:
                this.parent.removeChild(this);
                if (Common.userData.equip.length == 0) return;
                let id = Common.userData.equip[this.selectIndex]["id"];
                Common.curPanel.updateUI(id);
            break;
            default:
                this.parent.removeChild(this);
            break;
        }
    }

    /**设置弹出的内容显示 */
    public show():void {
        let equipData:modEquip.EquipData = modEquip.EquipData.GetInstance();
        for (let i = 0; i < equipData.GetEquipNum(); i++) {
            let equipImage:eui.Image = new eui.Image();
            equipImage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
            let id = equipData.GetEquipFromIndex(i).Id;
            equipImage["id"] = i;
            equipImage.source = `Sequip${25-id}_png`;
            equipImage.x = 0;
            equipImage.y = 0;
            this.equipGroup[i]["image"] = equipImage;
            this.equipGroup[i].addChild(equipImage);
        }
        if (!this.img_selectBox) {
            this.img_selectBox = Utils.createBitmap("iconbg_0002_png");
            this.img_selectBox.visible = false;
        }
        if (equipData.GetEquipNum() >= 1) {
            this.img_selectBox.visible = true;
            this.equipGroup[this.selectIndex].addChild(this.img_selectBox);
        }
    }

    /**点击装备 */
    private onEquip(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.selectIndex = target.id;
        this.img_selectBox.visible = true;
        this.equipGroup[this.selectIndex].addChild(this.img_selectBox);
    }


    private equipGroup:eui.Group[] = [];
    private scrollGroup:eui.Group;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**购买按钮 */
    private btn_change:eui.Button;

    /*******************图片和文字************************/
    /**选中框 */
    private img_selectBox:egret.Bitmap;
    /**选中的图片索引 */
    private selectIndex:number;
}