// 这是我们的玩家要躲避的敌人 
var Enemy = function(x, y, speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = x;
    this.y = y;
    // 速度
    this.speed = speed;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = progress.enemyImgUrl;
};

// 这里敌人图片宽度一致， 属性公用
Enemy.prototype.width = 80;

// 这里敌人图片高度一致， 属性公用
Enemy.prototype.height = 78;

// 此为游戏必须的函数， 用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的 
    this.x += this.speed * dt;
    // 检测碰撞
    // 垂直方向碰撞条件：
    //（（敌人的y值 + 敌人的高度） >= 玩家的y值 ）&& （敌人的y值 <= (玩家的y值 + 玩家的高度）)
    // 水平方向碰撞条件：
    //（（敌人的x值 + 敌人的宽度） >= 玩家的x值 ）&& （敌人的x值 <= (玩家的x值 + 玩家的宽度）)
    if ( ((this.y + this.height) >= player.y) && (this.y <= (player.y + player.height)) && (((this.x + this.width) >= player.x) && (this.x <= (player.x + player.width))) ) {
        // 保存记录
        progress.saveRecord();
        // 重制分数
        progress.resetScore();
        // 重制玩家
        player.reset();
        // 切换模式
        allEnemies.forEach(function(enemy){
            if (progress.currentMode === 'normal') {
                enemy.changeModel('normal');
            } else if (progress.currentMode === 'joke'){
                enemy.changeModel('joke');
            }
        })
        alert('失败了');
    }
    // 如果敌人走完一个回合，再次重走， 随机分配轨道
    if (this.x >= progress.MAXENEMYXVALUE) {
        var yIndex = utils.random(0, 3);
        this.y = progress.defaultEnemyPos.ypos[yIndex];
        this.x = progress.DEFAULTENEMYPOSX;
    }
};

// 提高难度
Enemy.prototype.addDifficult = function(difficultRate){
    this.speed = this.speed * (1 + difficultRate);
}

