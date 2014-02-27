/**
 * Created by lunjiang on 14-2-18.
 */
J= {};
(function(){
    function fireEvent_DOM(element, eventName, memo, bubble) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, bubble, true);
        event.eventName = eventName;
        event.data = memo;
        element.dispatchEvent(event);
        return event;
    }

    function fireEvent_IE(element, eventName, memo, bubble) {
        var event = document.createEventObject();
        event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';

        event.eventName = eventName;
        event.memo = memo;

        element.fireEvent(event.eventType, event);
        return event;
    }
    function fire(element, eventName, memo, bubble){
       return document.createEvent ? fireEvent_DOM(element, eventName, memo, bubble):fireEvent_IE(element, eventName, memo, bubble);
    }

    function on(elm,type,handler){
        if(document.addEventListener){
            elm.addEventListener(type,handler)
        }else{
   //         alert(14444)
            elm.attachEvent('on'+type,handler);
        }
    }

    J.on = on;
    J.fire = fire;
})(J);