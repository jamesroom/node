;(function(){
    var UNAMED_TASK = '_UNAMED_TASK_';
    var UNAMED_STEP = '_UNAMED_STEP_';
    function Stepify(result){
        if(!(this instanceof Stepify)){
            new Stepify(result);
        }
        this._debug = false;
        this._taskSequences = [];
        this._currTask = null;
        this._handles = {};
        this._results = [];

        this._insetNames = ['debug', 'task', 'step', 'pend', 'error', 'timeout', 'result', 'run'];

        // The methods extend by user when defining workflow using step(stepName)
        this._definedNames = [];

        // Optional, will called when all tasked tasks done.
        if(util.isFunction(result)) this._finishHandle = result;

        return this;

    }
    var _proto = Stepify.prototype;

    _proto.task=function(taskName) {
        if(this._currTask) this.pend();

        var root = this;
        var index = this._taskSequences.length;
        var task;

        taskName = taskName && typeof taskName === 'string' ? taskName : UNAMED_TASK + index;
        task = new Task(taskName, this);

        task._index = index;
        task._debug = this._debug;

        if(this._debug) {console.log('Task: %s added.', taskName);}

        this._currTask = task;

        return this;
    }

    _proto.step =function (stepName, stepHandle) {
        // `task` method will be called automatically before `step` if not called manually.
        if(!this._currTask) this.task();
        // if(!this._currTask) throw new Error('The task for this step has not declared, \
        //     just call .task() before .step()');
        if(!arguments.length) return false;

        var currTask = this._currTask;
        var args = util.slice(arguments, 0);
        var stepName = args.shift();
        var _name;
        var stepHandle;
        var step;
        var find = util.find;
        var isFunction = util.isFunction;

        if(isFunction(stepName)) {
            stepHandle = stepName;
            _name = stepName = UNAMED_STEP + currTask._steps.length;
        } else {
            if(this._insetNames.indexOf(stepName)>-1) {
                return false;
            }
            stepHandle = isFunction(args[0]) ? args.shift() : null;
        }

        step = currTask._step(stepName, stepHandle, args);

        if(!stepHandle
            && stepName !== _name
            && !find(this._definedNames, function(n) {return n === stepName;})
        // can not be rewrite
        // && !isFunction(currTask._handles[stepName])
        // && !isFunction(this._handles[stepName])
            ) {
            // Modify the prototype chain dynamically,
            // add a method as `step._stepHandle` which has the same name as `step.name`
            // usage:
            // Stepify().task('foo').step('bar').bar(handle[, *args])
            // var task = Stepify().task('foo').step('bar'); task.bar = handle;
            var _stepHandle = function(handle) {
                if(typeof handle !== 'function') throw new Error('Step handle should be a function.');

                if(this._currTask) {
                    this._currTask._handles[stepName] = handle;
                } else {
                    this._handles[stepName] = handle;
                }

                return this;
            };

            Object.defineProperty(_proto, stepName, {
                // if not set configurable,
                // _proto[stepName] can not be released after workflow finish
                // see run() method
                configurable: true,
                get: function() {
                    return _stepHandle.bind(this);
                },
                set: _stepHandle.bind(this)
            });

            this._definedNames.push(stepName);
        }

        if(isFunction(stepHandle)) {
            step._task._handles[stepName] = stepHandle;
        }

        _name = null;

        return this;
    }
})();



