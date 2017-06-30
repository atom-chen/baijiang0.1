/**
 * 武器逻辑
 */
namespace modEquip {

    /**
     * 更新各个装备信息
     * 
     */
    export function update(equip:any) {
        if (SceneManager.mainScene.readyDialog){
            SceneManager.mainScene.readyDialog.updateEquip(equip);
        }
    }

    /**装备的通用资源 */
    export class EquipSource{
        public static EQUIPLV:number = 100;
        public static RESETATTR:string = "RESETATTR";
        public static UPSTAR:string = "UPSTAR";
        public static UPGRADE:string = "UPGRADE";
        public static CHANGEEQUIP:string = "CHANGEEQUIP";
    }

    /** 撞瘪的属性类型 */
    export class AttrType{
        public static BLOOD:number  = 1;
        public static ATTACK:number = 2;
        public static DEFEND:number = 3;
        public static CRIT:number   = 4;
        public static DODGE:number  = 5;

        public constructor(type:number, value:number){
            this.type = type;
            this.value = value;
        }
        
        public set Type(val:number){
            this.type = val;
        }

        public get Type(){
            return this.type;
        }

        public set Value(val:number){
            this.value = val;
        }

        public get Value(){
            return this.value;
        }

        private type:number;
        private value:number;
    }

    /** 装备信息 */
   export class EquipInfo{

       public constructor(){
           this.id   = 0;
           this.lv   = 1;
           this.star = 0;
           this.quality = 0;
           this.typeID = 0;
           this.attrType = [];
           this.attr_list = [];
           for(let i:number = 0; i < 5; i++) this.attr_list[i] = 50;
       }

        public set Id(val:number){
            this.id = val;
        }

        public get Id(){
            return this.id;
        }

        public set Lv(val:number){
            this.lv = val;
        }

        public get Lv(){
            return this.lv;
        }

        public set Star(val:number){
            this.star = val;
        }

        public get Star(){
            return this.star;
        }

        public get Quality(){
            return this.quality;
        }

        public set Quality(val:number){
            this.quality = val;
        }

        public set TypeID(val:number){
            this.typeID = val;
        }

        public get TypeID(){
            return this.typeID;
        }

        public GetEquipAttr():any{
            return this.attr_list;
        }

        public InsertAttrType(attrType:AttrType):void{
            this.attrType.push(attrType);
        }

        public ChangeAttrType(index:number, type:number, value:number):void{
            if(index < 0 || index > this.attrType.length) return;
            this.attrType[index].Type  = type;
            this.attrType[index].Value = value;
        }

        public GetAttrType():any{
            return this.attrType;
        }

        public GetPointTypeFromIndex(index:number):AttrType{
            if(index < 0 || index > this.attrType.length) return null;
            return this.attrType[index];
        }

        public SetEquipAttr(attrList:Array<number>):void{
            for(let i:number = 0; i < 5; i++){
                this.attr_list[i] = attrList[i];
            }
        }

        private id:number;                      //装备id
        private lv:number;                      //装备等级
        private star:number;                    //装备星级
        private quality:number;                 //装备的品质
        private typeID:number;                  //装备的类型id 主要是区别id一样的时候不同的typeid
        private attr_list:Array<number>;        //[1]生命[2]攻击[3]护甲[4]暴击[5]闪避
        private attrType:Array<AttrType>;       //属性类型
    }

    /** 装备数据 负责所有的装备信息 */
   export class EquipData{
        public constructor(){
            this.equip_list = [];
            this.id_list = [];
            this.lucky = 0;
            for(let i:number = 1; i <= 24; i++) this.id_list[i] = 0;
        }

        public static instance:EquipData;
        public static GetInstance():EquipData{
            if(this.instance == null){
                this.instance = new EquipData();
            }

            return this.instance;
        }

        public Add(val:EquipInfo):void{
            val.TypeID = this.id_list[val.Id]++;
            this.equip_list.push(val);
            this.listSort();
        }

        public Pop():void{
            this.equip_list.pop();
        }

        public GetEquipList():any{
            return this.equip_list;
        }

        public GetEquipNum():number{
            return this.equip_list.length;
        }

        /** 根据索引获得指定的物品 */
        public GetEquipFromIndex(index:number):EquipInfo{
            if(index < 0 || index > this.equip_list.length) return;

            return this.equip_list[index];
        }

        /** 根据指定的id获得武器 */
        public GetEquipFromId(id:number, typeId:number):EquipInfo{
            for(let i in this.equip_list){
                if(this.equip_list[i].Id == id && typeId == this.equip_list[i].TypeID) return this.equip_list[i];
            }

            return null;
        }

        /** 插入装备信息 */
        public InsertEquipInfo(equipInfo:any):void{
            let info:EquipInfo = new EquipInfo();
            info.Id = equipInfo.id;
            info.Star = equipInfo.star;
            info.Quality = TcEquipData.GetInstance().GetEquipInfoFromId(equipInfo.id).grade;
            for(let i:number = 0; i < equipInfo.affix.length; i++){
                let attrType = new AttrType(equipInfo.affix[i].type, equipInfo.affix[i].value);
                info.InsertAttrType(attrType);
            }
            info.TypeID = this.id_list[info.Id]++;

            this.equip_list.push(info);
            this.listSort();
        }

