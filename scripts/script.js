"use strict";

// This JS file uses the OOLO Design Pattern, see link below for more info:
// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md

// TODO

// Set defaults for button's on load


let myApp = FieldApp();

function FieldApp(){
    let App = {
        init: function(fieldObjects){
        this.fieldObjects = fieldObjects;
        this.fieldnames = Object.keys(fieldObjects);
        return this
      },
      elems: function(fields){
        this.fields = fields;
        return this
      },
    };
    return App
}

// ======================================================================
// Main
// ======================================================================

function Main(){
  const json_data = parse_json("text_data");
  const fieldObjects = get_unique_field_objs(json_data);
  myApp.init(fieldObjects);

  myApp.fields = add_fields("content");
  myApp.fields = add_btns(myApp.fields);
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
// Delegators
// ======================================================================

function Widget(){
    let WidgetShell = {
      init: function(fieldname, elem){
        this.fieldname = fieldname;
        this.elem = elem;
        return this
      },
      addTo: function(parent){
        parent.appendChild(this.elem);
      }
    }
    return WidgetShell
  }

function FieldDelegator(){
    const field = Object.create(Widget());

    field.setup = function(fieldname){
        this.init(fieldname, document.createElement("div"));
        this.elem.className = "aligner-field";
        this.obj = null;
        return this
    };
    field.define = function(){
        this.elem.innerHTML = null;
        return this
    };
    field.CreateLabel = function(){
        this.labelDiv = document.createElement("div");
        this.labelDiv.className = "field";
        this.label = document.createElement("label");
        this.label.className = "field_label";
        this.label.textContent = this.obj.label;
        this.label.title = `Fieldname: ${this.fieldname}`;
        this.labelDiv.appendChild(this.label);
        this.elem.appendChild(this.labelDiv);
        return this
    };
    field.CreateInput = function(){
        this.input = document.createElement("input");
        this.input.type = "text";
        this.input.id = "active_text_input";
        this.input.className = "inputFieldname";
        this.input.title = "Repress Button or hit enter to set";
        //this.input.autofocus = true;
        this.input.value = this.obj.label;
        this.input.addEventListener("keyup", submitLabel.bind(this));
        this.labelDiv.appendChild(this.input);
        return this
    };
    field.Panel = function(){
        this.panel = document.createElement("div");
        this.panel.className = "btn_panel";
        this.panel.toggle = 0;
        this.elem.appendChild(this.panel);
        return this
    };
    field.Btns = function(btn){
        this.btns = addBtns(this.btns, btn)
        return this
    };
    field.Dropdown = function(){
        this.dropdown = document.createElement("div");
        this.dropdown.className = "dropdown";
        this.content = document.createElement("div");
        this.content.className = "dropdown-content hidden"
        this.dropdown.appendChild(this.content);
        this.dropdown.toggle = 0;
        this.panel.appendChild(this.dropdown);
        return this
    };
    field.setDropdownContent = function(contents){
        // REWORK? It maybe better to add elem once than just display:none?
        while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
        }
        this.content.className = "dropdown-content";
        this.content.appendChild(contents);
        return this
    }
    return field
}

