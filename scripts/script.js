"use strict";

// This JS file uses the OOLO Design Pattern, see link below for more info:
// https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md

let myApp = FieldApp();

function FieldApp(){
    let App = {
        init: function(fieldObj){
        this.fieldObj = fieldObj;
        this.fieldnames = Object.keys(fieldObj);
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

  console.log(myApp.fields)

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
        return this
    };
    field.define = function(){
        this.elem.innerHTML = null;
        return this
    };
    field.Panel = function(){
        this.panel = document.createElement("div");
        this.panel.className = "btn_panel";
        this.panel.toggle = 0;
        this.elem.appendChild(this.panel);
        return this
    };
    field.btnArray = function(btn){
        this.btns = addBtnArray(this.btns, btn)
        return this
    }
    return field
}

function addBtnArray(btns, btn){
    if (btns == null) {
        btns = [];
    }
    btns.push(btn)
    return btns
}


function add_fields(elem_id){
    // TODO CAN USE FRAGEMENT HERE
    const parent = document.getElementById(elem_id);
    const fields = [];

    myApp.fieldnames.forEach(fieldname => {
        let field = Object.create(FieldDelegator());
        field.setup(fieldname);
        field.elem.innerHTML = "<label class='lbl_class'>" + fieldname + "</label>";
        field.addTo(parent);
        field.Panel();
        fields.push(field); 
        }
    );
    return fields
}

function BtnDelegator(){
    const Button = Object.create(Widget());
  
    Button.setup = function(fieldname){
        this.init(fieldname, document.createElement("btn"));
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
    Button.onClick = function() {
        this.elem.toggle ^= 1;
        btnAction(this.fieldname, this.elem);
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

function add_btns(fields){
    fields.forEach(field => {
        let fragment = document.createDocumentFragment();
        fragment = add_btn(field, "Edit Label", "images/label.png", "Edit Label", "Label", fragment);
        fragment = add_btn(field, "Visible", "images/light_on.svg", "Visible", "Visiblity", fragment);
        fragment = add_btn(field, "Separator On", "images/comma_on.png", "Separator On", "Seperator", fragment);
        fragment = add_btn(field, "Date", "images/date.png", "Date", "Date", fragment);
        fragment = add_btn(field, "Digit", "images/decimal.png", "Digit", "Digit", fragment);
        field.panel.appendChild(fragment);
    });
    return fields
}

function add_btn(field, title, src, alt, className, fragment){
    const btn = Object.create(BtnDelegator());
    const img = Object.create(ImageDelegator());

    btn.setup(field.fieldname);
    btn.define()
    // This way below will show-up in the DOM directly
    //btn.elem.setAttribute("name", name)
    btn.elem.parent = field;
    btn.elem.panel = field.panel;
    btn.elem.className = className;
    img.setup(field.fieldname);
    img.elem.title = title;
    img.elem.src = src;
    img.elem.alt = alt;
    img.addTo(btn.elem);

    field.btnArray(btn)
    fragment.appendChild(btn.elem)
    return fragment
}

function DropdownDelegator(){
    const dropdown = Object.create(Widget())

    dropdown.setup = function(fieldname){
        this.init(fieldname, document.createElement("div"));
        this.elem.className = "dropdown";
        return this
    }
    dropdown.addContent = function(func){
        const content = func()
        this.elem.parent = null
        this.elem.appendChild(content)
    }
    return dropdown
}

function addDropdown(id, parent, prop, func, dropdown){
    const field_obj = myApp.fieldObj[id];
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

function addDropdown2(fieldname, parent, prop, func){
    const field_obj = myApp.fieldObj[fieldname];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty(prop)){
        let dropdown = Object.create(DropdownDelegator());
        dropdown.setup(fieldname);
        dropdown.addContent(func);
        dropdown.elem.parent = parent
        dropdown.addTo(parent);
        return dropdown
    }
}

function digitDropdown(fieldname, btn){
    const field_obj = myApp.fieldObj[fieldname];
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

function btnAction(fieldname, btn){
    //console.log(id + " " + elem.name + " " + elem.toggle)

    // TODO need to build-out redo the filters
    {
    const field_obj = myApp.fieldObj[fieldname];

    console.log(myApp.fieldObj[fieldname])

    btn.panel.toggle ^= 1;
    console.log(btn.panel.toggle)
    
    switch(btn.name){
        case "Label":
            //TO enable this
            btnLabelStyle(btn)
            break;
        case "Visiblity":
            setVisiblity(fieldname);
            btnVisibilityStyle(btn);
            break;
        case "Seperator":
            setSeperator(fieldname);
            btnSeparatorStyle(fieldname, btn);
            break;
        case "Date":
            if (btn.getElementsByClassName("dropdown")[0] === undefined){
                btn.dropdown = addDropdown(fieldname, btn.panel, "dateFormat", dateContent.bind(null, fieldname));
            }
            dateDropdown(fieldname, btn);
            btnDateStyle(fieldname, btn);
            break;
        case "Digit":
            const decimals = field_obj.format["places"];
            const panel = btn.parent.BtnPanel
            let dropdown = panel.getElementsByClassName("dropdown")[0]
            //TODO Need to make the digit content be set to hidden as well along with the panel
            
            if (dropdown === undefined){
                btn.dropdown = addDropdown2(fieldname, panel, "digitSeparator", digitContent.bind(null, fieldname, decimals, btn));
            }

            digitDropdown(fieldname, btn)
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

function digitContent(fieldname, decimals, parentbtn){
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
    btn.addEventListener("click", digitSetBtn.bind(null, fieldname, input, parentbtn));

    fragment.appendChild(pTag);
    fragment.appendChild(input);
    fragment.appendChild(btn);

    content_div.appendChild(fragment);
    return content_div
}

function digitSetBtn(fieldname, input, parentbtn){
    setDigit(fieldname, input.value);
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


function dateContent(fieldname){
    const content_div = document.createElement("div");
    let fragment = document.createDocumentFragment();
    const date_arr = dateArray();
    content_div.className = "dropdown-content";
    date_arr.forEach(data => {
        let a = document.createElement("a");
        a.textContent = data[1]; // text
        a.dataset.value = data[0]; // value;
        a.title = data[0] // tooltip
        a.addEventListener("click", setDate.bind(null, data[0], fieldname));
        fragment.appendChild(a);
    });
    content_div.appendChild(fragment);
    return content_div
}

function dateDropdown(fieldname, elem){
    const field_obj = myApp.fieldObj[fieldname];
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

function setVisiblity(fieldname){
    const field_obj = myApp.fieldObj[fieldname];
    console.log(fieldname);
    field_obj.visible = !field_obj.visible;
}

function setSeperator(fieldname){
    const field_obj = myApp.fieldObj[fieldname];
    if (field_obj.format !== null && field_obj.format.hasOwnProperty("digitSeparator")){
        field_obj.format.digitSeparator = !field_obj.format.digitSeparator;
    }
}

function setDate(dateType, fieldname){
    const field_obj = myApp.fieldObj[fieldname];
    field_obj.format.dateFormat = dateType;
}

function setDigit(fieldname, value){
    const field_obj = myApp.fieldObj[fieldname];
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

function btnSeparatorStyle(fieldname, elem){
    const imgNode = elem.firstElementChild;
    const field_obj = myApp.fieldObj[fieldname];

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

function btnDateStyle(fieldnameid, elem){
    const imgNode = elem.firstElementChild;
    const field_obj = myApp.fieldObj[fieldname];
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

function btnDecimStyle(fieldname, elem){
    const field_obj = myApp.fieldObj[fieldname];
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

function initApplication(readyState){
  Main();
};

  // Handler when the DOM is fully loaded
document.onreadystatechange = function () {
    document.readyState === "complete" ? initApplication(document.readyState) : console.log("Loading...");
}

// ======================================================================