class UserDataInfo{
    public constructor(){
        this.basicData = {};
    }

    public static instance:UserDataInfo;
    public static GetInstance():UserDataInfo{
        if(this.instance == null){
            this.instance = new UserDataInfo();
        }
        return this.instance;
    }

    public SaveData(data:any):void{
        this._userInfo = data;
    }

    public getUserInfo():any {
        return this._userInfo;
    }

    public SetBasicData(name:string, val:number):void{
        this.basicData[name] = val;
    }

    public GetBasicData(name:string):number{
        return this.basicData[name];
    }

    /**用户数据 */
    private _userInfo:any;
    private basicData:any;
}