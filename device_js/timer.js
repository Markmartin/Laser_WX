/**
 * Created by liaodongnian on 2017/4/13.
 */

function Timer(timerObject)
{
    this.weekdayCN = new  Array ();
    this.weekdayEN = new  Array ();
    if(timerObject == undefined)
    {
        var date = new  Date();
        timerObject = {
            'repeat':'none',
            'enabled' : true,
            'attrs' :{
                'S':true,
            },
        //
        //         this.getMonth() + 1, //月份
        //     "d+": this.getDate(), //日
        // "h+": this.getHours(), //小时
        // "m+": this.getMinutes(), //分
        // "s+": this.getSeconds(),
            'time':date.getUTCHours()+':'+date.getUTCMinutes(),
            'date': date.getUTCFullYear()+'-'+(date.getUTCMonth()+1) + '-' + date.getUTCDate(),

            // 'date' : new Date(),
            // ''
        }
        // timerObject = JSON.stringify(timerObject);
    }
    if (timerObject != undefined)
    {
        this.remark = timerObject.remark;
        this.repeat = timerObject.repeat;
        this.did = timerObject.did;
        this.created_at = timerObject.created_at;
        this.enabled = timerObject.enabled;
        this.days = timerObject.days;
        this.product_key = timerObject.product_key;
        this.attrs = timerObject.attrs;
        this.time = timerObject.time;
        this.date = timerObject.date;
        this.id = timerObject.id;
        if (timerObject.timerId != undefined)
        {
            this.timerId = timerObject.timerId;
        }

        this.timerEvent = "";
        if (timerObject.attrs.S == true)
        {
            this.timerEvent = "开启"
        }
        else
        {
            this.timerEvent = "关闭"
        }
        this.localDate = "";
        this.localTime = "";

        if (this.repeat == "none")
        {

            var utcDate = new Date(this.date.split('-').join('/')+" "+this.time);
            var localDate = new Date(utcDate.getTime() + 8*60*60*1000);
            this.localDate = localDate.getFullYear() + "-" + appendZero((localDate.getMonth()+1)) + "-" + appendZero(localDate.getDate());
            this.localTime = appendZero(localDate.getHours())+":"+appendZero(localDate.getMinutes());

            this.localhour =  localDate.getHours() ;

            this.localmin = localDate.getMinutes();
        }
        else
        {
            this.weekdayEN = this.repeat.split(",");
            this.weekdayCN = new Array();

            var timeArray = this.time.split(":");
            var hour = parseInt(timeArray[0]);
            console.log(hour);
            if (hour >= 16)
            {
                console.log("不处理");
                hour = hour - 16;
                for (var index in this.weekdayEN) {
                    var convert = {
                        "mon": "tue",
                        "tue": "wed",
                        "wed": "thu",
                        "thu": "fri",
                        "fri": "sat",
                        "sat": "sun",
                        "sun": "mon",
                    };
                    var key = this.weekdayEN[index];
                    this.weekdayEN[index] = convert[key];
                }
            }
            else
            {
                hour = hour + 8;
            }

            timeArray[0] = appendZero(hour);

            this.localTime = timeArray[0]+":"+timeArray[1];
            this.localhour =   parseInt(timeArray[0]) ;

            this.localmin = parseInt(timeArray[1]);

            for (var index in this.weekdayEN)
            {
                var weekday_chinese = {
                    "mon":"周一",
                    "tue":"周二",
                    "wed":"周三",
                    "thu":"周四",
                    "fri":"周五",
                    "sat":"周六",
                    "sun":"周日",
                };
                var key=this.weekdayEN[index];
                this.weekdayCN.push(weekday_chinese[key]);
            }
            console.log(timeArray);
        }

    }
}

function appendZero(num) {
    return num<10?"0"+num:num;
}


