"use strict";

// This JS file uses the OOLO Design Pattern, see link below for more info:
// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md

// Create a empty object with no __proto__
const myApp = Object.create(null);



// ======================================================================
// Main
// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")

  let json_data = parse_json("text_data");
  
  myApp.field_objects = get_unique_field_objs(json_data);
  myApp.field_names = Object.keys(myApp.field_objects);

  //let widget = WidgetShell();

  let fields = add_fields("content");

  fields = add_btns(fields);

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
// Add elements
// ======================================================================

function WidgetShell(){
    // Test this with the other style to see how it works again let widget
    let Widget = {
      init: function(id, elem){
        this.id = id;
        this.elem = elem;
        this.name = null;
        return this
      },
      addTo: function(parent){
        parent.appendChild(this.elem);
      }
    }
    return Widget
  }


function FieldDelegator(){
    const field = Object.create(WidgetShell())

    field.setup = function(id){
        this.init(id, document.createElement("div"));
        this.elem.className = "aligner-field";
        return this
    };
    field.define = function(){
        this.elem.innerHTML = null;
    };
    field.addBtnPanel = function(){
        this.BtnPanel = document.createElement("div");
        this.BtnPanel.className = "btn_panel";
        this.BtnPanel.toggle = 0;
        this.elem.appendChild(this.BtnPanel);
    };
    field.builder = function(parent){
        this.addTo(parent);
    };
    return field
}


function add_fields(elem_id){
    const parent = document.getElementById(elem_id);
    const fields = [];

    myApp.field_names.forEach(fieldname => {
        let field = Object.create(FieldDelegator());
        field.setup(fieldname);
        field.elem.innerHTML = "<label class='lbl_class'>" + fieldname + "</label>";
        field.addTo(parent);
        field.addBtnPanel();
        fields.push(field); 
        }
    );
    return fields
}

function BtnDelegator(){
    const Button = Object.create(WidgetShell());
  
    Button.setup = function(id){
        this.init(id, document.createElement("btn"));
        this.elem.addEventListener("click", this.onClick.bind(this));
        return this
    };
    Button.define = function(){
        this.elem.toggle = 0;
        this.elem.value = null;
        this.elem.className = null;
        this.elem.parent = null;
        this.elem.panel = null;
        this.elem.dropdown = null;
    };
    Button.builder = function(parent){
        this.addTo(parent);
    };
    Button.onClick = function() {
        this.elem.toggle ^= 1;
        btnAction(this.id, this.elem);
    };
    return Button
}

function ImageDelegator(){
    const Image = Object.create(WidgetShell());

    Image.setup = function(id){
        this.init(id, document.createElement("img"));
        this.elem.width = 20;
        this.elem.height = 20; 
        return this
    };
    Image.define = function(){
        this.elem.src = "#";
        this.elem.alt = null;
        this.elem.title = null;
    };
    Image.builder = function(parent){
        this.addTo(parent)
    };
    return Image
}

function add_btns(fields){
    fields.forEach(field => {
        let fragment = document.createDocumentFragment();
        fragment = add_btn(field, "Edit Label", "images/label.png", "Edit Label", "Label", fragment);
        fragment = add_btn(field, "Visible", "images/light_on.svg", "Visible", "Visiblity", fragment);
        fragment = add_btn(field, "Separator On", "images/comma_on.png", "Separator On", "Seperator", fragment);
        fragment = add_btn(field, "Date", "images/date.png", "Date", "Date", fragment);
        fragment = add_btn(field, "Digit", "images/decimal.png", "Digit", "Digit", fragment);
        field.BtnPanel.appendChild(fragment);
    });
    return fields
}

function add_btn(field, title, src, alt, name, fragment){
    const btn = Object.create(BtnDelegator());
    const img = Object.create(ImageDelegator());

    btn.setup(field.id);
    btn.define()
    // This way below will show-up in the DOM directly
    //btn.elem.setAttribute("name", name)
    btn.elem.parent = field;
    btn.elem.panel = field.BtnPanel;
    btn.elem.name = name;
    img.setup(field.id);
    img.elem.title = title;
    img.elem.src = src;
    img.elem.alt = alt;
    img.addTo(btn.elem);

    fragment.appendChild(btn.elem)
    return fragment
}

function DropdownDelegator(){
    const dropdown = Object.create(WidgetShell())

    dropdown.setup = function(id){
        this.init(id, document.createElement("div"));
        this.elem.className = "dropdown";
        return this
    }
    dropdown.addContent = function(func){
        const content = func()
        this.elem.parent = null
        this.elem.appendChild(content)
    }
    dropdown.builder = function(parent){
        this.addTo(parent)
    }
    return dropdown
}

