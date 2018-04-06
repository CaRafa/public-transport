import ExpoTHREE from 'expo-three';
import AssetUtils from 'expo-asset-utils';
import * as THREE from 'three'
require("./../util/OBJLoader")
require("./../util/MTLLoader")


export default class GooglePoly {

    constructor(apiKey){
        this.apiKey = apiKey;
    }

    obtainImage(apiKey){
        //https://poly.googleapis.com/v1/assets?
        var url = "https://poly.googleapis.com/v1/assets/0jlabhnBscv?key=AIzaSyAIugyzGEWDCzvhIRlK6WAvYHlb1dKvHbQ"        
        return fetch(url) 
            .then(function(response){return response.json();})
            .then(function(data){
             return Promise.resolve(data);   
            });
    }


    static GetThreeModel(objectData, success, failure){
        if(!success){ success = function(){};}
        if(!failure){ failure = function(){};}
        if(!objectData){ failure("objectData is null"); return;}

        //search for a format
        var format = objectData.formats.find(format => {return format.formatType == "OBJ"; });
        if(format === undefined){ failure("no format found"); return;}

        //search for a resource
        var obj = format.root;
        var mtl = format.resources.find(resources => {return resources.url.endsWith("mtl");});
        var tex = format.resources.find(resources => {return resources.url.endsWith("png");});
        var path = obj.url.slice(0, obj.url.indexOf(obj.relativePath));

        // load the MTL

        var loader = new THREE.MTLLoader();
        loader.setCrossOrigin(true);
        loader.setTexturePath(path);
        loader.load(mtl.url, function(materials){
            // Load the OBJ
            loader = new THREE.OBJLoader();
            loader.setMaterials(materials);
            loader.load(obj.url, async function(object){
                // if texture apply
                if(tex !== undefined){
                    var texUri = await AssetUtils.uriAsync(tex.url);
                    var texture = new THREE.MeshBasicMaterial({ map: await ExpoTHREE.loadAsync(texUri)});
                    object.traverse((child) =>{
                            if(child instanceof THREE.Mesh){
                                child.material = texture;
                            }
                    });
                }
                // Return the object created
            
            success(object);    

            });
        
        
        });



    }


}