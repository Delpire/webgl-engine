var PointLightNode = function(position, color){
    this.lNode = this.lNode(position, color);
}

PointLightNode.prototype = {
	
	lNode : (function(position, color){
		
		var _position = position;
		var _color = color;
        var nodeType = 2;
		
		function _update(){

		}
        
        function _getLightRenderData(buffer){
            
            buffer.push({position:_position, color:_color});
            
            return buffer;
        }
        
        function _getNodeType(){
			return nodeType;
		}
		
		//Public API
		return {
			update: _update,
            getLightRenderData: _getLightRenderData,
            getNodeType: _getNodeType,
		}
		
		
	}),

	update: function(){
		this.lNode.update()
	},
    
    getLightRenderData: function(buffer){
        this.lNode.getLightRenderData(buffer);
    },
    
    getNodeType: function(){
        return this.lNode.getNodeType();
    }
	
}