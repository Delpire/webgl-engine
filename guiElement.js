var GuiElement = function(textureName, position, width, height){

    this.api = this.init(textureName, position, width, height);
}

GuiElement.prototype.init = function(textureName, position, width, height){
    
    var _textureName = textureName;
    var _textureBuffer;
    var _textureCoordinatesBuffer;
    var _vertexBuffer;
    var _indexBuffer;
    var _textureIndex;
    
    var _position = position;
    var _height = height;
    var _width = width;
    
    function _createVerticies(){
               
        var verticies = [];
        
        // Push top left corner.
        verticies.push(0);
        verticies.push(0);
        verticies.push(0);
        
        // Push top right corner.
        verticies.push(width / 2);
        verticies.push(0);
        verticies.push(0);
        
        // Push bottom left corner.
        verticies.push(0);
        verticies.push(-height);
        verticies.push(0);
        
        // Push bottom right corner.
        verticies.push(width / 2);
        verticies.push(-height);
        verticies.push(0);
        
        console.log(verticies);
        
        return verticies;
    
    }
    
    //Public API
    return {
        // Public Properties.
        VertexBuffer: _vertexBuffer,
        TextureBuffer: _textureBuffer,
        TextureCoordinatesBuffer: _textureCoordinatesBuffer,
        TextureName: _textureName,
        TextureIndex: _textureIndex,
        IndexBuffer: _indexBuffer,
        Position: _position,
        
        // Public Methods.
        createVerticies: _createVerticies,
    }	

};