;(function(){
    var CommFn = CommFn || {};

    function Drag(block, options) {
        this.dragInit(block, options);
    }

    Drag.prototype = {
        options: {
            mxLeft: 0,
            mxRight: 9999,
            mxTop: 0,
            mxBottom: 9999,
            mxContainer: null,
            LockX: false,
            LockY: false,
            Onout: function(){},
            isMouseOver: function(){},
            Onmove: function(){}
        },

        dragInit: function(block, options) {
            this._block = block;
            this._awayX = 0;
            this._awayY = 0;
            this._marginLeft = 0;
            this._marginTop = 0;
            this._bindMove = CommFn.bindAsEventListener(this, this.move);
            this._bindStop = CommFn.bind(this, this.stop);
            CommFn.extend(this.options, options || {});
            CommFn.extend(this, this.options);
            // this.zIndex = Math.max(this.options.zIndex, Drag.zIndex || 0);
            //设置了限制和容器限制后计算边界值
            if (this.mxContainer) {
                this.mxLeft = 0;
                //表示滚动条滚动的最左边的位置（因为mxContainer本身进行了position:relative定位，所以对于其子元素直接是0）
                this.mxTop = 0;
                this.mxRight = this.mxLeft + this.mxContainer.offsetWidth - this._block.offsetWidth;
                this.mxBottom = this.mxTop + this.mxContainer.offsetHeight - this._block.offsetHeight;
            }
            CommFn.addListener(this._block, 'mousedown', CommFn.bindAsEventListener(this, this.start));
            // Drag.zIndex = this.zIndex;
        },

        //拖动开始
        start: function(e) {
            // this._block.style.zIndex = ++Drag.zIndex;
            var self = this;
            //设置了不出现滚动条限制后计算范围
            this._awayX = e.clientX - this._block.offsetLeft;
            this._awayY = e.clientY - this._block.offsetTop;
            this._marginLeft = parseInt(this._block.style.marginLeft) || 0;
            this._marginTop = parseInt(this._block.style.marginTop) || 0;
            if (CommFn.sys.IE) {
                CommFn.addListener(this._block, 'losecapture', this._bindStop);
                //IE下鼠标超出视口仍可被监听
                //setCapture()可以用在对DIV的拖动效果上。就不用给body设置onmousemove事件了，直接给DIV设置，然后通过setCapture()让它捕获所有的鼠标事件。
                //不过setCapture()方法，只有IE支持。
                this._block.setCapture();

            } else {
                e.preventDefault();
                CommFn.addListener(window, 'blur', this._bindStop);
            }
            CommFn.addListener(document, 'mousemove', this._bindMove);
            CommFn.addListener(document, 'mouseup', this._bindStop);
            CommFn.isBarMove = true;
        },

        move: function(e) {
            //禁止拖放对象文本被选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            var iLeft = e.clientX - this._awayX,
                iTop = e.clientY - this._awayY;
            iLeft = Math.min(Math.max(iLeft, this.mxLeft), this.mxRight);
            iTop = Math.min(Math.max(iTop, this.mxTop), this.mxBottom);
            // var block = this.custom ? this.customobj : this._block;
            if (!this.LockX) {
                this._block.style.left = iLeft - this._marginLeft + 'px';
            }
            if (!this.LockY) {
                this._block.style.top = iTop - this._marginTop + 'px';
            }
            this.Onmove();
        },

        stop: function(e) {
            CommFn.removeListener(document, 'mousemove', this._bindMove);
            CommFn.removeListener(document, 'mouseup', this._bindStop);
            if (CommFn.sys.IE) {
                CommFn.removeListener(this._block, 'losecapture', this._bindStop);
                this._block.releaseCapture();//打断当前的鼠标捕获
            } else {
                CommFn.removeListener(window, 'blur', this._bindStop);
            }
            if (!this.isMouseOver(e)) {
                CommFn.isBarMove = false;
            }
            this.Onout();
            CommFn.isBarMove = false;
        }
    };


    function Scrollbar(direction, contentscroll, content, options) {
        this.init(direction, contentscroll, content, options);
    }

    Scrollbar.prototype = {
        options: {
            topval1: 4,//外层滚动条上或左的偏差值
            bottomval1: 4,//下或右的偏差值
            topval2: 4,  //内层滚动条上或左的偏差值
            bottomval2: 4,
            border: 2,//[content的边框，没有为0]
            keyStep: 1,//键盘操作时的步长
            wheelStep: 5, //鼠标滚轮移动步长
            clickStep: 20, //鼠标点击blockContainer时移动的步长
            c: 0, //滚动条滚动到的位置,
            intervaltime: 5,//形成平滑移动，每移动1px的间隔时间
            flag: '', //this.block.offsetTop是增加还是减少固定步长
            timer: null,
            ismove: false,
            Onmove: function() {} //滚动条滚动时需执行的操作
        },

        init: function(direction, contentscroll, content, options) {
            CommFn.extend(this.options, options || {});
            CommFn.extend(this, this.options);
            if (direction == 'Y') {
                this.direction = true;//'Y'为纵,this.direction=true，'X'为横向,this.direction=false
            } else if (direction == 'X') {
                this.direction = false;
            }
            this.container = contentscroll;
            this.content = content;
            this.scroll = this.direction ? J.s('.Vscroll').eq(0).get() : J.s('.Hscroll').eq(0).get();
            this.blockcontainer = this.direction ? J.s('.VblockContainer').eq(0).get() : J.s('.HblockContainer').eq(0).get();
            this.block = this.direction ? J.s('.Vblock').eq(0).get() : J.s('.Hblock').eq(0).get();
            this.blockmiddle = this.direction ? J.s('.Vmiddle').eq(0).get() : J.s('.Hmiddle').eq(0).get();
            var self = this, contain, styleVal, bcHeight;
            contain = this.blockcontainer ? this.blockcontainer : this.container;

            //点击blockcontainer,滚动条及滚动内容跟着移动
            CommFn.addListener(contain, 'click', CommFn.bindAsEventListener(this, this.start));
            CommFn.addListener(this.block, 'click', CommFn.bindAsEventListener(this, this.bubble));
            //鼠标移动至滚动条样式变化
            CommFn.addListener(this.scroll, 'mouseover', CommFn.bindAsEventListener(this, this.overStyle));
            CommFn.addListener(this.scroll, 'mouseout', CommFn.bindAsEventListener(this, this.outStyle));

            //键盘与鼠标操作
            this.keyBind(this.container);
            this.wheelBind(this.container);
            var oFocus = CommFn.sys.IE ? this.block : this.container;
            CommFn.addListener(this.block, 'mousedown', function() {
                self.stopMove();
                oFocus.focus();
            });
            this.drag = new Drag(this.block, {mxContainer: contain, Onmove: CommFn.bind(this, this.move), isMouseOver: CommFn.bind(this, this.isMouseOver), Onout: CommFn.bind(this, this.outStyle), topval1: this.topval1, bottomval1: this.bottomval1});
            this.drag[this.direction ? "LockX" : "LockY"] = true;
        },

        calcHeight: function() {
            var bcHeight, styleVal, contain = this.blockcontainer ? this.blockcontainer : this.container;;
            if (this.direction) {


              var allHeight = 0;
                J.s('.item').length && J.s('.item').each(function(k, v) {
                    allHeight += (v.height() * 1 + v.getStyle('marginBottom').split('px')[0] * 1);
                });
                alert(allHeight);
                if (J.ua.ua.indexOf('MSIE 7.0') > 1) {
                    this.content.scrollHeight = allHeight;
                }



                if (this.container.offsetHeight >= (this.content.scrollHeight + this.border)) {
                    this.scroll.style.display = 'none';
                    return;
                }
                bcHeight = this.content.offsetHeight - this.topval1 - this.bottomval1;
                this.blockcontainer.style.height = bcHeight + 'px';
                this.scroll.style.height = bcHeight + this.topval1 + this.bottomval1 + 'px';
                styleVal = (bcHeight - this.border) * ((bcHeight - this.border) / this.content.scrollHeight);
                this.block.style.height = styleVal + 'px';
                this.blockmiddle.style.height = (styleVal - this.topval2 - this.bottomval2) + 'px';

            } else {
                if (this.container.offsetWidth >= (this.content.scrollWidth + this.border)) {
                    this.scroll.style.display = 'none';
                    return;
                }
                bcHeight = this.content.offsetWidth - this.topval1 - this.bottomval1;
                this.blockcontainer.style.width = bcHeight + 'px';
                this.scroll.style.width = bcHeight + this.topval1 + this.bottomval1 + 'px';
                styleVal = (bcHeight - this.border) * ((bcHeight - this.border) / this.content.scrollWidth);
                this.block.style.width = styleVal + 'px';
                this.blockmiddle.style.width = (styleVal - this.topval2 - this.bottomval2) + 'px';
            }
            this.scroll.style.display = 'block';
            //计算内容与滚动条的滚动比例
            var temp1, temp3;
            if (this.direction) {
                temp1 = this.content.scrollHeight + this.border - this.content.offsetHeight;
                temp3 = this.blockcontainer.offsetHeight - this.block.offsetHeight;
            } else {
                temp1 = this.content.scrollWidth + this.border - this.content.offsetWidth;
                temp3 = this.blockcontainer.offsetWidth - this.block.offsetWidth;
            }
            this.prop = temp1 / temp3;
            //鼠标拖动滚动条移动
            // this.drag = new Drag(this.block, {mxContainer: contain, Onmove: CommFn.bind(this, this.move), isMouseOver: CommFn.bind(this, this.isMouseOver), Onout: CommFn.bind(this, this.outStyle), topval1: this.topval1, bottomval1: this.bottomval1});
            // this.drag[this.direction ? "LockX" : "LockY"] = true;
            this.drag.dragInit(this.block, {mxContainer: contain, Onmove: CommFn.bind(this, this.move), isMouseOver: CommFn.bind(this, this.isMouseOver), Onout: CommFn.bind(this, this.outStyle), topval1: this.topval1, bottomval1: this.bottomval1});
            this.drag[this.direction ? "LockX" : "LockY"] = true;
            this.move();
        },

        //判断鼠标位置是否离开滚动条
        isMouseOver: function(e) {
            var maxScrollTop, maxScrollBottom, maxScrollLeft, maxScrollRight, x = e.clientX, y = e.clientY;
            maxScrollLeft = CommFn.getElementPos(this.scroll, 1);
            maxScrollRight = maxScrollLeft + this.scroll.offsetWidth;
            maxScrollTop = CommFn.getElementPos(this.scroll, 0);
            maxScrollBottom = maxScrollTop + this.scroll.offsetHeight;
            if (x <= maxScrollRight && x >= maxScrollLeft && y <= maxScrollBottom && y >= maxScrollTop) {
                return true;
            } else {
                return false;
            }
        },

        overStyle: function() {
            //纵向
            if (this.direction) {
                J.s('.Vp1').eq(0).addClass('Vp1hover');
                J.s('.VblockContainer').eq(0).addClass('VblockContainerhover');
                J.s('.Vp2').eq(0).addClass('Vp2hover');
                J.s('.VtAndl').eq(0).addClass('VtAndlhover');
                J.s('.Vmiddle').eq(0).addClass('Vmiddlehover');
                J.s('.VbAndr').eq(0).addClass('VbAndrhover');

            } else {
                J.s('.Hp1').eq(0).addClass('Hp1hover');
                J.s('.HblockContainer').eq(0).addClass('HblockContainerhover');
                J.s('.Hp2').eq(0).addClass('Hp2hover');
                J.s('.HtAndl').eq(0).addClass('HtAndlhover');
                J.s('.Hmiddle').eq(0).addClass('Hmiddlehover');
                J.s('.HbAndr').eq(0).addClass('HbAndrhover');
            }
        },

        outStyle: function() {
            //纵向
            if (this.direction) {
                if (!CommFn.isBarMove) {
                    J.s('.Vp1').eq(0).removeClass('Vp1hover');
                    J.s('.VblockContainer').eq(0).removeClass('VblockContainerhover');
                    J.s('.Vp2').eq(0).removeClass('Vp2hover');
                    J.s('.VtAndl').eq(0).removeClass('VtAndlhover');
                    J.s('.Vmiddle').eq(0).removeClass('Vmiddlehover');
                    J.s('.VbAndr').eq(0).removeClass('VbAndrhover');
                }

            } else {
                if (!CommFn.isBarMove) {
                    J.s('.Hp1').eq(0).removeClass('Hp1hover');
                    J.s('.HblockContainer').eq(0).removeClass('HblockContainerhover');
                    J.s('.Hp2').eq(0).removeClass('Hp2hover');
                    J.s('.HtAndl').eq(0).removeClass('HtAndlhover');
                    J.s('.Hmiddle').eq(0).removeClass('Hmiddlehover');
                    J.s('.HbAndr').eq(0).removeClass('HbAndrhover');
                }
            }
        },

        keyBind: function(element) {
            CommFn.addListener(element, 'keydown', CommFn.bindAsEventListener(this, this.keyControl));
            element.tabIndex = -1;
            CommFn.sys.IE || (element.style.outline = 'none');
        },

        //键盘操作
        keyControl: function(e) {
            this.stopDefault(e);
            this.stopMove();
            var styleTL = this.direction ? 'top' : 'left',
                offsetTL = this.direction ? 'offsetTop' : 'offsetLeft',
                mxTL = this.direction ? 'mxTop' : 'mxLeft',
                mxBR = this.direction ? 'mxBottom' : 'mxRight';
            switch(e.keyCode) {
                case 37: //Left
                    this.block.style[styleTL] = Math.max(this.block[offsetTL] - this.keyStep, this.drag[mxTL]) + 'px';
                    this.move();
                    break;
                case 38: //Up
                    this.block.style[styleTL] = Math.max(this.block[offsetTL] - this.keyStep, this.drag[mxTL]) + 'px';
                    this.move();
                    break;
                case 39: //Right
                    this.block.style[styleTL] = Math.min(this.block[offsetTL] + this.keyStep, this.drag[mxBR]) + 'px';
                    this.move();
                    break;
                case 40: //Down
                    this.block.style[styleTL] = Math.min(this.block[offsetTL] + this.keyStep, this.drag[mxBR]) + 'px';
                    this.move();
                    break;
            }
            return;
        },

        wheelBind: function(element) {
            CommFn.addListener(element, CommFn.sys.Firefox ? 'DOMMouseScroll' : 'mousewheel', CommFn.bindAsEventListener(this, this.wheelControl));
        },

        //鼠标滚轮操作
        wheelControl: function(e) {
            this.stopMove();
            /*
             IE, KHTML 支持 e.wheelDelta ,大于 0 为向上滚动，小于 0 为向下滚动。Gecko 支持 e.detail，小于 0 为向上滚动，大于 0 为向上滚动，跟前面的相反。而 Opera 比较牛，两种都支持。
             */
            var val = CommFn.sys.Firefox ? e.detail : e.wheelDelta,
                styleTL = this.direction ? 'top' : 'left',
                offsetTL = this.direction ? 'offsetTop' : 'offsetLeft',
                mxTL = this.direction ? 'mxTop' : 'mxLeft',
                mxBR = this.direction ? 'mxBottom' : 'mxRight';

            if (CommFn.sys.Firefox) {
                //先处理向上滚动（val<0），再处理向下滚动(val>0)
                this.block.style[styleTL] = val < 0 ? Math.max(this.block[offsetTL] - this.wheelStep, this.drag[mxTL]) + 'px' : Math.min(this.block[offsetTL] + this.wheelStep, this.drag[mxBR]) + 'px';
            } else {
                this.block.style[styleTL] = val > 0 ? Math.max(this.block[offsetTL] - this.wheelStep, this.drag[mxTL]) + 'px' : Math.min(this.block[offsetTL] + this.wheelStep, this.drag[mxBR]) + 'px';
            }
            this.move();
            this.stopDefault(e);
        },

        //为鼠标点击blcokContainer移动准备参数
        start: function(e) {
            var t, blockConLorT, blockLorT, mxMinux, mxAdd;//blockConLorT表示blcokContainer距离浏览器最左侧或者最上面的距离
            this.ismove = true;
            if (this.direction) {
                t = CommFn.sys.Chrome ? document.body.scrollTop : document.documentElement.scrollTop;
                blockConLorT = CommFn.getElementPos(this.blockcontainer, 0);
                blockLorT = this.block.offsetTop;
                this.flag = (e.clientY + t - blockConLorT) <= blockLorT ? 'minus' : 'add'; //this.block.offsetTop是增加还是减少固定步长
                mxMinux = this.drag.mxTop;
                mxAdd = this.drag.mxBottom;

            } else {
                t = CommFn.sys.Chrome ? document.body.scrollLeft : document.documentElement.scrollLeft;
                blockConLorT = CommFn.getElementPos(this.blockcontainer, 1);
                blockLorT = this.block.offsetLeft;
                this.flag = (e.clientX + t - blockConLorT) <= blockLorT ? 'minus' : 'add';
                mxMinux = this.drag.mxLeft;
                mxAdd = this.drag.mxRight;

            }
            if (this.flag == 'minus') {
                this.c = Math.max(blockLorT - this.clickStep, mxMinux);
            } else if (this.flag == 'add') {
                this.c = Math.min(blockLorT + this.clickStep, mxAdd);
            }
            this.intervaltime = 5;//5ms
            this.run();
        },

        //对外公开的方法[contentToVal：滚动到的地方]
        scrollTo: function(contentToVal) {
            var currentVal = 0, diffVal = 0, maxDistance;
            this.ismove = true;
            currentVal = this.direction ? this.content.scrollTop : this.content.scrollLeft;
            if (currentVal < contentToVal) { //向下滚动
                this.flag = 'add';
            } else if (currentVal > contentToVal) { //向上滚动
                this.flag = 'minus';
            }
            //将内容滚动的位置转化为滚动条滚动的位置
            this.c = contentToVal / this.prop;
            maxDistance = this.direction ? this.drag.mxBottom : this.drag.mxRight;
            this.c = this.c > maxDistance ? maxDistance : this.c;
            diffVal = this.direction ? Math.abs(this.c - this.scroll.scrollTop) : Math.abs(this.c - this.scroll.scrollLeft);
            //根据移动距离确定每1px移动间隔距离
            if (diffVal < 100) {
                this.intervaltime = 5;
            } else if (diffVal < 125) {
                this.intervaltime = 4;
            } else if (diffVal < 160) {
                this.intervaltime = 3;
            } else if (diffVal < 250) {
                this.intervaltime = 2;
            } else if (diffVal < 500) {
                this.intervaltime = 1;
            } else if (diffVal < 1000) {
                this.intervaltime = 0.5;
            } else if (diffVal < 2000) {
                this.intervaltime = 0.25;
            } else if (diffVal < 4000) {
                this.intervaltime = 0.125;
            } else if (diffVal < 5000) {
                this.intervaltime = 0.1;
            } else {
                this.intervaltime = 0.05;
            }
            this.run();
        },

        run: function() {
            if (!this.ismove) {
                return;
            }
            clearTimeout(this.timer);
            var b = this.direction ? this.block.offsetTop : this.block.offsetLeft;
            var isReach = false;
            if (this.flag == 'minus') {
                isReach = b > this.c ? false : true;
                b = b - 5;
            } else if (this.flag == 'add') {
                isReach = b >= this.c ? true : false;
                b = b + 5;
            }
            if (!isReach) {
                this.runTo(b);
                this.timer = setTimeout(CommFn.bind(this, this.run), this.intervaltime);//每隔5ms跑一段距离，形成平滑的滑动
            } else {
                this.runTo(this.c);
                this.ismove = true;
            }
        },

        runTo: function(val) {
            var maxVal = this.direction ? this.drag.mxBottom : this.drag.mxRight;
            if (val > maxVal) {
                return;
            }
            this.block.style[this.direction ? 'top' : 'left'] = val + 'px';
            this.move();
        },

        //内容的移动
        move: function() {
            if (this.direction) {
                this.content.scrollTop = (this.block.offsetTop - this.drag.mxTop) * this.prop;
            } else {
                this.content.scrollLeft = (this.block.offsetLeft - this.drag.mxLeft) * this.prop;
            }
        },

        stopMove: function() {
            this.ismove = false;
            clearTimeout(this.timer);
        },

        bubble: function(e) {
            CommFn.sys.IE ? (e.cancelBubble = true) : (e.stopPropagation());
        },

        stopDefault: function(e) {
            CommFn.sys.IE ? (e.returnValue = false) : (e.preventDefault());
        }
    };

    CommFn = {
        //用于判定滚动条是否在移动
        isBarMove: false,
        //浏览器判断
        sys: {
            IE: navigator.userAgent.toLowerCase().match(/msie ([\d.]+)/),
            Firefox: navigator.userAgent.toLowerCase().match(/firefox\/([\d.]+)/),
            Chrome: navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/)
        },

        //获取指定父元素下的某元素tagName
        $$: function(parent, childtag) {
            return parent.getElementsByTagName(childtag);
        },

        //添加事件
        addListener: function(element, event, fn) {
            // J.g(element).on(event,fn);
            element.addEventListener ? element.addEventListener(event, fn, false) : element.attachEvent('on' + event, fn);
        },

        removeListener: function(element, event, fn) {
            element.removeEventListener ? element.removeEventListener(event, fn, false) : element.detachEvent('on' + event, fn);
        },

        bindAsEventListener: function(context, fn) {
            return function(e) {
                return fn.call(context, e);
            }
        },

        bind: function(context, fn) {
            return function() {
                return fn.apply(context, arguments);
            }
        },

        extend: function() {
            var args = arguments, property;
            if (!args[1]) {
                args = [this, args[0]];
            }
            for (property in args[1]) {
                args[0][property] = args[1][property];
            }
            return args[0];
        },

        //获取给定元素的位置[1: left, 0: top]
        getElementPos: function(element, flag) {
            var val = 0;
            while(element != null) {
                val += element['offset' + (flag ? 'Left' : 'Top')];
                element = element.offsetParent;
            }
            return val;
        }
    }

    J.ui.Scrollbar = Scrollbar;
})();

