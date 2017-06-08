/**
 * 商店购买内容
 */
class shopItemIR extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/shopItemIRSkin.exml";
    }

    protected createChildren(): void{
    }

    private onComplete():void {
        this.btn_itemDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
    }

    /**
     * 按钮监听
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        switch (target) {
            case this.btn_itemDetail:
            break;
            case this.btn_buy:
            break;
            default:
            break;
        }
    }

    /**
     * 显示
     */
    public show(content:any, type:string):void {
        this.lab_name.text = content.name;
        this.img_item.source = content.imgItem;
        this.lab_count.text = content.count;
        this.btn_buy.label = content.price;
        if (type == "diamond") {
            this.img_btnBuy = this.btn_buy.getChildAt(0);
            this.img_btnBuy.source = "btn_shopBuy_png";
            this.btn_itemDetail.visible = false;
        }else{
            
        }
    }

    /**标题 */
    private lab_name:eui.Label;
    /**图片 */
    private img_item:eui.Image;
    /**数量 */
    private lab_count:eui.Label;
    /**详情按钮 */
    private btn_itemDetail:eui.Button;
    /**购买的获得物品图片 */
    private img_soul01:eui.Image;
    /**购买按钮 */
    private btn_buy:eui.Button;
    /**购买按钮的图标 */
    private img_btnBuy:any; 
}