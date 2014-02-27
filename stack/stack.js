function Stack(result){
    if(this instanceof Stack)
    var stack = {};
    function step(stepName,handler){
        this['stepName'] = handler;
    }
    function task(taskName){
        stack[taskName] = []
        stack[taskName].step = step;
        stack[taskName].run = stepRun;
        return stack[taskName];
    }
    function pend(){
        this['onResult'] = taskOnResult;
    }
    function taskOnResult(){

    }
    function stepRun (){
        var para ;
        for(var i in this){
            para = this[i](para);
        }
    }
    function done(){

    }

    /**
     * when need excute [task1,task2],then excute fn
     * @param fn_arr [task,task2]
     * @param fn when excute task1 and task2
     */
    function run(fn_arr,fn){
        for(var i in stack){
            setTimeout(stack[i],0);
        }
    }
    return {
        task:task,
        run:run
    }


}