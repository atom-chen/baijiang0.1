class TalentIR extends Base {
    public constructor(pageCount:number) {
        super();
        this.page = pageCount;
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/talentSkinIR.exml";
    }
    protected createChildren(): void{
        this.iconGroup = new Array();
        this.lvGroup = new Array();
    }

    protected childrenCreated():void {
        for (let i = 1; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                let id = 7*i+j-6;
                this.iconGroup[id-1] = new eui.Group();
                let iconImage:eui.Image = new eui.Image();
                iconImage.source = `talent${i}_${j+1}_png`;
                this.iconGroup[id-1].addChild(iconImage);

                let boxBg:eui.Image = new eui.Image();
                boxBg.source = "talentLvBox_png";
                this.iconGroup[id-1].addChild(boxBg);
                boxBg.x = 4;
                boxBg.y = 72;

                //等级
                this.lvGroup[id-1] = new eui.Label();
                this.lvGroup[id-1].textColor = 0x6f685d;
                this.lvGroup[id-1].text = "0/10";
                this.lvGroup[id-1].fontFamily = "Microsoft YaHei";
                this.lvGroup[id-1].right = 4;
                this.lvGroup[id-1].size = 18;
                this.lvGroup[id-1].x = boxBg.x;
                this.lvGroup[id-1].y = boxBg.y+4;
                this.iconGroup[id-1].addChild(this.lvGroup[id-1]);

                //遮罩
                let mask = Utils.createBitmap("mask_png");
                mask.width = 100;
                mask.height = 100;
                // mask.visible = false;
                this.iconGroup[id-1]["Mask"] = mask;
                this.iconGroup[id-1]["lv"] = 0;
                this.iconGroup[id-1].addChild(mask);

                this.iconGroup[id-1].x = this.position[j][0] + (i-1)*357;
                this.iconGroup[id-1].y = this.position[j][1];
                this.iconGroup[id-1].name = `${id}`;
                this.iconGroup[id-1].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onIconListener, this)
                this.talentGroup.addChild(this.iconGroup[id-1]);
            }
        }
        this.pageText.text = `第${this.page}页`;
        this.initUnlockAndLv(this.page);
    }
    private onComplete():void {
        // this.setUnlock();
    }

    private onIconListener(event:egret.TouchEvent):void {
        let id = event.currentTarget.name;
        TalentDialog.instance.showPopup(parseInt(id), parseInt(event.currentTarget["lv"]))
    }

    /**
     * 初始化解锁状态和天赋等级
     */
    private initUnlockAndLv(curPage:number):void {
        let userTalent = Common.userData.talentPage[curPage].talent;
        for (let i = 0; i < userTalent.length; i++) {
            let talent = userTalent[i];
            let id = talent[0];
            this.iconGroup[id-1]["Mask"].visible = false;
            this.iconGroup[id-1]["lv"] = talent[1];
            this.lvGroup[id-1].text = `${talent[1]}/10`;
        }
    }

    /**
     * 设置解锁的状态
     */
    public setUnlock(curPage:number):void {
        
    }

    /**
     * 设置等级
     */
    public setTalentLv(curPage:number):void {
        
    }

    public setTalentDetail(pageCount:number):void {
        this.pageText.text = `第${pageCount}页`;
    }

    /** */
    private talentGroup:eui.Group;
    /**吸血点数 */
    private bloodText:eui.Label;
    /**暴击点数 */
    private critText:eui.Label;
    /**回复 */
    private recoverText:eui.Label;
    private pageText:eui.Label;
    /**页数 */
    public page:number;
    /**位置 */
    private position = [[60,14],[267,14],[109,118],[219,118],[59,222],[268,222],[163,329]];
    /**天赋组 */
    private iconGroup:Array<eui.Group>;
    /**等级 */
    private lvGroup:Array<eui.Label>;
}