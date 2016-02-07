var InputEngine = function(){
	
}

InputEngine.prototype = {
	
	iEngine : (function(){
		
		document.onkeydown = _handleKeyDown; 
		document.onkeyup = _handleKeyUp;
		document.onmousewheel = _handleMouseWheel;
        document.onmousemove = _handleMouseMove;
        document.onmousedown = _handleMouseDown;
        document.onpointerlockchange = _handlePointerLockChange;
		
		var keyStates = [];
		var mouseWheelState = 0;
        var mouseDeltas = { dx:0, dy:0 };
        
        var previousX;
        var previousY;
        
        var locked = false;
		
		//TODO: Convert keystates by browser.
		function _handleKeyDown(event){
			keyStates[event.keyCode] = true;
		}
		
		function _handleKeyUp(event){
			keyStates[event.keyCode] = false;
		}
		
		//TODO: Find out how and where to reset this to zero?
		function _handleMouseWheel(event){
			
			if(event.wheelDelta > 0)
				mouseWheelState = event.wheelDelta / 100;
			else
				mouseWheelState = event.wheelDelta / 100;
			
		}
        
        function _handlePointerLockChange(event){
            locked = !locked;
            
            mouseDeltas.dx = 0;
            mouseDeltas.dy = 0;
        }
        
        function _handleMouseMove(event){
            
            if(locked){
                mouseDeltas.dx = event.movementX;
                mouseDeltas.dy = event.movementY;
            }
            else{
                mouseDeltas.dx = 0;
                mouseDeltas.dy = 0;
            }    
        }
		
        function _handleMouseDown(event){
            
            if(!locked){
                var canvas = document.getElementById("canvas");

                canvas.requestPointerLock = canvas.requestPointerLock ||
                                            canvas.mozRequestPointerLock ||
                                            canvas.webkitRequestPointerLock;

                canvas.requestPointerLock();
            }

        }
        
		function _getKeyStates(){
			return keyStates;
		}
		
		function _getMouseWheelState(){
			var state = mouseWheelState;
			mouseWheelState = 0;
			return state;
		}
        
        function _getMouseDelta(){
            var dx = mouseDeltas.dx;
            var dy = mouseDeltas.dy;
            mouseDeltas.dx = 0;
            mouseDeltas.dy = 0;
            return {dx:dx, dy:dy};
        }
		
		//Public API
		return {
			getKeyStates: _getKeyStates,
			getMouseWheelState: _getMouseWheelState,
            getMouseDelta: _getMouseDelta,
		}
		
		
	})(),
	
	getKeyStates: function(){
		return this.iEngine.getKeyStates();
	},
	
	getMouseWheelState: function(){
		return this.iEngine.getMouseWheelState();
	},
    
    getMouseDelta: function(){
        return this.iEngine.getMouseDelta();
    }

}