/**
 * Created by lunjiang on 14-3-26.
 */
(function(){
    function getCanvas(){
        var canvas;
        return (function(){return canvas|| (canvas = document.getElementsByTagName("canvas")[0].getContext("2d"))})();
    }

    function drawText(text){
        var context = getCanvas();
        context.font = "50px 微软雅黑 bold";
        context.fillText(text||"lunjiang",40,40);
    }

    function getCanvasData(){
          var context = getCanvas();
          var dom = context.canvas;
          var w = dom.clientWidth;
          var h = dom.clientHeight;
          var data = context.getImageData(0,0,w,h).data;
            var ret =[];
          for(var i= 0,len=data.length;i<len;i=i+4){
              if(data[i+3]>128){
                ret.push(data[i+0],data[i+1],data[i+2],data[i+3]);
              }
          }
        return ret;

    }

    function createBall(){
        var canvas = getCanvas().canvas;
        // 创建一个小球
        var ball = createBall(ballR);
//添加到舞台
        stage.addChild(ball);
//取得画布中心位置
        vpx = canvas.width/2;
        vpy = canvas.height/2;

// 取得当前鼠标相对中心偏移距离 xpos， ypos
        stage.addEventListener('mousemove', function (x, y) {
            xpos = x - vpx;
            ypos = y - vpy;
        });
// 用键盘上下键改变z坐标的位置
        document.addEventListener('keydown', function (e) {
            if (e.keyCode == 38) zpos += 5;
            if (e.keyCode == 40) zpos -=5;
        }, false)

// 每帧刷新时的改变
        stage.onRefresh = function () {
            // 将z坐标扁平化
            var scale = focalLength/(focalLength + zpos);
            // 将扁平後z坐标对x，y的影响给小球坐标
            ball.x = vpx + xpos*scale;
            ball.y = vpy + ypos*scale;
            // 对小球大小的影响
            ball.width  = ballR*2*scale;

            document.getElementById('scale').innerHTML = scale;
        }

        stage.start();

    }

    function create3D(){

        var canvas = document.getElementById('canvas');
        var stage = new Stage(canvas);
        var createBall = function (radius) {
            radius = (radius === undefined) ? 20 : radius;
            return new Sprite(stage.ctx, {
                x: 0,
                y: 0,
                width: radius*2,
                draw: function () {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, this.width/2, 0, Math.PI*2, true);
                    this.ctx.closePath();
                    this.ctx.fillStyle = 'rgba(0,0,0,'+ Math.min(1, this.width/(2*radius)) +')';
                    this.ctx.fill();
                }
            });
        };

        var initialize = function () {
            var xpos = 0,
                ypos = 0,
                zpos = 0,
                focalLength = 250,
                ballR = 20,
                vpx,
                vpy;
            var ball = createBall(ballR);
            stage.addChild(ball);
            vpx = canvas.width/2;
            vpy = canvas.height/2;

            stage.addEventListener('mousemove', function (x, y) {
                xpos = x - vpx;
                ypos = y - vpy;
            });
            document.addEventListener('keydown', function (e) {
                if (e.keyCode == 38) zpos += 5;
                if (e.keyCode == 40) zpos -=5;
            }, false)

            stage.onRefresh = function () {
                var scale = focalLength/(focalLength + zpos);
                ball.x = vpx + xpos*scale;
                ball.y = vpy + ypos*scale;
                ball.width  = ballR*2*scale;

                document.getElementById('scale').innerHTML = scale;
            }

            stage.start();
        };

        initialize();

    }



    drawText();



})();