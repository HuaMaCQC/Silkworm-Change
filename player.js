var c = document.getElementById("myPlay");
var player = c.getContext("2d");

var myimg = document.getElementById("myimg");
var line = myimg.getContext("2d");

var temp = document.getElementById("lineTemp");
var lineTemp = temp.getContext("2d");

var x = 0; //player的位置
var y = 0;

var LinePos = [];

var direction = ''; //現在方向
var bossPos = [];
var vertex = []; //頂點

var img = document.getElementById('bg');

/**
 * 判斷是否有碰牆
 * @param {*} m_x 
 * @param {*} m_y 
 */
function Collider(m_x, m_y) { //是否在縣內 true (縣內)
    if (m_x == 0 || m_y == 0 || m_x == 1200 || m_y == 700) { //還在四個方向
        return true;
    } else if (line.isPointInStroke(m_x, m_y)) {
        return true;
    }
    return false;
}



/**
 * 兩點距離
 * @param {Array} pos1 
 * @param {Array} pos2 
 */
function distance(pos1, pos2) {
    var dx = pos2[0] - pos1[0];
    var dy = pos2[1] - pos1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 使用者移動
 * @param {*} moveX 
 * @param {*} moveY 
 */
function playerMove(moveX, moveY) { //使用者的球
    return new Promise((resolve, reject) => {

        var tempX = x + moveX;
        var tempY = y + moveY;
        if (tempX <= 1200 && tempY <= 700 && tempX >= 0 && tempY >= 0) {
            if (!line.isPointInPath(tempX, tempY, "evenodd") || line.isPointInStroke(tempX, tempY)) { //如果他在方框內
                x = tempX;
                y = tempY;
            }
        }
        player.clearRect(0, 0, c.width, c.height);
        player.beginPath();
        player.arc(x, y, 10, 0, 2 * Math.PI);//(x,y,size)
        player.fillStyle = "green";
        player.fill();
        player.closePath();
        resolve();
    });
}

function dead(monsterC) {
    return new Promise((resolve, reject) => {
        if (vertex.length > 0) {
            if (monsterC.isPointInPath(x, y)) {
                if (confirm('你已死亡是否繼續遊戲?')) {
                    x = vertex[0][0];
                    y = vertex[0][1];
                    playerMove();
                    lineTemp.clearRect(0, 0, temp.width, temp.height);
                    direction = "";
                    vertex = [];
                    lineTemp.beginPath();
                    lineTemp.moveTo(x, y);

                } else {
                    init();
                }
            }
        }
        resolve();
    });
}

function hpDisplay(per) {
    var _w = per * 5.12; //max = 512
    var hpImg1 = document.getElementById('HP1')
    var hpImg2 = document.getElementById('HP2')
    var hpImg3 = document.getElementById('HP3')
    var hpImg4 = document.getElementById('HP4')
    hpC.clearRect(0, 0, ui.width, ui.height);
    hpC.drawImage(hpImg1, 300, -20, 590, 148);
    hpC.drawImage(hpImg2, 0, 0, _w * 4, 104, 341, 58, _w, 23);
    hpC.drawImage(hpImg3, 300, -20, 590, 148);
    hpC.drawImage(hpImg4, 300, -20, 590, 148);
    hpC.font = "30px Comic Sans MS";
    hpC.fillText(per + "%  /  80%", 350, 50);
}


/**
 * 初始化
 */
function init() {  //初始化



    x = 0; //player的位置
    y = 0;
    LinePos = [];
    direction = ''; //現在方向
    bossPos = [];
    vertex = []; //頂點
    line.clearRect(0, 0, c.width, c.height);
    lineTemp.clearRect(0, 0, c.width, c.height);
    line.beginPath();
    lineTemp.beginPath();

    //暫存的縣
    lineTemp.strokeStyle = "#00ff00";
    line.strokeStyle = "#ff0000";
    LinePos = [[0, 0], [1200, 0], [1200, 700], [0, 700]];


    line.fillStyle = line.createPattern(img, 'no-repeat');
    line.moveTo(0, 0);
    line.lineTo(1200, 0);
    line.lineTo(1200, 700);
    line.lineTo(0, 700);
    line.lineTo(0, 0);
    line.moveTo(LinePos[0][0], LinePos[0][1]);
    for (var i = 1; i < LinePos.length; i++) {
        line.lineTo(LinePos[i][0], LinePos[i][1]);
    }
    line.lineTo(LinePos[0][0], LinePos[0][1]);
    line.stroke();
    playerMove(0, 0);
    hpDisplay(0);
}


function sort(_array) {
    var _i = 0;
    do {
        var b_array;
        var n_array;
        if (_i == 0) {
            b_array = _array[_array.length - 1];
            n_array = _array[_i + 1];
        } else if (_i < _array.length - 1) {
            b_array = _array[_i - 1];
            n_array = _array[_i + 1];
        } else {
            b_array = _array[_i - 1];
            n_array = _array[0];
        }
        if (_array[_i] == n_array) {
            _array.splice(_i, 1);
        } else {
            if (_array[_i][0] == n_array[0]) {
                if (_array[_i][0] == b_array[0]) {
                    _array.splice(_i, 1);
                } else {
                    _i = _i + 1;
                }
            } else {
                if (_array[_i][1] == b_array[1]) {
                    _array.splice(_i, 1);
                } else {
                    _i = _i + 1;
                }
            }
        }
    } while (_i < _array.length);
    return _array;
}


/**
 * 計算場上需要的頂點並且排序
 * @param {Array} array 新增的點 
 */
function CheckLine(isDrawCube) { //補框 
    return new Promise((resolve, reject) => {
        if (isDrawCube) {
            var len = vertex.length - 1;
            var res = [];
            var Polygonal = []; //多邊形
            //順向接
            var i = 0;
            var m_if = LinePos.length - 1
            var m_add = 1;
            var m_init = 0
            var bool_end = false;
            var bool_start = false;
            var bool = true;
            var bool_sameDis = false;
            var end_i = -1;
            do{
            //for (var xxxx = 0; xxxx < 1000; xxxx++) {
                var path = new Path2D();
                path.moveTo(LinePos[i][0], LinePos[i][1]);
                i == m_if ? i = m_init : i += m_add;
                path.lineTo(LinePos[i][0], LinePos[i][1]);
                if (line.isPointInStroke(path, vertex[len][0], vertex[len][1]) && !bool_end) { //連好全部的縣
                    bool_end = true;
                    end_i = i;
                }
                if (bool_end && line.isPointInStroke(path, vertex[0][0], vertex[0][1])) {
                    if (line.isPointInStroke(path, vertex[len][0], vertex[len][1])) {
                        //判斷方向
                        var s_pos = distance(vertex[0], LinePos[i]);
                        var end_pos = distance(vertex[len], LinePos[i]);
                        if (s_pos < end_pos || bool_sameDis || end_i != i) {
                            bool_start = true;
                            bool_sameDis = false;
                        } else {
                            bool_sameDis = true;
                        }
                    } else {
                        bool_start = true;
                    }
                }
                if (bool_end && !bool_start) {
                    Polygonal.push(LinePos[i]);
                } else if (bool_end && bool_start) {
                    for (var _x = 0; _x < Polygonal.length; _x++) {
                        res.push(Polygonal[_x]);
                    }
                    for (var _x = 0; _x <= len; _x++) {
                        res.push(vertex[_x]);
                    }
                    line.clearRect(0, 0, temp.width, temp.height);
                    line.beginPath();
                    line.moveTo(0, 0);
                    line.lineTo(1200, 0);
                    line.lineTo(1200, 700);
                    line.lineTo(0, 700);
                    line.lineTo(0, 0);
                    var r_leng = res.length;
                    line.moveTo(res[r_leng - 1][0], res[r_leng - 1][1]);
                    for (var _i = 0; _i < r_leng; _i++) {
                        line.lineTo(res[_i][0], res[_i][1]);
                    }
                    if (line.isPointInPath(bossPos[0], bossPos[1], "evenodd") && !line.isPointInStroke(bossPos[0], bossPos[1])) {
                        bool_start = false;
                        bool_end = false;
                        m_init = LinePos.length - 1;
                        m_if = 0;
                        m_add = -1;
                        res = [];
                        Polygonal = [];
                    } else {
                        bool = false;
                        LinePos = sort(res);
                        line.fillStyle = line.createPattern(img, 'no-repeat');
                        line.fill("evenodd");
                        line.stroke();
                        direction = "";
                        vertex = [];
                        lineTemp.beginPath();
                        lineTemp.clearRect(0, 0, temp.width, temp.height);
                        lineTemp.moveTo(x, y);
                    }
                }
            //}
            } while (bool);
            resolve(true);
        } else {
            resolve(false);
        }
    })
}


/**
 * 畫出玩家連起來的範圍
 * @param {boolean} Collider 碰撞判斷 
 * @param {boolean} bool 轉彎判斷 
 * @param {Array} pos 移動前的位置
 * @param {string} now_direction 移動方向 
 */
function drawCube(Collider, bool, pos, now_direction) { //畫方塊
    return new Promise((resolve, reject) => {
        if (Collider) { //碰到邊邊
            if (vertex.length > 0 && drawLine()) {
                if (bool) { //轉彎了
                    vertex.push(pos); //紀錄頂點
                }
                vertex.push([x, y]);
                resolve(true);
            } else {
                direction = "";
                vertex = [];
                lineTemp.beginPath();
                lineTemp.moveTo(x, y);
                resolve(false);
            }
        } else { //出線
            drawLine(bool, pos, now_direction);
            resolve(false);
        }

    })
}

/**
 * 玩家出去時畫的縣 retun bool
 * @param {boolean} bool 轉彎判斷 
 * @param {Array} pos 移動前的位置
 * @param {string} now_direction 移動方向 
 */
function drawLine(bool, pos, now_direction) {
    if (lineTemp.isPointInStroke(x, y)) {
        var path = new Path2D();
        lineTemp.beginPath();
        lineTemp.clearRect(0, 0, temp.width, temp.height);
        var vertexTemp = vertex;
        vertex = [];
        for (var i = 0; i < vertexTemp.length; i++) {
            vertex.push(vertexTemp[i]);
            path.moveTo(vertexTemp[i][0], vertexTemp[i][1]);

            if (i == vertexTemp.length - 1) {
                path.lineTo(vertexTemp[i][0], vertexTemp[i][1]);
            } else {
                path.lineTo(vertexTemp[i + 1][0], vertexTemp[i + 1][1]);
            }
            if (i == 0) {
                lineTemp.moveTo(vertexTemp[i][0], vertexTemp[i][1]);
            }
            lineTemp.lineTo(vertexTemp[i][0], vertexTemp[i][1]);
            if (lineTemp.isPointInStroke(path, x, y)) {
                break;
            }
        }
        if (x > vertex[vertex.length - 1][0]) {
            direction = 'right';
        } else if (x < vertex[vertex.length - 1][0]) {
            direction = 'left';
        } else if (y > vertex[vertex.length - 1][1]) {
            direction = 'down';
        } else {
            direction = 'top';
        }
        lineTemp.lineTo(x, y);
        lineTemp.stroke();
        return false;
    }
    lineTemp.lineTo(x, y);
    if (bool) {
        vertex.push(pos); //紀錄頂點
    }
    direction = now_direction;
    lineTemp.stroke();
    return true;
}





