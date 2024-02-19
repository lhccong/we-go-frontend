export class StringUtils{
  public static isEmpty(str: string){
    if(str.trim().length === 0){
      return true;
    }
    return false;
  }

  public static isPhone(phone: string){
    if(this.isEmpty(phone)){
      return false;
    }
    const reg = /^1[3|4|5|7|8][0-9]{9}/;
    if(reg.test(phone)){
      return true;//手机号码正确
    }
    return false;
  }

  public static isEmail(email: string){
    if(this.isEmpty(email)){
      return false;
    }
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
    if(reg.test(email)){
      return true;//手机号码正确
    }
    return false;
  }

  public static isNotEmpty (str: string){
    return !(str === 'undefined' || !str || !/[^\s]/.test(str));
  }
}
