var Player = function(inputEngine, model){

    this.api = this.init(inputEngine, model);
    this.api.createCameras();
}

Player.prototype.init = function(inputEngine, model){
		
        var PI_OVER_TWO = 3.14 / 2;
        var TWO_PI = 3.14 * 2;
        var PI = 3.14
        
        var model;
        var modelPosition;
        var modelRotation;
        var modelScale;
        var height = 2;
        var velocity = 0.02;
        
        var canvas = document.getElementById("canvas");
        
        var fpsCamera;
        var thirdPersonCamera;
        var freeCamera;
        
        var upVector = vec3.fromValues(0, 1, 0);
         
        var rotationSpeed = 0.02;
        
        var inputEngine
        
        var _theta;
		
        function _createCameras(){
            modelPosition = model.getPosition();
            _createFpsCamera();
            _createThirdPersonCamera();
            _createFreeCamera();
        }
        
        function _createFpsCamera(){
            
            model.setWillRender(false);
            
            var phi = 0;
            var rho = 1;
            _theta = 0;
            
            fpsCamera = new CameraNode(model);
            fpsCamera.setIsActive(true);
            
            fpsCamera.setSphericalCoordinates(rho, phi, _theta);
            
            var a = Math.cos(phi);
			
			var xt = a * Math.sin(_theta) + modelPosition[0];
			var yt = Math.sin(phi) + modelPosition[1] + height;
			var zt = a * Math.cos(_theta) + modelPosition[2];
                
            var target = vec3.fromValues(xt, yt, zt);  
            var position = vec3.fromValues(modelPosition[0], modelPosition[1] + height, modelPosition[2]);
            
            fpsCamera.setCameras(target, position, upVector);
            
        }
        
        function _createThirdPersonCamera(){
            thirdPersonCamera = new CameraNode(model);
            
            var phi = PI_OVER_TWO / 2;
            var rho = 15;
            _theta = 0;
            
            thirdPersonCamera.setSphericalCoordinates(rho, phi, _theta);
			
            var a = rho * Math.cos(phi);
            
			var x = a * Math.sin(_theta) + modelPosition[0];
			var y = rho * Math.sin(phi) + modelPosition[1];
			var z = a * Math.cos(_theta) + modelPosition[2];
            
            var target = vec3.fromValues(modelPosition[0], modelPosition[1], modelPosition[2]);
            var position = vec3.fromValues(x, y, z);
		
            thirdPersonCamera.setCameras(target, position, upVector);
        }
        
        function _createFreeCamera(){
            freeCamera = new CameraNode(model);
            
            var phi = 0;
            var rho = 1;
            var _theta = 0;
            
            var a = Math.cos(phi);
			
			var xt = a * Math.sin(_theta) + modelPosition[0];
			var yt = Math.sin(phi) + modelPosition[1] + height;
			var zt = a * Math.cos(_theta) + modelPosition[2];
                
            var target = vec3.fromValues(xt, yt, zt);      
            var position = vec3.fromValues(modelPosition[0], modelPosition[1] + height, modelPosition[2]);
            
            freeCamera.setCameras(target, position, upVector);
            freeCamera.setSphericalCoordinates(rho, phi, _theta);
        }
        
        function _getCameras(){
            return { fps:fpsCamera, thirdPerson:thirdPersonCamera, free:freeCamera };
        }
        
        function _clampTheta(theta){
            if(theta > TWO_PI){           
                theta = theta - TWO_PI;
            }      
            else if(theta < 0){
                theta = TWO_PI + theta;
            }
            
            return theta;
        }
        
        function _clampPhiFps(phi){
            if(phi > PI_OVER_TWO)	
                    phi = PI_OVER_TWO;
                    
            if(phi < -PI_OVER_TWO)
                phi = -PI_OVER_TWO;
                
            return phi;
        }
        
        function _clampPhiThirdPerson(phi){
            if(phi > PI_OVER_TWO)	
                    phi = PI_OVER_TWO;
                    
            if(phi < 0)
                phi = 0;
                
            return phi;
        }
        
		function _update(){

            modelPosition = model.getPosition();
            modelRotation = model.getRotation();
            modelScale = model.getScale();

            var keyStates = inputEngine.getKeyStates();

            // 1 - fps
            // 2 - third person
            // 3 - free
            if(keyStates[49] == true){
                
                if(!fpsCamera.getIsActive() && !freeCamera.getIsActive()){
                    console.log(_theta);
                    _theta = _clampTheta(_theta - PI);    
                    console.log(_theta);
                }
                           
                model.setWillRender(false);
                fpsCamera.setIsActive(true);
                thirdPersonCamera.setIsActive(false);
                freeCamera.setIsActive(false);
            }
            else if(keyStates[50] == true){
                
                if(!thirdPersonCamera.getIsActive() && !freeCamera.getIsActive()){
                    console.log(_theta);
                    _theta = _clampTheta(_theta + PI);
                    console.log(_theta);    
                }
                   
                model.setWillRender(true);
                fpsCamera.setIsActive(false);
                thirdPersonCamera.setIsActive(true);
                freeCamera.setIsActive(false);
            }
            else if(keyStates[51] == true){      
                model.setWillRender(true);  
                fpsCamera.setIsActive(false);
                thirdPersonCamera.setIsActive(false);
                freeCamera.setIsActive(true);
            }
            
            if(fpsCamera.getIsActive()){
                _updateFirstPersonCamera();
            }
            else if(thirdPersonCamera.getIsActive()){
                _updateThirdPersonCamera();
            }
            else if(freeCamera.getIsActive()){
                _updateFreeCamera();
            }
   
        }
        
        function _updateFirstPersonCamera(){
            
            // Get the spherical coordinates of the camera.
            var sphericalCoordinates = fpsCamera.getSphericalCoordinates();
            var phi = sphericalCoordinates.phi;
            //var theta = sphericalCoordinates.theta;
            
            // Get the mouse and keyboard inputs.
            var keyStates = inputEngine.getKeyStates();
            var mouseDelta = inputEngine.getMouseDelta();
            
            // Change theta based on how much the mouse has moved left or right.
            if(!isNaN(mouseDelta.dx) && Math.abs(mouseDelta.dx) > 0.8){
                _theta = _theta + rotationSpeed * mouseDelta.dx;
                _theta = _clampTheta(_theta);
            }
            
            // Change phi based on how much the mouse has moved up or down.
            if(!isNaN(mouseDelta.dy) && Math.abs(mouseDelta.dy) > 0.8){
                phi = phi - rotationSpeed * mouseDelta.dy;
                phi = _clampPhiFps(phi);
            }
            
            // Calculate the direction vector.
            // This vector represents the direction the camera is facing.
            var a = Math.cos(phi);
            var xd = Math.cos(_theta);
            var yd = Math.sin(phi);
            var zd = Math.sin(_theta);
            
            model.setTransform(modelPosition[0], modelPosition[1], modelPosition[2],
                    modelRotation[0], _theta, modelRotation[2],
                    modelScale[0], modelScale[1], modelScale[2]);
            
            // W = 87
            // A = 65
            // S = 83
            // D = 68
            if(keyStates[87] == true){    
                model.addTransform(0.25 * xd, 0, 0.25 * zd, 0, 0, 0, 0, 0, 0);
                console.log(phi);
            }
            if(keyStates[65] == true){ 
                model.addTransform(0.25 * zd, 0, 0.25 * -xd, 0, 0, 0, 0, 0, 0);
            }
            if(keyStates[83] == true){
                model.addTransform(0.25 * -xd, 0, 0.25 * -zd, 0, 0, 0, 0, 0, 0);
            }
            if(keyStates[68] == true){
                model.addTransform(0.25 * -zd, 0, 0.25 * xd, 0, 0, 0, 0, 0, 0);
            }
              
            // Calculate the camera target and camera position.
            var target = vec3.fromValues((a * xd) + modelPosition[0], yd + modelPosition[1] + height, (a* zd) + modelPosition[2]);    
            var position = vec3.fromValues(modelPosition[0], modelPosition[1] + height, modelPosition[2]);
		
            // Update the camera's target, position, up vector, and spherical coordinates.
            fpsCamera.setCameras(target, position, upVector);
            fpsCamera.setSphericalCoordinates(1.0, phi, _theta);
        }
		
        function _updateThirdPersonCamera(){        
            
            // Get the spherical coordinates of the camera.
            var sphericalCoordinates = thirdPersonCamera.getSphericalCoordinates();
            var rho = sphericalCoordinates.rho;
            var phi = sphericalCoordinates.phi;
            //var theta = sphericalCoordinates.theta;
            
            // Get the mouse and keyboard inputs.
            var keyStates = inputEngine.getKeyStates();
            var mouseDelta = inputEngine.getMouseDelta();
            
            // Change theta based on how much the mouse has moved left or right.
            if(!isNaN(mouseDelta.dx) && Math.abs(mouseDelta.dx) > 0.8){
                _theta = _theta - rotationSpeed * mouseDelta.dx;
                _theta = _clampTheta(_theta);
            }
            
            // Change phi based on how much the mouse has moved up or down.
            if(!isNaN(mouseDelta.dy) && Math.abs(mouseDelta.dy) > 0.8){
                phi = phi - rotationSpeed * mouseDelta.dy;
                phi = _clampPhiThirdPerson(phi);
            }
            
            // Calculate the direction vector.
            // This vector represents the direction the camera is facing.
            var a = Math.cos(phi);
            var xd = Math.sin(_theta);
            var yd = Math.sin(phi);
            var zd = Math.cos(_theta);
            
            model.setTransform(modelPosition[0], modelPosition[1], modelPosition[2],
                    modelRotation[0], _theta, modelRotation[2],
                    modelScale[0], modelScale[1], modelScale[2]);
            
            // W = 87
            // A = 65
            // S = 83
            // D = 68
            if(keyStates[87] == true){    
                model.addTransform(0.25 * -xd, 0, 0.25 * -zd, 0, 0, 0, 0, 0, 0);
            }
            if(keyStates[65] == true){
                model.addTransform(0.25 * -zd, 0, 0.25 * xd, 0, 0, 0, 0, 0, 0);    
            }
            if(keyStates[83] == true){
                model.addTransform(0.25 * xd, 0, 0.25 * zd, 0, 0, 0, 0, 0, 0);
                
            }
            if(keyStates[68] == true){
                model.addTransform(0.25 * zd, 0, 0.25 * -xd, 0, 0, 0, 0, 0, 0);    
            }  
            
            var a = rho * Math.cos(phi);
            
			var x = a * Math.sin(_theta) + modelPosition[0];
			var y = rho * Math.sin(phi) + modelPosition[1];
			var z = a * Math.cos(_theta) + modelPosition[2];
            
            var target = vec3.fromValues(modelPosition[0], modelPosition[1], modelPosition[2]);
            var position = vec3.fromValues(x, y, z);
		
            // Update the camera's target, position, up vector, and spherical coordinates.
            thirdPersonCamera.setCameras(target, position, upVector);
            thirdPersonCamera.setSphericalCoordinates(rho, phi, _theta);
        }
        
        function _updateFreeCamera(){
            
            // Get the spherical coordinates of the camera.
            var sphericalCoordinates = freeCamera.getSphericalCoordinates();
            var cameraComponents = freeCamera.getCameraComponents();
            var phi = sphericalCoordinates.phi;
            var theta = sphericalCoordinates.theta;
            
            var x = cameraComponents.position[0];
            var y = cameraComponents.position[1];
            var z = cameraComponents.position[2]; 
            
            // Get the mouse and keyboard inputs.
            var keyStates = inputEngine.getKeyStates();
            var mouseDelta = inputEngine.getMouseDelta();
            
            // Change theta based on how much the mouse has moved left or right.
            if(!isNaN(mouseDelta.dx) && Math.abs(mouseDelta.dx) > 0.8){
                _theta = _theta + rotationSpeed * mouseDelta.dx;
                _theta = _clampTheta(_theta);
            }
            
            // Change phi based on how much the mouse has moved up or down.
            if(!isNaN(mouseDelta.dy) && Math.abs(mouseDelta.dy) > 0.8){
                phi = phi - rotationSpeed * mouseDelta.dy;
                phi = _clampPhiFps(phi);
            }
            
            // Calculate the direction vector.
            // This vector represents the direction the camera is facing.
            var a = Math.cos(phi);
            var xd = Math.cos(_theta);
            var yd = Math.sin(phi);
            var zd = Math.sin(_theta); 
            
            // W = 87
            // A = 65
            // S = 83
            // D = 68
            if(keyStates[87] == true){
                x += 0.25 * a * xd; 
                y += 0.25 * yd;
                z += 0.25 * a * zd;    
            }
            if(keyStates[65] == true){
                x += 0.25 * zd; 
                z += 0.25 * -xd;   
            }
            if(keyStates[83] == true){
                x += 0.25 * a * -xd; 
                y += 0.25 * -yd;
                z += 0.25 * a * -zd;
            }
            if(keyStates[68] == true){
                x += 0.25 * -zd; 
                z += 0.25 * xd;     
            }   
              
            // Calculate the camera target and camera position.
            var target = vec3.fromValues((a * xd) + x, yd + y, (a * zd) + z);    
            var position = vec3.fromValues(x, y, z);
		
            // Update the camera's target, position, up vector, and spherical coordinates.
            freeCamera.setCameras(target, position, upVector);
            freeCamera.setSphericalCoordinates(1.0, phi, _theta);
            
        }
        
        
		//Public API
		return {
            createCameras: _createCameras,
            getCameras: _getCameras,
			update: _update,
		}	
};
