"use strict";

const myApp = {};

// ======================================================================
// Main
// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")

  let json_data = parse_json("text_data");
  
  myApp.field_objects = get_unique_field_objs(json_data);
  myApp.field_names = Object.keys(myApp.field_objects);

  widget_shell();

  const fields = add_fields("content");

  //console.log(fields)
  
  add_btns(fields);

  test()
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
        this.init();
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

function Btn_Factory(){
    const Button = Object.create(myApp.Widget);
  
    Button.setup = function(id){
        this.init();
        this.id = id;
        this.elem = document.createElement("btn");
        this.width = 20;
        this.height = 20;    
    },
    Button.define = function(){
        this.elem.innerText = null;
        this.toggle = 0;
        this.className = null;
    },
    Button.builder = function(parent){
        this.addTo(parent);
    }
    return Button
}

function Image_Factory(){
    const Image = Object.create(myApp.Widget);

    Image.setup = function(){
        this.init();
        this.elem = document.createElement("img");
        this.elem.width = 20;
        this.elem.height = 20; 
    },
    Image.define = function(){
        this.elem.src = "#";
        this.elem.alt = null;
        this.elem.title = null;
    },
    Image.builder = function(parent){
        this.addTo(parent)
    }
    return Image
}

function add_btns(fields){
    console.log(fields)
    fields.forEach(field => {
        //const parent = field.BtnPanel;
        let fragment = document.createDocumentFragment();
        fragment = add_btn(field, "Edit Label", "images/label.png", "Edit Label", fragment);
        fragment = add_btn(field, "Visible", "images/light_on.svg", "Visible", fragment);
        fragment = add_btn(field, "Separator On", "images/comma_on.png", "Separator On", fragment);
        fragment = add_btn(field, "Date", "images/date.png", "Date", fragment);
        fragment = add_btn(field, "Digit", "images/decimal.png", "Digit", fragment);
        field.BtnPanel.appendChild(fragment);
    });
}

function add_btn(field, title, src, alt, fragment){
    const btn = Object.create(Btn_Factory());
    const img = Object.create(Image_Factory());

    btn.setup(field.id);
    btn.define();

    img.setup();
    img.elem.title = title;
    img.elem.src = src;
    img.elem.alt = alt;
    img.addTo(btn.elem);

    fragment.appendChild(btn.elem)
    return fragment
}


function Test_Factory(){
    const Test = Object.create(field_factory());

    Test.setup2 = function(){
        this.init();
        this.elem = document.createElement("img");
    },
    Test.define2 = function(){
        this.test = null
    },
    Test.builder2 = function(parent){
        this.addTo(parent)
    }
    return Test
}

function test(){
    const test = Object.create(Test_Factory());

    test.setup();
    console.log(test.elem)

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