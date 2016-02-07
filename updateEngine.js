var UpdateEngine = function(){}

UpdateEngine.prototype = {
	
	uEngine : (function(){
		
		var sceneGraph;
        var playerList = [];
		
		function _update(){
            
            for(var player of playerList){
                player.api.update();
            }
            
			sceneGraph.update();
		}
		
		function _setSceneGraph(graph){
			sceneGraph = graph;
		}
        
        function _addPlayer(player){
            playerList.push(player);
        }
		
		//Public API
		return {
			update: _update,
			setSceneGraph: _setSceneGraph,
            addPlayer: _addPlayer
		}
		
		
	})(),

	update: function(){
		this.uEngine.update()
	},
	
	setSceneGraph: function(graph){
		this.uEngine.setSceneGraph(graph)
	},
    
    addPlayer: function(player){
        this.uEngine.addPlayer(player);
    }
	
}