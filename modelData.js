var planeVertices = [
  
   -1.0, 0.0, -1.0, 
    1.0, 0.0, -1.0, 
    1.0, 0.0,  1.0, 
   -1.0, 0.0,  1.0, 
  
];

var planeVertexIndicies = [
  0, 1, 2,  0, 2, 3
];

var planeTextureCoordinates = [
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
];

var planeVertexNormals = [
   // Front
   0.0, 1.0, 0.0,
   0.0, 1.0, 0.0,
   0.0, 1.0, 0.0,
   0.0, 1.0, 0.0,
];

var cubeVertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  
  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
  
  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  
  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  
  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  
  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
];

var cubeVertexIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
];

var cubeTexture = "wood2.jpg"

var cubeTextureCoordinates = [
    // Front
    0.5,  0.0,
    1.0,  0.0,
    1.0,  0.5,
    0.5,  0.5,
    // Back
    0.0,  0.0,
    0.5,  0.0,
    0.5,  0.5,
    0.0,  0.5,
    // Top
    0.0,  0.0,
    0.5,  0.0,
    0.5,  0.5,
    0.0,  0.5,
    // Bottom
    0.0,  0.0,
    0.5,  0.0,
    0.5,  0.5,
    0.0,  0.5,
    // Right
    0.0,  0.0,
    0.5,  0.0,
    0.5,  0.5,
    0.0,  0.5,
    // Left
    0.0,  0.0,
    0.5,  0.0,
    0.5,  0.5,
    0.0,  0.5,
  ];

var cubeVertexNormals = [
  // Front
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
   0.0,  0.0,  1.0,
  
  // Back
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
   0.0,  0.0, -1.0,
  
  // Top
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
   0.0,  1.0,  0.0,
  
  // Bottom
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
   0.0, -1.0,  0.0,
  
  // Right
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
   1.0,  0.0,  0.0,
  
  // Left
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0,
  -1.0,  0.0,  0.0
];

function generateColorVertArrayFromFaces(faceArray){
  
    var colorArray = [];
  
    for(var i = 0; i < 6; i++){
      
        var color = faceArray[i];
        
        for (var j = 0; j < 4; j++){
          colorArray = colorArray.concat(color);
        }
    }
    
    return colorArray;
  
}