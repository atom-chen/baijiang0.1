/**
 * 武器逻辑
 */
namespace modEquip {

    /**装备的通用资源 */
    export class EquipSource{
        public static EQUIPLV:number = 50;
        public static RESETATTR:string = "RESETATTR";
        public static UPSTAR:string = "UPSTAR";
        public static UPGRADE:string = "UPGRADE";
        public static CHANGEEQUIP:string = "CHANGEEQUIP";
    }

    /** 撞瘪的属性类型 */
    export class AttrType{
        public static ATTACK:number = 1;
        public static DEFEND:number = 2;
        public static BLOOD:number  = 3;

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
           this.lv   = 0;
           this.star = 0;
           this.attack = 50;
           this.defend = 10;
           this.blood = 100;
           this.attrType = [];
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

        public GetEquipAttr():any{
            return {attack:this.attack, defend:this.defend,blood:this.blood};
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

        public SetEquipAttr(attack:number, defend:number, blood:number):void{
            this.attack = attack;
            this.defend = defend;
            this.blood  = blood;
        }

        private id:number;          //装备id
        private lv:number;          //装备等级
        private star:number;        //装备星级
        private attack:number;      
        private defend:number;
        private blood:number;
        private attrType:Array<AttrType>;
    }

    /** 装备数据 */
   export class EquipData{
        public constructor(){
            this.equip_list = [];
        }

        public static instance:EquipData;
        public static GetInstance():EquipData{
            if(this.instance == null){
                this.instance = new EquipData();
            }

            return this.instance;
        }

        public Add(val:EquipInfo):void{
            this.equip_list.push(val);
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
        public GetEquipFromId(id:number):EquipInfo{
            for(let i in this.equip_list){
                if(this.equip_list[i].Id == id) return this.equip_list[i];
            }

            return null;
        }

        /** 插入装备信息 */
        public InsertEquipInfo(id:number):void{
            let info:EquipInfo = new EquipInfo();
            info.Id = id;
            this.equip_list.push(info);
            this.listSort();
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
        }

        /** 移除添加的洗练的装备 
         * arr 对应的洗练的数组
         */
        public RemovePointEquip(id:number):void{

            for(let i:number = 0; i < this.equip_list.length; i++){
                if(id == this.equip_list[i].Id){
                    for(let j:number = i; j < this.equip_list.length - 1; j++){
                        this.equip_list[j] = this.equip_list[j + 1];
                    }
                    break;
                }
            }
            this.equip_list.pop();
        }

        private equip_list:Array<EquipInfo>;
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

    export function GetAttrInfo(type:number, value:number):string{
        if(type == AttrType.ATTACK) return "攻击力+" + value + "%";
        else if(type == AttrType.DEFEND) return "防御力+" + value + "%";
        else if(type == AttrType.BLOOD) return "生命值+" + value + "%";
    }

    export function GetEquipLvFromValue(value):any{
        if(value < 20){
            return {color:0x727272,img:"star_00_png"};
        }
        else if(value >= 20 && value < 40)
        {
            return {color:0xffffff,img:"star_01_png"};
        }
        else if(value >= 40 && value < 60)
        {
            return {color:0x71ed09,img:"star_02_png"};
        }
        else if(value >= 60 && value < 80)
        {
            return {color:0x292ba5,img:"star_03_png"};
        }
        else if(value >= 80 && value < 90)
        {
            return {color:0xb012c9,img:"star_04_png"};
        }
        else if(value = 90)
        {
            return {color:0xdb7b15,img:"star_05_png"};
        }
    }
}