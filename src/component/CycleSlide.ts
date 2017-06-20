/**
*  文 件 名： CycleSlide.ts
*  功    能： 滚动组件
*  内    容： 自定义组件，支持多张图片水平(垂直)切换滚动
* 
* Example:
*/
class CycleSlide extends eui.Component {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/heroInfoSkin.exml";
    }

    protected createChildren():void {
        this.validateNow()
        for (let i = 0; i < 3; i++) {
            this._heroImage[i] = new Array();
            this._heroImage[i][0] = `hero${i+1}_light_png`;
            this._heroImage[i][1] = `hero${i+1}_gray_png`;
        }
    }

    private uiCompleteHandler():void {
        
    }

    private onMoveListener(event:egret.TouchEvent):void {
        
    }

    public showHero(heroId:number) {
        this.curHeroCount = heroId;
        this.changeHero();
    }

    public getCurHeroCount():number {
        return this.curHeroCount;
    }

    private onBtnListener(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            
        }
    }

    private changeHero(pos?:string):void {
        if (pos == "left") {
            this.curHeroCount = (++this.curHeroCount  > 2) ? 0 : this.curHeroCount;
        }
        else if (pos == "right"){
            this.curHeroCount = (--this.curHeroCount < 0) ? 2 : this.curHeroCount;
        }
        Common.curPanel.showHero(this.curHeroCount+1);
        this.mid_Image.source = this._heroImage[this.curHeroCount][0];
        this.mid_Image.source = "hero4_light_png";
        let left_count = (this.curHeroCount == 0) ? 2 : this.curHeroCount - 1;
        this.left_Image.source = this._heroImage[left_count][1];
        let right_count = (this.curHeroCount == 2) ? 0 : this.curHeroCount + 1;
        this.right_Image.source = this._heroImage[right_count][1];
    }


    /**左边的图 */
    private left_Image:eui.Image;
    /**中间的图 */
    private mid_Image:eui.Image;
    /**右边的图 */
    private right_Image:eui.Image;
    private hero_Image:eui.Image[] = [];
    /**按钮 */
    private btn_left:eui.Button;
    private btn_right:eui.Button;
    /**存储英雄的图片 */
    private _heroImage:any[] = [];
    private _tempImage:eui.Image[] = [];
    private curHeroCount:number = 1;
}