/**
 * 公用动画
 */
namespace Animations {
    //抖动对象特效
    // 1：抖动  2：震动
    export function shakeScreen(target:any, effectType: number = 1): void {
        var panel = target;
        var shakeNum = 20;
        var oldX: number = panel.x;
        var oldY: number = panel.y;
        if (effectType == 1) {
            egret.Tween.get(panel).to({ x: panel.x - 10 }, shakeNum);

            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x - 20 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX }, shakeNum);
            }, this, shakeNum * 5);
        } else {
            egret.Tween.get(panel).to({ x: panel.x - 2, y: panel.y }, shakeNum);

            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 5, y: panel.y }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 3 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y - 5 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 2 }, shakeNum);
            }, this, shakeNum * 5);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX, y: oldY }, shakeNum);
            }, this, shakeNum * 6);
        }
    }

    //淡出淡入
    export function fadeOutIn(target:any):void {
        egret.Tween.get(target).to({ alpha: 1.0 }, 200);
        egret.setTimeout(function () {
                egret.Tween.get(target).to({ alpha: 0 }, 200);
            }, this, 1000);
    }
    //淡出
    export function fadeOut(target:any, time:number = 500, func:Function = null, completeFunc:Function = null):void {
        target.alpha = 0;
        egret.Tween.get(target).to({ alpha: 1.0 }, time, egret.Ease.circOut).call(()=>{
            if (completeFunc) {
                completeFunc();
            }
        });
        if (func) {
            func();
        }
    }
    /**淡入 */
    export function fadeIn(target:any, time:number = 500, func:Function = null):void {
        target.alpha = 1.0;
        egret.Tween.get(target).to({ alpha: 0 }, time, egret.Ease.circIn).call(()=>{
            if (func) {
                func();
            }
        });
    }

    /**放大后缩小 */
    export function zoomIn(target:any):void {
        egret.Tween.get(target).to({scaleX:6, scaleY:6}, 100, egret.Ease.circOut).call(()=>{
            egret.Tween.get(target).to({scaleX:3, scaleY:3}, 100, egret.Ease.circIn);
        })
    }

    /**
    * str             提示内容
    * effectType      动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失 5：从大变小 等等
    * isWarning       是否是警告，警告是红色
    */
    export function showTips(str: string = "", effectType: number = 1, isWarning: boolean = false): void {
        switch (effectType) {
            case 1:
                TipsUtils.showTipsDownToUp(str, isWarning);
                break;
            case 2:
                TipsUtils.showTipsLeftOrRight(str, isWarning, true);
                break;
            case 3:
                TipsUtils.showTipsLeftOrRight(str, isWarning, false);
                break;
            case 4:
                TipsUtils.showTipsFromCenter(str, isWarning);
                break;
            case 5:
                TipsUtils.showTipsBigToSmall(str, isWarning);
                break;
            default:
            // TODO: Implemente default case
        }

    }

    /**幕布 */
    var curtainImage:egret.Bitmap;
    /**
     * 场景幕布过度动画
     */
    export function sceneTransition(func:Function):void {
        GameLayerManager.gameLayer().loadLayer.addChild(Common.globalMask);
        if (!curtainImage) {
            curtainImage = Utils.createBitmap("curtain_png");
        }
        curtainImage.alpha = 1.0;
        GameLayerManager.gameLayer().loadLayer.addChild(curtainImage);
        curtainImage.x = Common.SCREEN_W;
        curtainImage.y = 0;
        let toX = Common.SCREEN_W - curtainImage.width;
        egret.Tween.get(curtainImage).to({x:toX}, 600).call(()=>{
            if (func) {
                func();
            }
            egret.Tween.get(curtainImage).to({alpha:0}, 300).call(()=>{
                GameLayerManager.gameLayer().loadLayer.removeChildren();
            });
        });
    }

    /**弹窗弹出动画 */
    export function popupOut(target:any, time:number=500, func:Function=null) {
        target.scaleX = 0;
        target.scaleY = 0;
        egret.Tween.get(target).to({scaleX:1.0, scaleY:1.0}, time, egret.Ease.backOut).call(()=>{
            if (func) func();
        });;
    }

    /**弹窗回收动画 */
    export function popupIn(target:any, time:number=500, func:Function=null) {
        egret.Tween.get(target).to({scaleX:0, scaleY:0}, time, egret.Ease.backIn).call(()=>{
            if (func) func();
        });
    }

    /**
     * 抽卡动画
     * 星级分布:
     * 2:72 108
     * 3:54 90 126
     * 4:36 72 108 144
     * 5:18 54 90 126 162
     * 6:0 36 72 108 144 180
     */
    export function drawCard(card:any, func:Function = null) {
        //动画是否播放完成
        let isFinish:boolean = false;
        let equipGrade:number = 0;
        let name:string = ""
        for (let i = 0; i < ConfigManager.tcEquip.length; i++) {
            let equipConf = ConfigManager.tcEquip[i];
            if (equipConf.id == card.id) {
                equipGrade = equipConf.grade;
                name = equipConf.name;
                break;
            }
        }

        let group:eui.Group = new eui.Group();
        let bg:egret.Bitmap = Utils.createBitmap("drawCardBg_png");
        bg.width = Common.SCREEN_W;
        bg.height = Common.SCREEN_H;
        group.addChild(bg);
        //白色遮罩
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.beginFill( 0xffffff, 1);
        shp.graphics.drawRect( 0, 0, Common.SCREEN_W, Common.SCREEN_H );
        shp.graphics.endFill();
        shp.alpha = 0;
        group.addChild( shp );
        //武器
        let equipGroup:eui.Group = new eui.Group();
        equipGroup.alpha = 0;
        group.addChild(equipGroup);
        let equipBg:egret.Bitmap = Utils.createBitmap(`drawCard0${equipGrade}_png`);
        equipBg.x = 186;
        equipGroup.addChild(equipBg);
        let nameText:egret.TextField = Utils.createText(name, Common.SCREEN_W/2, 79, 45, 0x0A0000);
        nameText.fontFamily = "Microsoft YaHei";
        nameText.bold = true;
        nameText.stroke = 3;
        nameText.strokeColor = 0xfcfaf9;
        nameText.anchorOffsetX = nameText.width/2;
        equipGroup.addChild(nameText);
        let img_equip:egret.Bitmap = Utils.createBitmap(`equip${25-card.id}_png`);
        img_equip.anchorOffsetX = img_equip.width/2;
        img_equip.x = nameText.x;
        img_equip.y = 181;
        equipGroup.addChild(img_equip);
        let starGroup:eui.Group = new eui.Group();
        equipGroup.addChild(starGroup);
        for (let i = 0; i < equipGrade+1; i++) {
            let img_star:egret.Bitmap = Utils.createBitmap("star_00_png");
            img_star.x = 36 * i;
            starGroup.addChild(img_star);
        }
        starGroup.anchorOffsetX = (equipGrade+1)*18;    //(width/2)
        starGroup.x = Common.SCREEN_W/2;
        starGroup.y = nameText.y + 65;
        for (let i = 0; i < card.affix.length; i++) {
            let imgId = 0;
            for (let j = 0; j < modShop.affixValueRolls.length; j++) {
                let affixInfo = modShop.affixValueRolls[j];
                if (card.affix[i].value >= affixInfo[0] && card.affix[i].value <= affixInfo[1]) {
                    imgId = j + 1;
                    break;
                }
            }
            let img_affix:egret.Bitmap = Utils.createBitmap(`star_0${imgId}_png`);
            img_affix.x = 36 * i;
            starGroup.addChild(img_affix);
        }

       //动画
        var data = RES.getRes("drawCard_json");
        var txtr = RES.getRes("drawCard_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        var mc1:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "drawCard" ) );
        mc1.x = Common.SCREEN_W/2 - 154;
        mc1.y = Common.SCREEN_H/2 - 144;
        mc1.visible = false;
        group.addChild(mc1);

        /********************动画********************/
        var step3 = function() {
            egret.Tween.get(equipGroup).to({ alpha: 1.0 }, 400).call(()=>{
                isFinish = true;
            });
        }
        var step2 = function() {
            egret.setTimeout(()=>{
                mc1.visible = true;
                mc1.gotoAndPlay("drawCard", 1);
                egret.setTimeout(step3, this, 250);
            }, this, 200);
            egret.Tween.get(shp).to({ alpha: 0 }, 250);
        }
        var step1 = function() {
            egret.Tween.get(shp).to({ alpha: 1.0 }, 200).call(step2);
        }
        /*******************************************/
        step1();
        GameLayerManager.gameLayer().maskLayer.addChild(group);
        //添加播放完成事件
        mc1.addEventListener(egret.Event.COMPLETE, function (){
            mc1.visible = false;
            // step3();
        }, this);
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            if (isFinish) {
                shp.graphics.clear();
                egret.Tween.removeTweens(group);
                GameLayerManager.gameLayer().maskLayer.removeChildren();
                if (func) {
                    func();
                }
            }
        }, this);
    }
}