        /** 移除装备信息 */
        public RemoveEquipInfo(info:EquipInfo):void{
            for(let i:number = 0; i < this.equip_list.length; i++){
                if(info.Id == this.equip_list[i].Id && info.TypeID == this.equip_list[i].TypeID){
                    for(let j:number = i; j < this.equip_list.length - 1; j++){
                        this.equip_list[j] = this.equip_list[j + 1];
                    }
                    break;
                }
            }
            this.equip_list.pop();
        }

        public RemoveEquipFromIndex(index:number):void{
            if(index < 0 || index > this.equip_list.length) return;
            for(let j:number = index; j < this.equip_list.length - 1; j++){
                this.equip_list[j] = this.equip_list[j + 1];
            }
            this.equip_list.pop();
        }

        public set Lucky(val:number){
            this.lucky = val;
        }

        public get Lucky(){
            return this.lucky;
        }

        private swapData(i:number, j:number):void{
            let temp:EquipInfo = this.equip_list[i];
            this.equip_list[i] = this.equip_list[j];
            this.equip_list[j] = temp;
        }

        private listSort():void{
            for(let i:number = 0; i < this.equip_list.length; i++){
                for(let j:number = i + 1; j < this.equip_list.length; j++){
                    if(this.equip_list[i].Id < this.equip_list[j].Id){
                        this.swapData(i, j);
                    }
                }
            }
            LeanCloud.GetInstance().SaveEquipData();
        }

        private equip_list:Array<EquipInfo>;
        private lucky:number;
        private id_list:Array<number>;
    }

    export class TcEquipData{
        public constructor(){
            this.tcEquip = RES.getRes("TcEquip_json");
        }

        public static instance:TcEquipData;
        public static GetInstance():TcEquipData{
            if(this.instance == null){
                this.instance = new TcEquipData();
            }

            return this.instance;
        }

        public GetEquipInfoFromId(id:number):any{
            for(let i:number = 0; i < this.tcEquip.length; i++){
                if(id == this.tcEquip[i].id) return this.tcEquip[i];
            }

            return null;
        }

        private tcEquip:any;
    }

    /** 获得升星槽 锁需要的表格 */
    export class TcUpStar{
        
        public constructor(){
            this.tcStar = RES.getRes("TcUpStar_json");
        }

        public static instance:TcUpStar;
        public static GetInstance():TcUpStar{
            if(this.instance == null){
                this.instance = new TcUpStar();
            }
            return this.instance;
        }

        public GetConsumeFromGrade(grade:number):void{
            return this.tcStar[grade - 1];
        }

        private tcStar:any;
    }

    export class TcEquipUp{
        public constructor(){
            this.data_list = RES.getRes("TcEquipUp_json");
        }

        public static Instance:TcEquipUp;
        public static GetInstance():TcEquipUp{
            if(this.Instance == null){
                this.Instance = new TcEquipUp();
            }
            return this.Instance;
        }

        public GetDataFromLv(lv:number):any{
            for(let i:number = 0; i < this.data_list.length; i++){
                if(lv == this.data_list[i].lv){
                    return this.data_list[i];
                }
            }
        }

        private data_list:any;
    }

    export class TcLevel{

        public constructor(){
            this._data = [[30, 30,0,0,0],[50, 50,20,0,0],[80, 80, 50, 1,0],
                          [150, 150, 80, 3, 3],[200, 200, 150, 5, 5]];
        }

        public static Instance:TcLevel;
        public static GetInstance():TcLevel{
            if(this.Instance == null) this.Instance = new TcLevel();
            return this.Instance;
        }

        public GetDataFromQuality(quality:number):any{
            if(quality < 0 || quality > 4) return;
            return this._data[quality];
        }

        private _data:any;
    }

    /** 根据对应的类型和值 来获得对应的字符信息 */
    export function GetAttrInfo(type:number, value:number):string{
        if(type == AttrType.ATTACK) return "攻击+" + value + "%";
        else if(type == AttrType.DEFEND) return "护甲+" + value + "%";
        else if(type == AttrType.BLOOD) return "生命+" + value + "%";
        else if(type == AttrType.CRIT) return "暴击+" + value + "%";
        else if(type == AttrType.DODGE) return "闪避+" + value + "%";
    }

    export function GetEquipLvFromValue(value):any{

        if(value == 0) return {color:0x858685,img:"star_00_png"};

        if(value < 20){
            return {color:0x858685,img:"star_01_png"};
        }
        else if(value >= 20 && value < 40)
        {
            return {color:0x5e972b,img:"star_02_png"};
        }
        else if(value >= 40 && value < 60)
        {
            return {color:0x2f76b0,img:"star_03_png"};
        }
        else if(value >= 60 && value < 80)
        {
            return {color:0x852f9b,img:"star_04_png"};
        }
        else if(value >= 80)
        {
            return {color:0xab5515,img:"star_05_png"};
        }
    }

    /** 计算升级成功的概率 */
    export function GetSuccessGoodsLv(upInfo:EquipInfo, consumeInfo:EquipInfo):number{
        let successRate:number;
        let consumeData:any = TcUpStar.GetInstance().GetConsumeFromGrade(consumeInfo.Quality);
        let upData:any = TcUpStar.GetInstance().GetConsumeFromGrade(upInfo.Quality);
        successRate = Math.floor((consumeData.skill / upData.star[upInfo.Star]) * 100 )

        return successRate;
    }
}