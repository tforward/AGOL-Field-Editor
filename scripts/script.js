"use strict";

const myApp = {};

// ======================================================================
// MAIN
// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")

  let json_data = parse_json("text_data");
  
  myApp.field_objects = get_unique_field_objs(json_data);
  myApp.field_names = Object.keys(myApp.field_objects);

  add_elem_to("content", true);

  create_widget();
  create_btn();
}

// ======================================================================
// Data Input
// ======================================================================

function parse_json(data){
	const text_data = document.getElementById(data).value
	return JSON.parse(text_data)
}

function get_unique_field_objs(json_data) {
    const field_names_set = new Set();
    const field_objs = json_data.layers
        .reduce((field_obj, lyr) => {
            // Gets a unique field object for each field by fieldname
            // fieldName = object
            lyr.popupInfo.fieldInfos.forEach(field => {
                if (field_names_set.has(field.fieldName) == false){
                    field_names_set.add(field.fieldName);
                    field_obj[field.fieldName] = (field)
                }
            })
      return field_obj
    }, {});
  return field_objs
}

// ======================================================================
// Add Elements
// ======================================================================




function create_widget(){
    myApp.Widget = {
      init: function(){
        this.id = null;
        this.elem = null;
        return this
      },
      builder: function(parent){
        parent.appendChild(this.elem);
      },
    }
  }


function btn_factory(){
    const Button = Object.create(myApp.Widget);
  
    Button.setup = function(id){
        this.init();
        this.id = id;
        this.elem = document.createElement("btn");
    }
    
    Button.define = function(data){
        this.elem.innerText = data
    }

    Button.build = function(parent){
        this.builder(parent);
    }
    return Button
}

function create_btn(){
    let parent = document.getElementById("testing");
    
    let btn1 = Object.create(btn_factory());
    let btn2 = Object.create(btn_factory());
    
    btn1.setup("fieldname3");
    btn1.define("test7");
    btn1.build(parent);

    btn2.setup("fieldname9");
    btn2.define("test9");
    btn2.build(parent);
    
    console.log(btn1.id)
    console.log(btn2.id)
}





// ======================================================================
// Event Listeners
// ======================================================================


// ======================================================================
// Functions
// ======================================================================



// ======================================================================
// Onload fuction alt. to JQuery ready method.
myApp.initApplication = function(){
  console.log("App Loaded.\n");
  myApp.main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? myApp.initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================