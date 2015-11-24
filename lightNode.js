var LightNode = function(){}

LightNode.prototype = {
	
	lNode : (function(){
		
		var position = [0.0, 1.0, 1.0, 1.0];
		var color = [1.0, 1.0, 1.0, 1.0];
		
		function _update(){
			
		}
		
		//Public API
		return {
			update: _update,
		}
		
		
	})(),

	update: function(){
		this.uEngine.update()
	},
	
}