function BtnDelegator(){
    const Button = Object.create(Widget());
  
    Button.setup = function(field){
        this.init(field.fieldname, document.createElement("btn"));
        this.elem.addEventListener("click", this.onClick.bind(this, field));
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
    Button.onClick = function(field) {
        this.elem.toggle ^= 1;
        btnAction(this.elem, field);
    };
    return Button
}

function ImageDelegator(){
    const Image = Object.create(Widget());

    Image.setup = function(fieldname){
        this.init(fieldname, document.createElement("img"));
        this.elem.width = 20;
        this.elem.height = 20; 
        return this
    };
    Image.define = function(){
        this.elem.src = "#";
        this.elem.alt = null;
        this.elem.title = null;
    };
    return Image
}

// ======================================================================
// Field Buttons
// ======================================================================

function btnAction(btn, field){
    // TODO need to build-out redo the filters
    {
    //btn.panel.toggle ^= 1;
    
    switch(btn.btnName){
        case "Label":
            //TO enable this
            showLabel(btn, field);
            setLabel(field);
            btnLabelStyle(btn);
            break;
        case "Visiblity":
            setVisiblity(field.obj);
            btnVisibilityStyle(btn);
            break;
        case "Seperator":
            setSeperator(field.obj);
            btnSeparatorStyle(field, btn);
            break;
        case "Date":
            if (field.obj.format !== null && field.obj.format.hasOwnProperty("dateFormat")){
                let content = dateContent(field, btn);
                field.setDropdownContent(content);
            }
            dateDropdown(field, btn);
            btnDateStyle(field, btn);
            break;
        case "Digit":
            if (field.obj.format !== null && field.obj.format.hasOwnProperty("digitSeparator")){
                let content = digitContent(field, btn);
                field.setDropdownContent(content);
            }
            digitDropdown(field, btn);
            btnDecimStyle(field, btn);
            break;
        default:
            console.log("btnAction case not found: ", btn.btnName)
    }
    }
}

function add_fields(elem_id){
    // TODO CAN USE FRAGEMENT HERE
    const parent = document.getElementById(elem_id);
    const fields = [];

    myApp.fieldnames.forEach(fieldname => {
        let field = Object.create(FieldDelegator());
        field.setup(fieldname);
        field.obj = myApp.fieldObjects[fieldname];
        //field.elem.innerHTML = "<label class='lbl_class'>" + field.obj.label + "</label>";
        field.CreateLabel();
        field.addTo(parent);
        field.Panel();
        fields.push(field); 
        }
    );
    return fields
}

function addBtns(btns, btn){
    if (btns == null) {
        btns = [];
    }
    btns.push(btn)
    return btns
}

function add_btns(fields){
    fields.forEach(field => {
        let fragment = document.createDocumentFragment();
        fragment = add_btn(field, "Edit Label", "images/label.png", "Edit Label", "Label", fragment);
        fragment = add_btn(field, "Visible", "images/light_on.svg", "Visible", "Visiblity", fragment);
        fragment = add_btn(field, "Separator On", "images/comma_on.png", "Separator On", "Seperator", fragment);
        fragment = add_btn(field, "Date", "images/date.png", "Date", "Date", fragment);
        fragment = add_btn(field, "Digit", "images/decimal.png", "Digit", "Digit", fragment);
        field.panel.appendChild(fragment);
        field.Dropdown();
    });
    return fields
}

function add_btn(field, title, src, alt, name, fragment){
    const btn = Object.create(BtnDelegator());
    const img = Object.create(ImageDelegator());

    btn.setup(field);
    btn.define()
    // This way below will show-up in the DOM directly
    //btn.elem.setAttribute("name", name)
    btn.elem.parent = field;
    btn.elem.panel = field.panel;
    btn.elem.className = name;
    btn.elem.btnName = name;
    img.setup(field.fieldname);
    img.elem.title = title;
    img.elem.src = src;
    img.elem.alt = alt;
    img.addTo(btn.elem);

    field.Btns(btn)
    fragment.appendChild(btn.elem)
    return fragment
}

// ======================================================================
// Label Button
// ======================================================================


function showLabel(btn, field){
    if (btn.toggle === 1){
        if ( !field.input ){
            field.CreateInput();
        }
        field.label.className = "hidden";
        field.input.className = "field_input";
        field.input.focus();
    }
    else{
        field.input.className = "hidden";
        field.label.className = "field_label";
    }
}

function setLabel(field){
    field.obj.label = field.input.value;
    field.label.textContent = field.input.value;
}

function btnLabelStyle(btn){
    const imgNode = btn.firstElementChild;

    if (btn.toggle == 0){
        imgNode.src = "images/label.png";
        imgNode.alt, imgNode.title = "Edit Label";
        imgNode.className = null;
    }
    else{
        imgNode.src = "images/set_label.png";
        imgNode.alt, imgNode.title = "Set Label";
    }
}

function submitLabel(event){ 
    // If "Enter" is hit ie. 13
    if (event.keyCode === 13){
        this.obj.label = this.input.value
        this.label.textContent = this.input.value;
        this.input.className = "hidden";
        this.label.className = "field_label"
        this.btns[0].elem.toggle = 0;
        btnLabelStyle(this.btns[0].elem)
    }
}

// ======================================================================
// Visible Button
// ======================================================================

function btnVisibilityStyle(elem){
    const imgNode = elem.firstElementChild;
    imgNode.src = elem.toggle ^1 ? "images/light_on.svg" : "images/light_off.svg";
    imgNode.alt = elem.toggle ^1 ? "Visible" : "Hidden" ;
    imgNode.title = elem.toggle ^1 ? "Visible" : "Hidden" ;
}

// ======================================================================
// Seperator Button
// ======================================================================

function btnSeparatorStyle(field, btn){
    const imgNode = btn.firstElementChild;

    if (field.obj.format !== null && field.obj.format.hasOwnProperty("digitSeparator")){
        imgNode.src = !field.obj.format["digitSeparator"] === false ? "images/comma_off.png" : "images/comma_on.png";
        imgNode.alt, imgNode.title =  !field.obj.format["digitSeparator"] === false ? "Separator Off" : "Separator On";
    }
    else{
        imgNode.src = "images/comma_na.png";
        imgNode.alt, imgNode.title =  "N/A"
        imgNode.className = "notApplicable";
    }
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

function dateContent(field, btn){
    const content = document.createElement("div");
    let fragment = document.createDocumentFragment();
    content.className = "dropdown-contentDate";
    const date_arr = dateArray();
    date_arr.forEach(data => {
        let a = document.createElement("a");
        a.textContent = data[1]; // text
        a.dataset.value = data[0]; // value;
        a.title = data[0] // tooltip
        a.addEventListener("click", setAndStyleDate.bind(null, field, data[0], btn));
        fragment.appendChild(a);
    });
    content.appendChild(fragment);
    return content
}

function dateDropdown(field, elem){
    if (field.obj.format !== null && field.obj.format.hasOwnProperty("dateFormat")){
        if (elem.toggle === 1){
            field.dropdown.className = "dropdown";

            let anchors = field.dropdown.getElementsByTagName("a");
            let date_type = field.obj.format["dateFormat"];
            let index = find_attribute_value(anchors, date_type);
            anchors[index].id = "date_selected";
        }
        else{
            field.dropdown.className = "hidden";
        }
    }
}

function btnDateStyle(field, elem){
    const imgNode = elem.firstElementChild;
    const date = ["shortDate", "shortDateLE", "longMonthDayYear", "dayShortMonthYear",
    "longDate", "longMonthYear", "shortMonthYear", "year"];

    const dateTime = ["shortDateLongTime", "shortDateLELongTime", "shortDateShortTime",
    "shortDateLEShortTime", "shortDateShortTime24", "shortDateLEShortTime24",
     "shortDateShortTime24", "shortDateLEShortTime24"];

    if (field.obj.format !== null && field.obj.format.hasOwnProperty("dateFormat")){
        const d = field.obj.format["dateFormat"];

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

function setAndStyleDate(field, dateType, btn){
    setDate(field, dateType)
    btn.toggle = 0;
    dateDropdown(field, btn);
    btnDateStyle(field, btn)
}

// ======================================================================
//  Digit Button
// ======================================================================

function digitContent(field, parentbtn){
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
    input.value = field.obj.format["places"];

    btn.innerText = "Set";
    btn.className = "button center"
    btn.addEventListener("click", digitSetBtn.bind(null, field, input, parentbtn));

    fragment.appendChild(pTag);
    fragment.appendChild(input);
    fragment.appendChild(btn);

    content_div.appendChild(fragment);
    return content_div
}

function digitDropdown(field, btn){
    if (field.obj.format !== null && field.obj.format.hasOwnProperty("digitSeparator")){
        if (btn.toggle === 1){
            field.dropdown.className = "dropdown";
        }
        else{
            field.dropdown.className += " hidden";
        }
    }
}

function btnDecimStyle(field, elem){
    const imgNode = elem.firstElementChild;
    if (field.obj.format !== null && field.obj.format.hasOwnProperty("places")){
        const decimals = field.obj.format["places"];
        imgNode.src = "images/decimal.png";
        imgNode.alt, imgNode.title =  'Has ' + decimals + ' Decimal(s)';
    }
    else{
        imgNode.src = "images/na.png";
        imgNode.alt, imgNode.title =  "N/A";
        imgNode.className = "notApplicable";
    }
}


function digitSetBtn(field, input, parentbtn){
    setDigit(field.obj, input.value);
    field.dropdown.className += " hidden";
    parentbtn.toggle = 0;
    btnDecimStyle(field, parentbtn);
}

// ======================================================================
//  Set Functions
// ======================================================================

function setVisiblity(fieldObj){
    fieldObj.visible = !fieldObj.visible;
}

function setSeperator(fieldObj){
    if (fieldObj.format !== null && fieldObj.format.hasOwnProperty("digitSeparator")){
        fieldObj.format.digitSeparator = !fieldObj.format.digitSeparator;
    }
}

function setDate(field, dateType){
    field.obj.format.dateFormat = dateType;
}

function setDigit(fieldObj, value){
    fieldObj.format.places = value;
}


// ======================================================================
//  Utility Functions
// ======================================================================

function find_attribute_value(collection, attr_value){
    // Returns the index position of the first element that is a match within parent element
    for (let i = 0; i < collection.length; i++){
        if (collection[i].dataset.value === attr_value){
            return i
        }
    }
    // Return -1 means not found
    return -1
}

// ======================================================================
//  On-Load Handle
// ======================================================================

function initApplication(readyState){
  Main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================