
function mirroring(vector, horizontal) {
    if (horizontal) {
        return [-vector[0], vector[1]]
    } else {
        return [vector[0], - vector[1]]
    }
}


class monsters {
    constructor(imgID, isBoss, monsterC, size, speed, vector, pos) {
        this.img = document.getElementById(imgID);
        this.isBoss = isBoss;
        this.size = size || 30;
        this.speed = speed || 1 ;
        this.vector = vector || [3, 5];
        this.pos = pos || [600, 350];
        this.monsterC = monsterC;
    }
    draw() {
        this.pos[0] += this.vector[0] * this.speed;
        this.pos[1] += this.vector[1] * this.speed;
        this.BossMove();
        this.monsterC.drawImage(this.img, this.pos[0], this.pos[1], this.size, this.size);
        this.monsterC.rect(this.pos[0], this.pos[1], this.size, this.size);
        if (this.isBoss) {
            return this.pos;
        }
    }
    ATT1(){
        
    }
    BossMove() {
        var _maxX = this.pos[0] + this.size;
        var _maxY = this.pos[1] + this.size;
        if (line.isPointInPath(this.pos[0], this.pos[1], "evenodd")) { //有碰撞到
            var vec = mirroring(this.vector, true);
            if (line.isPointInPath(this.pos[0] + vec[0], this.pos[1] + vec[1], "evenodd")) {
                this.vector = mirroring(this.vector, false);
            } else {
                this.vector = vec;
            }
        }
        if (line.isPointInPath(_maxX, _maxY, "evenodd")) {
            var vec = mirroring(this.vector, true);
            if (line.isPointInPath(_maxX + vec[0], _maxY + vec[1], "evenodd")) {
                this.vector = mirroring(this.vector, false);
            } else {
                this.vector = vec;
            }
        }
        if (_maxY + this.vector[1] > 700 || _maxY + this.vector[1] < 0) {
            this.vector = mirroring(this.vector, false);
        }
        if (_maxX + this.vector[0] > 1200 || _maxX + this.vector[0] < 0) {
            this.vector = mirroring(this.vector, true);
        }

        if (this.pos[1] + this.vector[1] > 700 || this.pos[1] + this.vector[1] < 0) {
            this.vector = mirroring(this.vector, false);
        }
        if (this.pos[0] + this.vector[0] > 1200 || this.pos[0] + this.vector[0] < 0) {
            this.vector = mirroring(this.vector, true);
        }
    }
}




