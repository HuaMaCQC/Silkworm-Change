var debugC = document.getElementById("debug");
var _debug = debugC.getContext("2d");


/**
 * 在場上印出點
 * @param {Array} array  
 */
function debug(array, fillStyleString , isnum) {
    for (var i = 0; i < array.length; i++) {
        _debug.beginPath();
        _debug.arc(array[i][0], array[i][1], 3, 0, 2 * Math.PI);//(x,y,size)
        _debug.fillStyle = fillStyleString;
        _debug.fill();
        _debug.closePath();
        _debug.fillStyle = fillStyleString;
        if(isnum){
            _debug.font = "bold 18px Arial";
            _debug.fillText(i, array[i][0], array[i][1]);
        }
        
    }
}


function Dclear() {
    _debug.beginPath();
    _debug.clearRect(0, 0, debugC.width, debugC.height);
}

function H5Debug() {
    var de_array = document.getElementById("input_array").value;
    var de_array = de_array.split(",");
    _debug.beginPath();
    _debug.arc(de_array[0], de_array[1], 10, 0, 2 * Math.PI);//(x,y,size)
    _debug.fillStyle = "#000099";
    _debug.fill();
}


var winPos = [];
var editLevels = false;
function getWinPos() {
    editLevels = !editLevels;
    _debug.clearRect(0, 0, 1200, 700);
    winPos = []
    if (editLevels) {
        $('#editLevels').text('關閉編輯器');
        _debug.rect(0, 0, 1200, 700);
        var img = document.getElementById('bg');
        _debug.fillStyle = line.createPattern(img, 'no-repeat');
        _debug.fill();
        $('#debug').mousedown(function (e) {
            winPos.push([Math.round(e.pageX - $(this).offset().left), Math.round(e.pageY - $(this).offset().top)]);

            if (winPos.length > 0) {

                _debug.beginPath();
                _debug.clearRect(0, 0, 1200, 700);
                _debug.rect(0, 0, 1200, 700);
                _debug.fillStyle = line.createPattern(img, 'no-repeat');
                _debug.fill();

                var str = '[';
                _debug.beginPath();
                _debug.moveTo(winPos[winPos.length - 1][0], winPos[winPos.length - 1][1])
                for (var i = 0; i < winPos.length; i++) {
                    str += '[' + winPos[i][0] + ',' + winPos[i][1] + ']';
                    if (i != winPos.length - 1) {
                        str += ',';
                    }
                    _debug.lineTo(winPos[i][0], winPos[i][1]);
                }
                str += ']';
                _debug.strokeStyle = "#ff0000";
                _debug.stroke();
                $('#out_pos').text('連線座標:' + str);
                debug(winPos, "#ff0000");
            }

        });
    } else {
        $('#editLevels').text('獲取過關的座標');
    }
}


