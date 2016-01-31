var CameraNode = function(tModel){
	this.cNode = this.cNode(tModel);
}

CameraNode.prototype = {
	
	cNode : (function(tModel){
		
		var PI_OVER_TWO = 3.14 / 2;
		var PI = 3.14;
		var TWO_PI = 3.14 * 2;
		
		var nodeType = 1;
		var isActive = false;
		
		var cameraTarget = vec3.fromValues(0, 0, 0);
		var cameraPosition = vec3.create();
		var cameraUp = vec3.fromValues(0, 1, 0);
		
		var targetModel = tModel;
		var targetModelPosition;
		
		var z = vec3.create();
		var x = vec3.create();
		var y = vec3.create();
		
		var cameraMatrix = mat4.create();
		
		var theta = 0;
		var rho = 5;
		var phi = 3.14 / 4;
		
		var inputEngine;
		
		function _update(t){		
			
			_createCameraMatrix();	
		}
		
		function _createCameraMatrix(){

			vec3.subtract(z, cameraPosition, cameraTarget);
			vec3.normalize(z, z);
			
			vec3.cross(x, cameraUp, z);
			vec3.normalize(x, x);
			
			vec3.cross(y, z, x);
			
			cameraMatrix[0] = x[0];
			cameraMatrix[1] = y[0];
			cameraMatrix[2] = z[0];
			cameraMatrix[3] = 0;
			cameraMatrix[4] = x[1];
			cameraMatrix[5] = y[1];
			cameraMatrix[6] = z[1];
			cameraMatrix[7] = 0;
			cameraMatrix[8] = x[2];
			cameraMatrix[9] = y[2];
			cameraMatrix[10] = z[2];
			cameraMatrix[11] = 0;
			cameraMatrix[12] = -vec3.dot(x, cameraPosition);
			cameraMatrix[13] = -vec3.dot(y, cameraPosition);
			cameraMatrix[14] = -vec3.dot(z, cameraPosition);
			cameraMatrix[15] = 1;
		}
		
		function _getNodeType(){
			return nodeType;
		}
		
		function _getCameraMatrix(){
			return cameraMatrix;
		}
		
		function _getIsActive(){
			return isActive;
		}
		
		function _setIsActive(bool){
			isActive = bool;
		}
		
		function _setInputEngine(iEngine){
			inputEngine = iEngine;
		}
        
        function _setCameras(target, position, up){
            cameraTarget = target;
            cameraPosition = position;
            cameraUp = up;
        }
        
        function _getCameraComponents(){
            return { position:cameraPosition, target:cameraTarget, up:cameraUp };
        }
		
		//Public API
		return {
			update: _update,
			getNodeType: _getNodeType,
			getCameraMatrix: _getCameraMatrix,
			getIsActive: _getIsActive,
			setIsActive: _setIsActive,
			setInputEngine: _setInputEngine,
            setCameras: _setCameras,
            getCameraComponents: _getCameraComponents
		}		
	}),
	
	update: function(){
		this.cNode.update();
	},
	
	getNodeType: function(){
		return this.cNode.getNodeType();
	},
	
	getCameraMatrix: function(){
		return this.cNode.getCameraMatrix();
	},

	getIsActive: function(){
		return this.cNode.getIsActive();
	},
	
	setIsActive: function(bool){
		this.cNode.setIsActive(bool);
	},
	
	setInputEngine: function(iEngine){
		this.cNode.setInputEngine(iEngine);
	},
    
    setCameras: function(target, position, up){
        this.cNode.setCameras(target, position, up);
    },
    
    getCameraComponents: function(){
        return this.cNode.getCameraComponents();
    }
}