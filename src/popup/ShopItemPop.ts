/**
 * 购买商品的弹窗
 */
class ShopItemPop extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/shopItemPopSkin.exml";
    }

    protected childrenCreated():void {

    }

    private onComplete():void {
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        Animations.popupIn(this, 300, ()=>{
            GameLayerManager.gameLayer().maskLayer.removeChildren();
        });
        switch (event.currentTarget) {
            case this.btn_buy:
                if (this.content.type == "rmb") {
                    Animations.showTips("无法购买，现金充值尚未开放", 1, true);
                }else {
                    if (Common.userData.soul < this.content.price) {
                        Animations.showTips("您的玉魂不足", 1, true);
                    }else{
                        Common.userData.soul -= this.content.price;
                        Animations.showTips("购买武器成功", 1);
                    }
                }
            break;
            default:
            break;
        }
    }

    /**设置弹出的内容显示 */
    public show(content:any, type:string):void {
        this.content = content;
        this.img_item.source = content.imgItem;
        this.lab_itemName.text = content.name;
        this.lab_detail.text = content.detail;
        this.btn_buy.label = content.price;
        let img_diamond:any = this.btn_buy.getChildAt(1);
        if (type == "diamond") {
            img_diamond.visible = false;
        }else{
            img_diamond.visible = true;
        }
    }

    /**内容 */
    private content:any;
    /*******************按钮********************/
    private btn_buy:eui.Button;
    private btn_back:eui.Button;
    /******************************************/

    /**商品的图片 */
    private img_item:eui.Image;
    /**商品的名字 */
    private lab_itemName:eui.Label;
    /**商品的内容说明 */
    private lab_detail:eui.Label;
}