// 更换模式
Enemy.prototype.changeModel = function(mode){
    if (mode === 'normal') {
        this.speed = progress.startEnemySpeed;
    } else if (mode === 'joke') {
        this.speed = progress.jokeEnemySpeed;
    }
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function (x, y){
    // 玩家x位置值
    this.x = x;
    // 玩家y位置值
    this.y = y;
    // 玩家图片高度
    this.height = 60;
    // 玩家图片宽度
    this.width = 80;
    this.sprite = progress.playerImgUrl;
}

// 更新玩家位置数据
Player.prototype.update = function(){
    // 如果成功过河， 更新分数
    if (this.y === -20) {
        progress.updateScore();
        this.y = 380;
    }
}

// 渲染玩家
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// 处理键盘事件
Player.prototype.handleInput = function(direction){
    switch (direction) {
        case "left":
            if (this.x === 0) {
                this.x = 100;
            }
            this.x -= 100;
        break;
        case "right":
            if (this.x === 400) {
                this.x = 300;
            }
            this.x += 100;
        break;
        case "up":
            if (this.y < 60) {
                this.y = 60;
            }
            this.y -= 80;
        break;
        case "down":
            if (this.y >= 380) {
                this.y = 300;
            }
            this.y += 80;
        break;
        // no default
    }
}

// 重制玩家位置
Player.prototype.reset = function(){
    this.x = progress.defaultPlayerPos.x;
    this.y = progress.defaultPlayerPos.y;
}


//这是游戏流程管理类
var ProgressWork = function(){
    // 分数Dom
    this.$scoreEl = utils.$el("youScore");
    // 开始游戏按钮
    this.$startButton = utils.$el("startBtn");
    // 普通模式按钮
    this.$normalBtn = utils.$el("normalBtn");
    // 绝望模式按钮
    this.$nohopeBtn = utils.$el("nohopeBtn");
    // 最高纪录dom
    this.$hightRecord = utils.$el("hightRecord");
    // 初始分数
    this.score = 0;
    // 当前模式
    this.currentMode = 'normal';
    // 点击事件动作类型
    this.btnActionType = 1;
    // 敌人一开始默认速度
    this.startEnemySpeed = 300;
    // 绝望速度
    this.jokeEnemySpeed = 2000;
    // 最高纪录存储key
    this.highScoreRecordKey = 'game_high_score';
    // 默认最高分
    this.highScoreRecord = 0;
    // 默认敌人的位置数据
    this.defaultEnemyPos = {
        ypos: [60, 140, 220],  
        xpos: [10,-200, -100]
    }
    // 默认玩家的位置
    this.defaultPlayerPos = {
        x: 200,
        y: 380
    }
    // 默认使用的敌人图片地址
    this.enemyImgUrl = 'images/enemy-bug.png';
    // 敌人在可视游戏横向画面运动最长距离
    this.MAXENEMYXVALUE = 500;
    // 敌人默认出发的x方向位置值
    this.DEFAULTENEMYPOSX = -100;
    // 玩家默认图片地址
    this.playerImgUrl = "images/char-boy.png";

}
//初始化
ProgressWork.prototype.init = function(){
    var self = this;

    // 点击开始游戏按钮
    this.$startButton.onclick = function(){

        // 如果是开始游戏
        if(progress.btnActionType === 1){
            // 如果是普通模式
            if (self.currentMode === 'normal') {
                init();
                allEnemies.forEach(function(enemy){
                    enemy.changeModel('normal');
                })
            } 
            // 如果是绝望模式
            else if (self.currentMode === 'joke') {
                init();
                allEnemies.forEach(function(enemy){
                    enemy.changeModel('joke');
                })
            }
            // 更新按钮文字并更改动作类型
            progress.changeButtonText('暂停游戏');  
            progress.btnActionType = 2;
        } 
        // 如果是暂停游戏
        else if (progress.btnActionType === 2) { 
            progress.btnActionType = 1;
            progress.changeButtonText('继续游戏');  
            progress.stopGame(rqfId);
        }
    }

    // 点击 普通模式 按钮事件
    this.$normalBtn.onclick = function(){
        // 更改按钮当前状态， 更换模式
        utils.removeClass(self.$nohopeBtn, 'active');
        progress.btnActionType = 1;
        progress.changeButtonText('开始游戏'); 
        self.currentMode = 'normal';
        if (!utils.hasClass(this, 'active')) {
            utils.addClass(this, 'active');
            progress.stopGame(rqfId);
        }
    }

    // 点击 绝望模式 按钮事件
    this.$nohopeBtn.onclick = function(){
        utils.removeClass(self.$normalBtn, 'active');
        progress.btnActionType = 1;
        progress.changeButtonText('开始游戏'); 
        self.currentMode = 'joke';
        if (!utils.hasClass(this, 'active')) {
            utils.addClass(this, 'active');
            if (typeof rqfId !== 'undefined') {
                progress.stopGame(rqfId);
            }
        }
    }

    // 读取最高纪录
    this.initHighScoreRecord();
}

// 渲染分数
ProgressWork.prototype.renderScore = function(){
    this.$scoreEl.innerHTML = this.score;
}

// 初始化读取最高纪录
ProgressWork.prototype.initHighScoreRecord = function(){
   var highscore =  utils.getStorage(this.highScoreRecordKey);
   if (highscore) {
     this.highScoreRecord = highscore;
   }
   this.renderLastRecord();
}

// 保存最高记录
ProgressWork.prototype.saveRecord = function(){
    var oldRecord = utils.getStorage(this.highScoreRecordKey);
    // 如果当前分数比纪录分数更高， 更换纪录
    if (Number(oldRecord) < this.score) {
        this.highScoreRecord = this.score;
        utils.setStorage(this.highScoreRecordKey, this.score);
        this.renderLastRecord();
    }
}

// 渲染最高纪录
ProgressWork.prototype.renderLastRecord = function(){
    this.$hightRecord.innerHTML = this.highScoreRecord;
}

// 更新分数
ProgressWork.prototype.updateScore = function(score){
    this.score += 100;
    this.checkScore();
    this.renderScore();
}

//重制分数
ProgressWork.prototype.resetScore = function(){
    this.score = 0;
    this.$scoreEl.innerHTML = this.score;
}

//更换按钮信息 (开始游戏 <=> 继续游戏 )
ProgressWork.prototype.changeButtonText = function(text){
    this.$startButton.innerHTML = text;
}

//暂停游戏
ProgressWork.prototype.stopGame = function(rqfId){
    window.cancelAnimationFrame(rqfId);
}

//检查分数
ProgressWork.prototype.checkScore = function(){
    // 上升中级难度
    if (this.score === 500) {
        allEnemies.forEach(function(enemy){
            enemy.addDifficult(0.5);
        })
    } 
    // 上升高级难度
    else if ((this.score === 1000)) {
        allEnemies.forEach(function(enemy){
            enemy.addDifficult(1);
        })
    } 
    // 上升金牌高级难度
    else if ((this.score === 1500)) {
        allEnemies.forEach(function(enemy){
            enemy.addDifficult(0.5);
        })
    }
}


//实例化游戏流程类
var progress = new ProgressWork();
//初始化
progress.init();

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [];
for (var i = 0; i < progress.defaultEnemyPos.ypos.length; i++) {
    var enemy = new Enemy(progress.defaultEnemyPos.xpos[i], progress.defaultEnemyPos.ypos[i], progress.startEnemySpeed);
    allEnemies.push(enemy);
}

//实例化玩家
var player = new Player(progress.defaultPlayerPos.x, progress.defaultPlayerPos.y);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
