var c = document.getElementById("myCanvas");
var myline = document.getElementById("myline");
var player = c.getContext("2d");
var line = myline.getContext("2d");

var x = 0; //player的位置
var y = 0;

var direction = ''; //現在方向

var StartX = 0; //cube的起始位置
var StartY = 0;

var tempHight = 0; //暫存長、寬
var tempWidth = 0;

var cubeHight = 0; //方塊的長、寬
var cubeWidth = 0;

var TurnX = 0 ; //轉彎的位置
var TurnY = 0 ; 

var myCube = [];

function init() {  //初始化
    line.beginPath();
    line.fillRect(0, 0, 1200, 700); //畫全部
    console.log(123);
    //劃出邊框
    line.moveTo(0, 0);
    line.lineTo(0, 700);
    line.lineTo(1200, 700);
    line.lineTo(1200, 0);
    line.lineTo(0, 0);
    line.strokeStyle = "#ff0000";
    line.stroke();
    playerMove();
}

function playerMove() { //使用者的球
    player.clearRect(0, 0, c.width, c.height);
    player.beginPath();
    player.arc(x, y, 10, 0, 2 * Math.PI);//(x,y,size)
    player.fillStyle = "green";
    player.fill();
    player.closePath();
}

function drawLine() { //畫線
    line.lineTo(x, y);
    line.stroke();
}

var vertex = []; //頂點
function drawCube(Collider, x, y) { //畫方塊
    if (Collider) { //如果碰撞到的話畫出正方形
        //如果碰到邊線卻長跟寬還沒齊
        // if(){
        // }

        for (var i = 0; i < myCube.length; i++) {
            line.clearRect(myCube[i].X, myCube[i].Y, myCube[i].Width, myCube[i].Hight);

        }
        myCube = []; //清空要畫的正方形
        tempHight = 0;
        tempWidth = 0;
        direction = '';
    } else if (cubeHight != 0 && cubeWidth != 0) { //有長跟寬
        myCube.push({ "X": StartX, "Y": StartY, "Width": cubeWidth, "Hight": cubeHight });
        if(StartX == TurnX){
            StartX = StartX + cubeWidth;
            tempWidth = 0;
            TurnX = 0;
        }else if(StartY == TurnY){
            tempHight = 0;
            StartY = StartY +cubeHight;
            TurnX = 0;
        }
        cubeHight = 0;
        cubeWidth = 0;
    } 
}
function Collider(m_x, m_y) { //是否碰到邊線 true (碰到)
    if (m_x == 0 || m_y == 0 || m_x == c.width || m_y == c.height) { //還在四個方向
        return true;
    }
    // for (var i = 0; i < myCube.length; i++) {
    //     if (m_x >= myCube.X && m_x <= myCube.X + myCube.width && m_y >= myCube.Y && m_y <= myCube.Y + myCube.cubeHight) {
    //         return true;
    //     }
    // }
    return false;
}
function playerin() {

}
init();


// function mycube(point){
//     var result = []
//     for(var i = 0; i < point.length ; i ++){
//         result.push({"X":point[i].x , "Y":point[i].y ,  });
//     }
// }


document.onkeydown = function (e) {
    var isie = (document.all) ? true : false;
    var key;
    if (isie) {
        key = window.event.keyCode;
    } else {
        key = e.which;
    }
    if (key == 37) {
        if (x <= 0) {
            x = 0;
        } else {
            if (direction == "") {
                StartX = x;
                StartY = y;
            }
            tempWidth -= 10;
            if (direction == 'top' || direction == 'down') { //轉彎了
                cubeHight = tempHight; //把寬度存進去
                if(TurnX == 0 ){
                    TurnX = x ; 
                    TurnY = y ;
                }
            }
            direction = 'left';
            x -= 10;
            drawLine();
            drawCube(Collider(x, y), x, y);
            playerMove();
        }
    }
    if (key == 38) {
        // y <= 0 ? 0 : y -= 10;
        if (y <= 0) {
            y = 0;
        } else {
            if (direction == "") {
                StartX = x;
                StartY = y
            }
            tempHight -= 10;
            if (direction == 'left' || direction == 'right') {
                cubeWidth = tempWidth; //把寬度存進去
                if(TurnX == 0 ){
                    TurnX = x ; 
                    TurnY = y ;
                }
            }
            direction = 'top';
            y -= 10;
            drawLine();
            drawCube(Collider(x, y), x, y);
            playerMove();
        }
    }
    if (key == 39) {
        if (x >= c.width) {
            x = c.width
        } else {
            if (direction == "") {
                StartX = x;
                StartY = y
            }
            tempWidth += 10;
            if (direction == 'top' || direction == 'down') { //轉彎了
                cubeHight = tempHight; //把寬度存進去
                if(TurnX == 0 ){
                    TurnX = x ; 
                    TurnY = y ;
                }
            }
            direction = 'right';
            x += 10;
            drawLine();
            drawCube(Collider(x, y), x, y);
            playerMove();
        }
    }
    if (key == 40) {
        if (y >= c.height) {
            y = c.height
        } else {
            if (direction == "") {
                StartX = x;
                StartY = y
            }
            tempHight += 10;
            if (direction == 'left' || direction == 'right') {
                cubeWidth = tempWidth; //把寬度存進去
                if(TurnX == 0 ){
                    TurnX = x ; 
                    TurnY = y ;
                }
            }
            direction = 'down';
            y += 10;
            drawLine();
            drawCube(Collider(x, y), x, y);
            playerMove();
        }
    }
};