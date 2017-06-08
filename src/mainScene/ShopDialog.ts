/**
 * 商城
 */
class ShopDialog extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/shopSkin.exml";
        this.tcShop = RES.getRes("TcShop_json");
    }

    protected createChildren(): void{
        this.stack_shop.selectedIndex = 0;
        this.btn_soul.selected = true;
    }

    protected childrenCreated(): void{
        this.createContent(this.scrollDiamond, this.tcShop.diamond, "diamond");
        this.createContent(this.scrollReward, this.tcShop.packs, "packs");
        this.createContent(this.scrollHero, this.tcShop.heros, "heros");
    }

    private onComplete():void {
        // this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        // this.btn_detail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_soul.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_hero.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_closeDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        this.btn_top = [this.btn_soul, this.btn_equip, this.btn_reward, this.btn_hero];
    }

    private onButtonHandler(event:egret.TouchEvent) {
        let target = event.currentTarget;
        switch (target) {
            // case this.btn_buy:
            //     if (Common.userData.soul < 1000) {
            //         Animations.showTips("您的玉魂不足", 1, true);
            //     }else{
            //         Common.userData.soul -= 1000;
            //         Animations.showTips("购买武器成功", 1);
            //         if (Common.userData.equip.length == 0) {
            //             Common.userData.equip = new Array();
            //         }
            //         Common.userData.equip[0] = 2;
            //         this.itemGroup.visible = false;
            //     }
            // break;
            // case this.btn_detail:
            //     this.detailGroup.visible = true;
            // break;
            case this.btn_soul:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 0);
            break;
            case this.btn_equip:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 1);
            break;
            case this.btn_reward:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 2);
            break;
            case this.btn_hero:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 3);
            break;
            case this.btn_closeDetail:
                this.detailGroup.visible = false;
            break;
            default:
                GameLayerManager.gameLayer().panelLayer.removeChildren();
            break;
        }
    }

    /**
     * 创建显示内容
     */
    private createContent(scroller:eui.Scroller, content:Array<any>, type:string):void {
        let group = new eui.Group();
        for (let i = 0; i < content.length; i++) {
            let panel:shopItemIR = new shopItemIR();
            panel.show(content[i], type);
            panel.x = 290 * i;
            group.addChild(panel);
        }
        scroller.viewport = group;
    }


    /**商城的配置文件 */
    private tcShop:any;
    /**金币 */
    private lab_money:eui.Label;
    /**魂石 */
    private lab_soul:eui.Label;

    /*****************顶部按钮*******************/
    private btn_top:eui.ToggleButton[];
    private btn_soul:eui.ToggleButton;
    private btn_equip:eui.ToggleButton;
    private btn_reward:eui.ToggleButton;
    private btn_hero:eui.ToggleButton;
    /*******************************************/

    /*******************叠层********************/
    private stack_shop:eui.ViewStack;
    private groupEquip:eui.Group;
    private scrollDiamond:eui.Scroller;
    private scrollReward:eui.Scroller;
    private scrollHero:eui.Scroller;
    /*******************************************/

    private btn_back:eui.Button;
    private detailGroup:eui.Group;
    private btn_closeDetail:eui.Group;
}