function addDropdown(id, parent, prop, func, dropdown){
    const field_obj = myApp.field_objects[id];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty(prop)){
        if (parent.toggle === 1){
            // If the Digit Dropdown does not exist for this element, create it.
            if (dropdown === undefined){
                let dropdown = Object.create(DropdownDelegator());
                dropdown.setup(id);
                dropdown.addContent(func);
                dropdown.addTo(parent);
                return dropdown
            }
        }
    }
}

function addDropdown2(id, parent, prop, func){
    const field_obj = myApp.field_objects[id];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty(prop)){
        let dropdown = Object.create(DropdownDelegator());
        dropdown.setup(id);
        dropdown.addContent(func);
        dropdown.elem.parent = parent
        dropdown.addTo(parent);
        return dropdown
    }
}

function digitDropdown(id, btn){
    const field_obj = myApp.field_objects[id];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        let dropdown = btn.parent.BtnPanel.getElementsByClassName("dropdown")[0];

        if (btn.toggle === 1){
            dropdown.className = "dropdown";
        }
        else{
            dropdown.className += " hidden";
        }
    }
}

// ======================================================================
// Logic Functions
// ======================================================================

function btnAction(id, btn){
    //console.log(id + " " + elem.name + " " + elem.toggle)

    // TODO need to build-out redo the filters
    {
    const field_obj = myApp.field_objects[id];

    btn.panel.toggle ^= 1;
    console.log(btn.panel.toggle)
    
    switch(btn.name){
        case "Label":
            //TO enable this
            btnLabelStyle(btn)
            break;
        case "Visiblity":
            setVisiblity(id);
            btnVisibilityStyle(btn);
            break;
        case "Seperator":
            setSeperator(id);
            btnSeparatorStyle(id, btn);
            break;
        case "Date":
            if (btn.getElementsByClassName("dropdown")[0] === undefined){
                btn.dropdown = addDropdown(id, btn.panel, "dateFormat", dateContent.bind(null, id));
            }
            dateDropdown(id, btn);
            btnDateStyle(id, btn);
            break;
        case "Digit":
            const decimals = field_obj.format["places"];
            const panel = btn.parent.BtnPanel
            let dropdown = panel.getElementsByClassName("dropdown")[0]
            //TODO Need to make the digit content be set to hidden as well along with the panel
            
            if (dropdown === undefined){
                btn.dropdown = addDropdown2(id, panel, "digitSeparator", digitContent.bind(null, id, decimals, btn));
            }

            digitDropdown(id, btn)
            //btnDecimStyle(id, elem);
            break;
        default:
            console.log("btnAction case not found: ", btn.name)
    }
    }
}

// ======================================================================
//  Digit Button
// ======================================================================

function digitContent(id, decimals, parentbtn){
    const content_div = document.createElement("div");
    const pTag = document.createElement("p");
    let fragment = document.createDocumentFragment();
    const input = document.createElement("input");
    const btn = document.createElement("btn")
   
    content_div.className = "dropdown-contentDigit";
    pTag.innerText = "Decimals: ";

    input.type = "number";
    input.className = "smInput";
    input.autofocus = "autofocus";
    input.value = decimals;

    btn.innerText = "Set";
    btn.className = "button center"
    btn.addEventListener("click", digitSetBtn.bind(null, id, input, parentbtn));

    fragment.appendChild(pTag);
    fragment.appendChild(input);
    fragment.appendChild(btn);

    content_div.appendChild(fragment);
    return content_div
}

function digitSetBtn(id, input, parentbtn){
    setDigit(id, input.value);
    parentbtn.dropdown.elem.className += " hidden";
    parentbtn.toggle = 0;
}

// ======================================================================
//  Date Button
// ======================================================================

function dateArray(){
    return [
        ["year", "1997"],
        ["shortMonthYear",	"Dec 1997"],
        ["longMonthYear",	"December 1997"],
        ["shortDate", "12/21/1997"],
        ["shortDateLE", "21/12/1997"],
        ["dayShortMonthYear", "21 Dec 1997"],
        ["longMonthDayYear", "December 21,1997"],
        ["longDate",	"Sunday, December 21, 1997"],
        ["shortDateShortTime",	"12/21/1997 6:00 PM"],
        ["shortDateLEShortTime",	"21/12/1997 6:00 PM"],
        ["shortDateLongTime", "12/21/1997 6:00:00 PM"],
        ["shortDateLELongTime",	"21/12/1997 6:00:00 PM"],
        ["shortDateShortTime24",	"12/21/1997 18:00"],
        ["shortDateLEShortTime24",	"21/12/1997 18:00"],
    ]
}


function dateContent(id){
    const content_div = document.createElement("div");
    let fragment = document.createDocumentFragment();
    const date_arr = dateArray();
    content_div.className = "dropdown-content";
    date_arr.forEach(data => {
        let a = document.createElement("a");
        a.textContent = data[1]; // text
        a.dataset.value = data[0]; // value;
        a.title = data[0] // tooltip
        a.addEventListener("click", setDate.bind(null, data[0], id));
        fragment.appendChild(a);
    });
    content_div.appendChild(fragment);
    return content_div
}

