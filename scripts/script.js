"use strict";

// This JS file uses the OOLO Design Pattern, see link below for more info:
// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md

const myApp = {};

// ======================================================================
// Main
// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")

  let json_data = parse_json("text_data");
  
  myApp.field_objects = get_unique_field_objs(json_data);
  myApp.field_names = Object.keys(myApp.field_objects);

  WidgetShell();

  let fields = add_fields("content");

  add_btns(fields);

  //console.log(fields)
}

// ======================================================================
// Process Data
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
// Add elments
// ======================================================================

function WidgetShell(){
    // Test this with the other style to see how it works again let widget
    myApp.Widget = {
      init: function(id, elm){
        this.id = id;
        this.elm = elm;
        return this
      },
      addTo: function(parent){
        parent.appendChild(this.elm);
      },
    }
  }


function FieldDelegator(){
    const field = Object.create(myApp.Widget)

    field.setup = function(id){
        this.init(id, document.createElement("div"));
        this.elm.className = "aligner-div";
        return this
    },
    field.define = function(){
        this.elm.innerHTML = null;
    },
    field.addBtnPanel = function(){
        this.BtnPanel = document.createElement("div");
        this.BtnPanel.className = "btn_panel";
        this.elm.appendChild(this.BtnPanel);
    },
    field.builder = function(parent){
        this.addTo(parent);
    }
    return field
}


function add_fields(elm_id){
    const parent = document.getElementById(elm_id);
    const fields = [];

    myApp.field_names.forEach(fieldname => {
        let field = Object.create(FieldDelegator());
        field.setup(fieldname);
        field.elm.innerHTML = "<label class='lbl_class'>" + fieldname + "</label>";
        field.addTo(parent);
        field.addBtnPanel();
        fields.push(field); 
        }
    );
    return fields
}

function BtnDelegator(){
    const Button = Object.create(myApp.Widget);
  
    Button.setup = function(id){
        this.init(id, document.createElement("btn"));
        return this
    },
    Button.define = function(){
        this.elm.name = null;
        this.elm.toggle = 0;
        this.elm.className = null;
    },
    Button.builder = function(parent){
        this.addTo(parent);
    }
    return Button
}

function ImageDelegator(){
    const Image = Object.create(myApp.Widget);

    Image.setup = function(id){
        this.init(id, document.createElement("img"));
        this.elm.width = 20;
        this.elm.height = 20; 
        return this
    },
    Image.define = function(){
        this.elm.src = "#";
        this.elm.alt = null;
        this.elm.title = null;
    },
    Image.builder = function(parent){
        this.addTo(parent)
    }
    return Image
}

function add_btns(fields){
    fields.forEach(field => {
        let fragment = document.createDocumentFragment();
        fragment = add_btn(field, "Edit Label", "images/label.png", "Edit Label", fragment);
        fragment = add_btn(field, "Visible", "images/light_on.svg", "Visible", fragment);
        fragment = add_btn(field, "Separator On", "images/comma_on.png", "Separator On", fragment);
        fragment = add_btn(field, "Date", "images/date.png", "Date", fragment);
        fragment = add_btn(field, "Digit", "images/decimal.png", "Digit", fragment);
        field.BtnPanel.appendChild(fragment);
    });
    return fields
}

function add_btn(field, title, src, alt, fragment){
    const btn = Object.create(BtnDelegator());
    const img = Object.create(ImageDelegator());

    btn.setup(field.id);
    btn.elm.className = "test"

    img.setup(field.id);
    img.elm.title = title;
    img.elm.src = src;
    img.elm.alt = alt;
    img.addTo(btn.elm);

    fragment.appendChild(btn.elm)
    return fragment
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

myApp.initApplication = function(){
  console.log("App Loaded.\n");
  myApp.main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? myApp.initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================