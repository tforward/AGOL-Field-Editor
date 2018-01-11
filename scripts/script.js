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

  widget_shell();

  const fields = add_fields("content");

  //console.log(fields)
  
  add_btn(fields);
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

function widget_shell(){
    myApp.Widget = {
      init: function(){
        this.id = null;
        this.elem = null;
        return this
      },
      addTo: function(parent){
        parent.appendChild(this.elem);
      },
    }
  }


function field_factory(){
    const field = Object.create(myApp.Widget)

    field.setup = function(id){
        this.id = id;
        this.elem = document.createElement("div");
        this.elem.className = "aligner-div";
    },
    field.define = function(){
        this.elem.innerHTML = null;
    },
    field.addBtnPanel = function(){
        this.BtnPanel = document.createElement("div");
        this.BtnPanel.className = "btn_panel";
        //this.add_span = document.createElement("span");
        this.elem.appendChild(this.BtnPanel);
    },
    field.builder = function(parent){
        this.addTo(parent);
    }
    return field
}


function add_fields(elem_id){
    const parent = document.getElementById(elem_id);
    const fields = [];

    myApp.field_names.forEach(fieldname => {
        let field = Object.create(field_factory());
        field.setup(fieldname);
        field.elem.innerHTML = "<label class='lbl_class'>" + fieldname + "</label>";
        field.addTo(parent);
        field.addBtnPanel();
        fields.push(field); 
        }
    );
    return fields
}

function btn_factory(){
    const Button = Object.create(myApp.Widget);
  
    Button.setup = function(id){
        this.init();
        this.id = id;
        this.elem = document.createElement("btn");
        this.width = 20;
        this.height = 20;
    },
    Button.define = function(data){
        this.elem.innerText = data
    },
    Button.builder = function(parent){
        this.addTo(parent);
    }
    return Button
}


function add_btn(fields){
    fields.forEach(field => {
        const parent = field.BtnPanel;
        let btn = Object.create(btn_factory());
        btn.setup("fieldname");
        btn.define("test");
        btn.addTo(parent);
    });

    //const parent = document.getElementsByClassName("btn_panel")[0];
    //console.log(btn1.id)
}


// ======================================================================
// Event Listeners
// ======================================================================





// ======================================================================
// Functions
// ======================================================================




// ======================================================================
// On-Load Handle
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