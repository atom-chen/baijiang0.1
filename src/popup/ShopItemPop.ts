/**
 * 购买商品的弹窗
 */
class ShopItemPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/shopItemPopSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

    }

     /**设置弹出的内容显示 */
    public Show(content:any, type:string):void {
        super.Show();

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

    public Reset():void{
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close():void{

        Animations.PopupBackIn(this, 350, ()=>{
            super.Close();
        })

        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        let selectType = -1;

        if(event.target == this.btn_buy){
            if (this.btn_buy.name == "packs") {
                if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 500)){
                    Animations.showTips("购买礼包成功", 1);
                    let info = new modEquip.EquipInfo(20, 0, 5);
                    modEquip.EquipData.GetInstance().Add(info);
                    UserDataInfo.GetInstance().SetBasicData("soul", UserDataInfo.GetInstance().GetBasicData("soul") + 1000);
                    UserDataInfo.GetInstance().SetBasicData("exp", UserDataInfo.GetInstance().GetBasicData("exp") + 20000);
                    UserDataInfo.GetInstance().SetBasicData("diamond", UserDataInfo.GetInstance().GetBasicData("diamond") + 50);
                } 
                else Animations.showTips("钻石不足，无法购买", 1,true);
            }
            else
            {
                if (HeroData.hasHero(this.content.key)){
                    Animations.showTips(`已有英雄${this.lab_itemName.text}`, 1);
                }
                else
                {
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
            selectType = 1;
        }

        GameLayerManager.gameLayer().dispatchEventWith(UserData.PURCHASEDATA, false, selectType);
        this.Close();
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