function dateDropdown(id, elem){
    const field_obj = myApp.field_objects[id];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("dateFormat")){
        let dropdown = elem.getElementsByClassName("dropdown")[0];

        if (elem.toggle === 1){
            dropdown.className = "dropdown";

            let anchors = dropdown.getElementsByTagName("a");
            let date_type = field_obj.format["dateFormat"];
            let index = find_attribute_value(anchors, date_type);
            anchors[index].id = "date_selected";
        }
        else{
            dropdown.className = "hidden";
        }
    }
}

// ======================================================================
//  Set Functions
// ======================================================================

function setVisiblity(id){
    const field_obj = myApp.field_objects[id];
    field_obj.visible = !field_obj.visible;
}

function setSeperator(id){
    const field_obj = myApp.field_objects[id];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        field_obj.format.digitSeparator = !field_obj.format.digitSeparator;
    }
}

function setDate(dateType, id){
    const field_obj = myApp.field_objects[id];
    field_obj.format.dateFormat = dateType;
}

function setDigit(id, value){
    const field_obj = myApp.field_objects[id];
    field_obj.format.places = value;
}


// ======================================================================
//  Utility Functions
// ======================================================================

function find_attribute_value(collection, attr_value){
    // Returns the Index position of an element that is a match within parent element
    for (let i = 0; i < collection.length; i++){
        if (collection[i].dataset.value === attr_value){
            return i
        }
    }
    // Return -1 is nothing found
    return -1
}

// ======================================================================
//  Style Functions
// ======================================================================

function btnLabelStyle(elem){
    const imgNode = elem.firstElementChild;

    if (elem.toggle == 0){
        imgNode.src = "images/label.png";
        imgNode.alt, imgNode.title = "Edit Label";
        imgNode.className = null;
    }
    else{
        imgNode.src = "images/set_label.png";
        imgNode.alt, imgNode.title = "Set Label";
    }
}

function btnVisibilityStyle(elem){
    const imgNode = elem.firstElementChild;
    imgNode.src = elem.toggle ^1 ? "images/light_on.svg" : "images/light_off.svg";
    imgNode.alt = elem.toggle ^1 ? "Visible" : "Hidden" ;
    imgNode.title = elem.toggle ^1 ? "Visible" : "Hidden" ;
}

function btnSeparatorStyle(id, elem){
    const imgNode = elem.firstElementChild;
    const field_obj = myApp.field_objects[id];

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        imgNode.src = !field_obj.format["digitSeparator"] === false ? "images/comma_off.png" : "images/comma_on.png";
        imgNode.alt, imgNode.title =  !field_obj.format["digitSeparator"] === false ? "Separator Off" : "Separator On";
    }
    else{
        imgNode.src = "images/comma_na.png";
        imgNode.alt, imgNode.title =  "N/A"
        imgNode.className = "notApplicable";
    }
}

function btnDateStyle(id, elem){
    const imgNode = elem.firstElementChild;
    const field_obj = myApp.field_objects[id];
    const date = ["shortDate", "shortDateLE", "longMonthDayYear", "dayShortMonthYear",
    "longDate", "longMonthYear", "shortMonthYear", "year"];

    const dateTime = ["shortDateLongTime", "shortDateLELongTime", "shortDateShortTime",
    "shortDateLEShortTime", "shortDateShortTime24", "shortDateLEShortTime24",
     "shortDateShortTime24", "shortDateLEShortTime24"];

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("dateFormat")){
        const d = field_obj.format["dateFormat"];

        if (dateTime.indexOf(d) > -1){
            imgNode.src = "images/dateTime.png";
            imgNode.alt, imgNode.title =  d;
        }
        else if(date.indexOf(d) > -1){
            imgNode.src = "images/date.png";
            imgNode.alt, imgNode.title =  d;
        }
    }
    else{
        imgNode.src = "images/date_na.png";
        imgNode.alt, imgNode.title =  "N/A";
        imgNode.className = "notApplicable";
    }
}

function btnDecimStyle(id, elem){
    const field_obj = myApp.field_objects[id];
    const imgNode = elem.firstElementChild;

    if (field_obj.format !== null && field_obj.format.hasOwnProperty("places")){
        const decimals = field_obj.format["places"];
        imgNode.src = "images/decimal.png";
        imgNode.alt, imgNode.title =  'Has ' + decimals + ' Decimal(s)';
    }
    else{
        imgNode.src = "images/na.png";
        imgNode.alt, imgNode.title =  "N/A"
        imgNode.className = "notApplicable";
    }
}

// ======================================================================
//  On-Load Handle
// ======================================================================

myApp.initApplication = function(){
  //console.log("App Loaded.\n");
  myApp.main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? myApp.initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================