
var monsterCanvas = document.getElementById("monster");
var monsterC = monsterCanvas.getContext("2d");

var ui = document.getElementById("HP");
var hpC = ui.getContext("2d");
var isone = false;
var raf;
var Boss = new monsters(
    'BossImg',
    true,
    monsterC,
    90, 2
)

var iskeyDown = false;
var level = new levels();
var maxHP = 0;
function isonload() {
    level.level1();
    level.init();
    hpDisplay(0);
    init();
    maxHP = level.winPos.length;
    // debug(level.winPos , "#ff0000");
}


var m1 = new monsters(
    'BossImg',
    false,
    monsterC,
    70,1,[12,6],[10,10]
)


var m2 = new monsters(
    'BossImg',
    false,
    monsterC,
    90,2,[2,8],[100,10]
)
var m3 = new monsters(
    'BossImg',
    false,
    monsterC,
    50,1,[4,2],[10,100]
)
var m4 = new monsters(
    'BossImg',
    false,
    monsterC,
    50,2,[3,5],[100,100]
)
var m5 = new monsters(
    'BossImg',
    false,
    monsterC,
    50,3,[6,4],[700,10]
)



function keyDown(vecX, vecY, bool, pos, direction) {
        playerMove((vecX / 2), (vecY /2)) //玩家移動
        .then(() => { //判斷是否死亡
            return dead(monsterC);
        }).then(() => { //紀錄目前的頂點
            return drawCube(Collider(x, y), bool, pos, direction);
        }).then(()=>{
            pos = [x,y];
            return playerMove((vecX / 2), (vecY /2))
        }).then(()=>{
            return dead(monsterC);
        }).then(()=>{
            if(direction == "left" || direction == "right"){
                bool = (direction == 'top' || direction == 'down' || direction == '')
            }else {
                bool = (direction == 'left' || direction == 'right' || direction == '')
            }
            return drawCube(Collider(x, y), bool, pos, direction);
        }).then((isdrawCube) => {
            return CheckLine(isdrawCube);
        }).then((isdrawCube) => {
            return new Promise((res, rej) => {
                if (isdrawCube) {
                    window.cancelAnimationFrame(raf);

                    var tempWinPos = []
                    for(var i = 0 ; i < level.winPos.length ; i ++){
                        if(!line.isPointInPath(level.winPos[i][0], level.winPos[i][1], "evenodd")){
                            tempWinPos.push (level.winPos[i]);
                        }
                    }
                    level.winPos = tempWinPos;

                    var myhp =  Math.round( (maxHP - level.winPos.length) / maxHP * 10000)/ 100.0
                    hpDisplay(myhp);
                    console.log(maxHP - level.winPos.length);
                    console.log(maxHP);
                    if(myhp >= 80){
                         alert('恭喜你贏了');
                        //console.log('恭喜你贏了');
                         init();
                    }else{
                        res(true);
                    }
                } else {
                    res();
                }
            })
        }).then((isBoosStop) => {
            return new Promise((res, rej) => {
                if (isBoosStop) {
                    window.requestAnimationFrame(update)
                }
                res();
            });
            
        }).catch((err) => {
            console.log(err);
        });
  
}

document.onkeydown = function (e) {
    var isie = (document.all) ? true : false;
    var key;
    if (isie) {
        key = window.event.keyCode;
    } else {
        key = e.which;
    }
    if (key == 37) {
        var pos = [x, y];
        var bool = (direction == 'top' || direction == 'down' || direction == '');
        isone = true;
        keyDown(-10, 0, bool, pos, 'left');
    } else if (key == 38) {
        var pos = [x, y];
        var bool = (direction == 'left' || direction == 'right' || direction == '');
        isone = true;
        keyDown(0, -10, bool, pos, 'top');
    } else if (key == 39) {
        var pos = [x, y];
        var bool = (direction == 'top' || direction == 'down' || direction == '');
        isone = true;
        keyDown(10, 0, bool, pos, 'right');
    } else if (key == 40) {
        var pos = [x, y];
        var bool = (direction == 'left' || direction == 'right' || direction == '');
        isone = true;
        keyDown(0, 10, bool, pos, 'down');
    }
};


function update() {
    monsterC.beginPath();
    monsterC.clearRect(0, 0, 1200, 700);
    bossPos = Boss.draw();
    m1.draw();
    m2.draw();
    m3.draw();
    m4.draw();
    m5.draw();
    dead(monsterC);
    raf = window.requestAnimationFrame(update);
    //cancelAnimationFrame(raf) //停止
}
update();