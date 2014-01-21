"use strict";

function handleLoadedObject(data, gl, objVertexTextureCoordBuffer) {
    var lines = data.split("\n");
    
    var vertexCount = [];
    var vertexPositions = [];
    var vertexTextureCoords = [];
	var vX = [];
	var vY = [];
	var vZ = [];
	var vtX = [];
	var vtY = [];
	var vCount = 0;
	var vtCount = 0;
	
	for(var i=0; i<lines.length; i++){
		var vals = lines[i].split(" ");
		
		if(vals[0] == 'usemtl' && vals[1] != 'FrontColor'){
			allTex.push(vals[1]);
			
			if(uniqueTextures.length == 0){ 
				uniqueTextures.push(vals[1]); 
			}else{
				var isUnique = true;
				for(var a=0; a<uniqueTextures.length; a++){
					//alert(vals[1]+' - '+allTex[a]);
					if(vals[1] == uniqueTextures[a]){
						isUnique = false;
					}
				}
				if(isUnique == true){
					uniqueTextures.push(vals[1]);
				}
			}
		}
		if(vals[0] == 'v'){
			vX[vCount] = vals[1];
			vY[vCount] = vals[2];
			vZ[vCount] = vals[3];
			
			vCount++;
		}
		if(vals[0] == 'vt'){
			vtX[vtCount] = vals[1];
			vtY[vtCount] = vals[2];
			
			vtCount++;
		}
	}
	
	for(var i=0; i<lines.length; i++){
		var vals = lines[i].split(" ");
		if(vals[0] == 'usemtl' && vals[1] != 'FrontColor'){
			allTexCount++;
			allTexLength.push(0);
		}
		if(vals[0] == 'f'){
			for(var ii=1; ii<vals.length; ii++){
				var val = vals[ii].split("/");
				
				for(var iii=0; iii<uniqueTextures.length; iii++){
					if(allTex[allTexCount] == uniqueTextures[iii]){
						if(typeof vertexPositions[iii] == "undefined"){
							vertexPositions[iii] = [];
							vertexTextureCoords[iii] = [];
							vertexCount[iii] = 0;
						}
						vertexPositions[iii].push(parseFloat(vX[(val[0]-1)]));
						vertexPositions[iii].push(parseFloat(vY[(val[0]-1)]));
						vertexPositions[iii].push(parseFloat(vZ[(val[0]-1)]));
					
						vertexTextureCoords[iii].push(parseFloat(vtX[(val[1]-1)]));
                		vertexTextureCoords[iii].push(parseFloat(vtY[(val[1]-1)]));
						
						vertexCount[iii] += 1;
					}
				}
				
				allTexLength[(allTexLength.length-1)]++;
			}
		}
	}
	
	//Create all buffers
	for(var i=0; i<uniqueTextures.length; i++){
        objVertexPositionBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, objVertexPositionBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions[i]), gl.STATIC_DRAW);
        objVertexPositionBuffer[i].itemSize = 3;
        objVertexPositionBuffer[i].numItems = vertexCount[i];

        objVertexTextureCoordBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, objVertexTextureCoordBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords[i]), gl.STATIC_DRAW);
        objVertexTextureCoordBuffer[i].itemSize = 2;
        objVertexTextureCoordBuffer[i].numItems = vertexCount[i];
	}
	
	var vertice_continue = []; 
	var slices = [];
	
	var start = 0;
	var end = 0;
	for(var i = 0; i < vertexPositions.length; ++i)
	{
		for(var j = 0; j < vertexPositions[i].length; j++)
			vertice_continue.push(vertexPositions[i][j]);
		
		slices[i] = new Object();
		slices[i].start = start;
		slices[i].end = end + vertexPositions[i].length;
		
		start = end + vertexPositions[i].length;
		end = start;
	}
	
	var rv = new Object();
	rv.slices = slices;
	rv.vertice_continue = vertice_continue
	
	return rv;
}