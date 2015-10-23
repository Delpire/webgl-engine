var InputEngine = function(){
	
}

InputEngine.prototype = {
	
	iEngine : (function(){
		
		document.onkeydown = _handleKeyDown; 
		document.onkeyup = _handleKeyUp;
		document.onmousewheel = _handleMouseWheel;
		
		var keyStates = [];
		var mouseWheelState = 0;
		
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
		
		function _getKeyStates(){
			return keyStates;
		}
		
		function _getMouseWheelState(){
			var state = mouseWheelState;
			mouseWheelState = 0;
			return state;
		}
		
		//Public API
		return {
			getKeyStates: _getKeyStates,
			getMouseWheelState: _getMouseWheelState
		}
		
		
	})(),
	
	getKeyStates: function(){
		return this.iEngine.getKeyStates();
	},
	
	getMouseWheelState: function(){
		return this.iEngine.getMouseWheelState();
	}

}