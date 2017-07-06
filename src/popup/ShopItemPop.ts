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
                if (this.btn_buy.name == "packs") {
                    if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 500)) Animations.showTips("购买礼包成功", 1);
                    else Animations.showTips("钻石不足，无法购买", 1,true);
                }else{
                    if (HeroData.hasHero(this.content.key)){
                        Animations.showTips(`已有英雄${this.lab_itemName.text}`, 1);
                    }else{
                        if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 1280)){
                            Animations.showTips(`购买英雄${this.lab_itemName.text}成功`, 1);
                            HeroData.addHeroData(this.content.key, GameData.initData["hero"]);
                            if (WindowManager.GetInstance().getObjFromStr("ReadyDialog")) {
                                WindowManager.GetInstance().getObjFromStr("ReadyDialog").updateList();
                            }
                        }
                        else Animations.showTips("钻石不足，无法购买", 1);
                    }
                    
                }
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
        this.btn_buy.name = type;
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