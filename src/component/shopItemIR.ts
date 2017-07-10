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
                if(this.btn_buy.name == "diamond"){
                    Animations.showTips("无法购买，现金充值尚未开放", 1, true);
                }
                else
                {
                    let pop = WindowManager.GetInstance().GetWindow("ShopItemPop");
                    pop.Show(this.content, this.btn_buy.name);
                    Animations.PopupBackOut(pop, 500);
                }
            break;
            default:
            break;
        }
    }

    /**
     * 显示
     */
    public show(content:any, type:string):void {
        this.content = content;
        this.lab_name.text = content.name;
        this.img_item.source = content.imgItem;
        this.lab_count.text = content.count;
        this.btn_buy.name = type;
        
        if(type == "diamond") this.set_label_Text("",content.price, false);
        else this.set_label_Text(content.price,"", true);
    }

    private set_label_Text(strBtn:string, strMoney:string, isVisible:boolean):void{
        this.btn_buy.label = strBtn;
        this.lab_money.text = strMoney;
        this.img_diamond.visible = isVisible;
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
    /**内容 */
    private content:any;
    private img_diamond:eui.Image;
    private lab_money:eui.Label;

}