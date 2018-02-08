"use strict";

// This JS file:
//  - Uses the AirBnb Style Guide "mostly"...
//  - Uses the OOLO Design Pattern, see link below for more info:
//     - https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch6.md

const myApp = FieldApp();

function FieldApp() {
  const App = {
    init(fieldObjects) {
      this.fieldObjects = fieldObjects;
      this.fieldnames = Object.keys(fieldObjects);
      return this;
    },
    elems(fields) {
      this.fields = fields;
      this.activeBtn = null;
      this.activeField = null;
      return this;
    },
  };
  return App;
}

// ======================================================================
// Main
// ======================================================================

function Main() {
  const jsonData = parseJson("textData");
  const fieldObjects = getUniqueFieldObjs(jsonData);
  myApp.init(fieldObjects);
  myApp.fields = addFields("content");
  myApp.fields = addBtns(myApp.fields);

  // console.log(myApp.fields);

  applyBtnDefaults(myApp.fields);

  const triState = Object.create(TriStateBtnDelegator());
  triState.setup("triState", triVisibleAction);

  const triStateSeparator = Object.create(TriStateBtnDelegator());
  triStateSeparator.setup("triStateDigit", triDigitAction);

  const toggleDecimal = Object.create(ToggleBtnDelegator());
  toggleDecimal.setup("toggleDecimal", toggleDecimalAction);

  const toggleDate = Object.create(ToggleBtnDelegator());
  toggleDate.setup("toggleDate", toggleDateAction);

  addLabelDropdown();
  addVisibilityDropdown();
  addDateDropdown();
  addSeparatorDropdown();
}

// ======================================================================
// Filters
// ======================================================================

function filterNullsNoProp(propClass, prop) {
  myApp.fields.filter(field => (field.obj.format == null ||
    !Object.prototype.hasOwnProperty.call(field.obj.format, prop)))
    .forEach(field => field.elem.className += propClass);
}

function filterVisible(propClass, bool) {
  myApp.fields.filter(field => (field.obj.visible !== bool))
    .forEach(i => i.elem.className += propClass);
}

function filterDigit(propClass, bool) {
  myApp.fields.filter(field => (field.obj.format !== null &&
    Object.prototype.hasOwnProperty.call(field.obj.format, "digitSeparator")))
    .filter(field => field.obj.format.digitSeparator === bool)
    .forEach(field => field.elem.className += propClass);
}

// ======================================================================
// Process Data
// ======================================================================

function parseJson(data) {
  const textData = document.getElementById(data).value;
  return JSON.parse(textData);
}

function getUniqueFieldObjs(jsonData) {
  const fieldNamesSet = new Set();
  const fieldObjs = jsonData.layers
    .reduce((fieldObj, lyr) => {
      // Gets a unique field object for each field by fieldname
      // fieldName = object
      lyr.popupInfo.fieldInfos.forEach((field) => {
        if (fieldNamesSet.has(field.fieldName) === false) {
          fieldNamesSet.add(field.fieldName);
          fieldObj[field.fieldName] = (field);
        }
      });
      return fieldObj;
    }, {});
  return fieldObjs;
}

// ======================================================================
// Delegators
// ======================================================================

function Widget() {
  const WidgetShell = {
    init(fieldname, elem) {
      this.fieldname = fieldname;
      this.elem = elem;
      return this;
    },
    addTo(parent) {
      parent.appendChild(this.elem);
    },
  };
  return WidgetShell;
}

function FieldDelegator() {
  const field = Object.create(Widget());

  field.setup = function setup(fieldname) {
    this.init(fieldname, document.createElement("div"));
    this.elem.className = "aligner-field";
    this.obj = null;
    return this;
  };
  field.define = function define() {
    this.elem.innerHTML = null;
    this.activeBtn = null;
    return this;
  };
  field.CreateLabel = function CreateLabel() {
    this.labelDiv = document.createElement("div");
    this.labelDiv.className = "field";
    this.label = document.createElement("label");
    this.label.className = "field_label";
    this.label.textContent = this.obj.label;
    this.label.title = `Fieldname: ${this.fieldname}`;
    this.label.default = this.obj.label;
    this.labelDiv.appendChild(this.label);
    this.elem.appendChild(this.labelDiv);
    return this;
  };
  field.CreateInput = function CreateInput() {
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.id = "active_text_input";
    this.input.className = "inputFieldname";
    this.input.title = "Repress Button or hit enter to set";
    this.input.value = this.obj.label;
    this.input.addEventListener("keyup", submitLabel.bind(this));
    this.labelDiv.appendChild(this.input);
    return this;
  };
  field.Panel = function Panel() {
    this.panel = document.createElement("div");
    this.panel.className = "btn_panel";
    this.panel.id = null;
    this.panel.toggle = 0;
    this.elem.appendChild(this.panel);
    return this;
  };
  field.Btns = function Btns(btn) {
    this.btns = pushBtns(this.btns, btn);
    return this;
  };
  field.Dropdown = function Dropdown() {
    this.dropdown = document.createElement("div");
    this.dropdown.className = "dropdown";
    this.content = document.createElement("div");
    this.content.className = "dropdown-content hidden";
    this.dropdown.appendChild(this.content);
    this.dropdown.toggle = 0;
    this.panel.appendChild(this.dropdown);
    return this;
  };
  field.setDropdownContent = function setDropdownContent(contents) {
    // REWORK? It maybe better to add elem once than just display:none?
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
    }
    this.content.className = "dropdown-content";
    this.content.appendChild(contents);
    return this;
  };
  return field;
}

function BtnDelegator() {
  const Button = Object.create(Widget());

  Button.setup = function setup(field) {
    this.init(field.fieldname, document.createElement("btn"));
    this.elem.addEventListener("click", this.onClick.bind(this, field));
    return this;
  };
  Button.define = function define() {
    this.elem.toggle = 0;
    this.elem.value = null;
    this.elem.className = null;
    this.elem.parent = null;
    this.elem.panel = null;
    this.elem.dropdown = null;
  };
  Button.onClick = function onClick(field) {
    this.elem.toggle ^= 1;
    btnAction(this.elem, field);
  };
  return Button;
}

function ImageDelegator() {
  const Image = Object.create(Widget());

  Image.setup = function setup(fieldname) {
    this.init(fieldname, document.createElement("img"));
    this.elem.width = 20;
    this.elem.height = 20;
    return this;
  };
  Image.define = function define() {
    this.elem.src = "#";
    this.elem.alt = null;
    this.elem.title = null;
  };
  return Image;
}

function BtnElem() {
  const Button = {
    setup(elemId, func) {
      this.div = document.getElementById(elemId);
      this.label = this.div.querySelector(".btnLabel");
      this.btn = this.div.querySelector(".btn");
      this.slider = this.div.querySelector(".btnSlider");
      this.ball = this.div.querySelector(".btnBall");
      this.btn.toggle = 0;
      this.func = func;
      this.btn.addEventListener("click", this.onClick.bind(this));
      return this;
    },
  };
  return Button;
}

function TriStateBtnDelegator() {
  const Button = Object.create(BtnElem());

  Button.onClick = function onClick() {
    if (this.btn.toggle >= 1) {
      this.btn.toggle = -1;
    } else {
      this.btn.toggle += 1;
    }
    this.style();
    this.func(this);
  };
  Button.style = function style() {
    switch (this.btn.toggle) {
      case -1:
        this.slider.className = "btnSlider round disable";
        this.ball.className = "btnBall last";
        break;
      case 0:
        this.slider.className = "btnSlider round";
        this.ball.className = "btnBall";
        break;
      case 1:
        this.slider.className = "btnSlider round enable";
        this.ball.className = "btnBall middle";
        break;
      // no default
    }
  };
  return Button;
}

function ToggleBtnDelegator() {
  const Button = Object.create(BtnElem());

  Button.onClick = function onClick() {
    if (this.btn.toggle === 1) {
      this.btn.toggle = 0;
      this.slider.className = "btnSlider round";
      this.ball.className = "btnBall";
    } else {
      this.btn.toggle += 1;
      this.slider.className = "btnSlider round enable";
      this.ball.className = "btnBall last";
    }
    this.func(this);
  };
  return Button;
}

// ======================================================================
// Dropdown
// ======================================================================

function dropdownElem() {
  const Dropdown = {
    init(id) {
      this.elem = document.getElementById(id);
      this.elem.btn = this.elem.querySelector(".dropBtn");
      this.elem.content = this.elem.querySelector(".dropContent");
      return this;
    },
    append(items) {
      // append: Takes a DocumentFragment or an array of elements
      if (items.nodeName === "#document-fragment") {
        this.elem.content.appendChild(items);
      } else {
        const fragment = document.createDocumentFragment();
        items.forEach(item => fragment.appendChild(item));
        this.elem.content.appendChild(fragment);
      }
    },
  };
  return Dropdown;
}

function dropdownDelegator() {
  const Dropdown = Object.create(dropdownElem());

  Dropdown.name = function name(dropName) {
    this.elem.btn.textContent = dropName;
  };
  Dropdown.addItem = function addItem(type, name, func, ...args) {
    this.item = document.createElement(type);
    this.item.textContent = name;
    this.item.addEventListener("click", func.bind(this, name, ...args));
    return this.item;
  };
  Dropdown.action = function action(takeAction) {
    this.action = takeAction;
  };
  return Dropdown;
}


function addLabelDropdown() {
  const labelDrop = dropdownDelegator();
  labelDrop.init("labelDrop");
  labelDrop.name("Labels");
  const item1 = labelDrop.addItem("span", "Lowercase", toLower);
  const item2 = labelDrop.addItem("span", "Uppercase", toUpper);
  const item3 = labelDrop.addItem("span", "Titlecase", toTitleCase);
  const item4 = labelDrop.addItem("span", "Fieldname", toFieldname);
  const item5 = labelDrop.addItem("span", "Default", toDefault);
  labelDrop.append([item1, item2, item3, item4, item5]);
}

function addVisibilityDropdown() {
  const dropdown = dropdownDelegator();
  dropdown.init("visibilityDrop");
  dropdown.name("Visibility");
  const item1 = dropdown.addItem("span", "Visibility Off", setAllVisible, false);
  const item2 = dropdown.addItem("span", "Visibility On", setAllVisible, true);
  dropdown.append([item1, item2]);
}

function addDateDropdown() {
  const dateDrop = dropdownDelegator();
  dateDrop.init("dateDrop");
  dateDrop.name("Dates");

  const dateArry = dateArray();
  const fragment = document.createDocumentFragment();
  dateArry.forEach((data) => {
    const a = document.createElement("span");
    const [value, textContent] = data;
    a.dataset.value = value; // value;
    a.title = value; // tooltip
    a.textContent = textContent; // text
    a.addEventListener("click", setAndStyleAllDates.bind(null, data[0]));
    fragment.appendChild(a);
  });
  dateDrop.append(fragment);
}

function addSeparatorDropdown() {
  const dropdown = dropdownDelegator();
  dropdown.init("separatorDrop");
  dropdown.name("Separator");
  const item1 = dropdown.addItem("span", "Separator Off", setAllSeperators, false);
  const item2 = dropdown.addItem("span", "Separator On", setAllSeperators, true);
  dropdown.append([item1, item2]);
}


// ======================================================================
// Filter Buttons
// ======================================================================

function triVisibleAction(self) {
  replaceClassname(" VisibleHidden");
  switch (self.btn.toggle) {
    case -1:
      self.label.textContent = "Hidden";
      filterVisible(" VisibleHidden", false);
      break;
    case 0:
      self.label.textContent = "All";
      break;
    case 1:
      self.label.textContent = "Visible";
      filterVisible(" VisibleHidden", true);
      break;
    // no default
  }
}

function triDigitAction(self) {
  replaceClassname(" DigitHidden");
  switch (self.btn.toggle) {
    case -1:
      self.label.textContent = "Off";
      filterDigit(" DigitHidden", true);
      filterNullsNoProp(" DigitHidden", "digitSeparator");
      break;
    case 0:
      self.label.textContent = "All";
      break;
    case 1:
      self.label.textContent = "On";
      filterDigit(" DigitHidden", false);
      filterNullsNoProp(" DigitHidden", "digitSeparator");
      break;
    // no default
  }
}

function toggleDecimalAction(self) {
  replaceClassname(" DecimalHidden");
  switch (self.btn.toggle) {
    case 0:
      self.label.textContent = "All";
      break;
    case 1:
      self.label.textContent = "On";
      filterNullsNoProp(" DecimalHidden", "places");
      break;
    // no default
  }
}

function toggleDateAction(self) {
  replaceClassname(" dateHidden");
  switch (self.btn.toggle) {
    case 0:
      self.label.textContent = "All";
      break;
    case 1:
      self.label.textContent = "On";
      filterNullsNoProp(" dateHidden", "dateFormat");
      break;
      // no default
  }
}

// ======================================================================
// Field Buttons
// ======================================================================

function btnAction(btn, field) {
  btn.panel.toggle ^= 1;
  resetActiveBtn(btn);
  setBtnIdActive(btn, field);

  switch (btn.btnName) {
    case "Label":
      showLabel(btn, field);
      setLabel(field);
      btnLabelStyle(btn);
      break;
    case "Visiblity":
      setVisiblity(field.obj);
      btnVisibilityStyle(field, btn);
      break;
    case "Seperator":
      setSeperator(field.obj);
      btnSeparatorStyle(field, btn);
      break;
    case "Date":
      if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "dateFormat")) {
        const content = dateContent(field, btn);
        field.setDropdownContent(content);
      }
      dateDropdown(field, btn);
      btnDateStyle(field, btn);
      break;
    case "Digit":
      if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "digitSeparator")) {
        const content = digitContent(field, btn);
        field.setDropdownContent(content);
      }
      digitDropdown(field, btn);
      btnDecimStyle(field, btn);
      break;
     // no default
  }
}


function setBtnIdActive(btn, field) {
  if (btn.toggle === 1) {
    myApp.activeBtn = btn;
    myApp.activeField = field;
  } else {
    myApp.activeBtn = null;
    myApp.activeField = null;
  }
}


function resetActiveBtn(currentBtn) {
  if (currentBtn !== myApp.activeBtn) {
    const btn = myApp.activeBtn;
    const field = myApp.activeField;
    if (btn != null) {
      const active = myApp.activeBtn.className;
      btn.toggle = 0;
      if (active === "Label") {
        showLabel(btn, field);
        setLabel(field);
        btnLabelStyle(btn);
      } else if (active === "Date") {
        dateDropdown(field, btn);
      } else if (active === "Digit") {
        digitDropdown(field, btn);
      }
    }
  }
}


function addFields(elemId) {
  // TODO CAN USE FRAGEMENT HERE
  const parent = document.getElementById(elemId);
  const fields = [];

  myApp.fieldnames.forEach((fieldname) => {
    const field = Object.create(FieldDelegator());
    field.setup(fieldname);
    field.obj = myApp.fieldObjects[fieldname];
    field.CreateLabel();
    field.addTo(parent);
    field.Panel();
    fields.push(field);
  });
  return fields;
}

function pushBtns(btns, btn) {
  if (btns == null) {
    btns = [];
  }
  btns.push(btn);
  return btns;
}

function addBtns(fields) {
  fields.forEach((field) => {
    let fragment = document.createDocumentFragment();
    fragment = addBtn(field, "Edit Label", "images/label.png", "Edit Label", "Label", fragment);
    fragment = addBtn(field, "Visible", "images/light_on.svg", "Visible", "Visiblity", fragment);
    fragment = addBtn(field, "Separator On", "images/comma_on.png", "Separator On", "Seperator", fragment);
    fragment = addBtn(field, "Date", "images/date.png", "Date", "Date", fragment);
    fragment = addBtn(field, "Digit", "images/decimal.png", "Digit", "Digit", fragment);
    field.panel.appendChild(fragment);
    field.Dropdown();
  });
  return fields;
}

function addBtn(field, title, src, alt, name, fragment) {
  const btn = Object.create(BtnDelegator());
  const img = Object.create(ImageDelegator());

  btn.setup(field);
  btn.define();
  // If need to show-up in the DOM directly use method below
  // btn.elem.setAttribute("name", name)
  btn.elem.parent = field;
  btn.elem.panel = field.panel;
  btn.elem.className = name;
  btn.elem.btnName = name;
  img.setup(field.fieldname);
  img.elem.title = title;
  img.elem.src = src;
  img.elem.alt = alt;
  img.addTo(btn.elem);

  field.Btns(btn);
  fragment.appendChild(btn.elem);
  return fragment;
}

// ======================================================================
// Label Button
// ======================================================================


function showLabel(btn, field) {
  if (btn.toggle === 1) {
    if (!field.input) {
      field.CreateInput();
    }
    field.label.className = "hidden";
    field.input.className = "field_input";
    field.input.focus();
  } else {
    field.input.className = "hidden";
    field.label.className = "field_label";
  }
}

function setLabel(field) {
  field.obj.label = field.input.value;
  field.label.textContent = field.input.value;
}

function btnLabelStyle(btn) {
  const imgNode = btn.firstElementChild;

  if (btn.toggle === 0) {
    imgNode.src = "images/label.png";
    imgNode.alt = "Edit Label";
    imgNode.title = "Edit Label";
    imgNode.className = null;
  } else {
    imgNode.src = "images/set_label.png";
    imgNode.alt = "Set Label";
    imgNode.title = "Set Label";
  }
}

function submitLabel(event) {
  // If "Enter" is hit ie. 13
  if (event.keyCode === 13) {
    this.obj.label = this.input.value;
    this.label.textContent = this.input.value;
    this.input.className = "hidden";
    this.label.className = "field_label";
    this.btns[0].elem.toggle = 0;
    btnLabelStyle(this.btns[0].elem);
  }
}

// ======================================================================
// Visible Button
// ======================================================================

function btnVisibilityStyle(field, elem) {
  const imgNode = elem.firstElementChild;

  if (field.obj.visible === true) {
    imgNode.src = "images/light_on.svg";
    imgNode.alt = "Visible";
    imgNode.title = "Visible";
  } else {
    imgNode.src = "images/light_off.svg";
    imgNode.alt = "Hidden";
    imgNode.title = "Hidden";
  }
}

// ======================================================================
// Seperator Button
// ======================================================================

function btnSeparatorStyle(field, btn) {
  const imgNode = btn.firstElementChild;

  if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "digitSeparator")) {
    imgNode.src = field.obj.format.digitSeparator === false ? "images/comma_off.png" : "images/comma_on.png";
    imgNode.alt = field.obj.format.digitSeparator === false ? "Separator Off" : "Separator On";
    imgNode.title = field.obj.format.digitSeparator === false ? "Separator Off" : "Separator On";
  } else {
    imgNode.src = "images/comma_na.png";
    imgNode.alt = "N/A";
    imgNode.title = "N/A";
    imgNode.className = "notApplicable";
  }
}

// ======================================================================
//  Date Button
// ======================================================================

function dateArray() {
  return [
    ["year", "1997"],
    ["shortMonthYear", "Dec 1997"],
    ["longMonthYear", "December 1997"],
    ["shortDate", "12/21/1997"],
    ["shortDateLE", "21/12/1997"],
    ["dayShortMonthYear", "21 Dec 1997"],
    ["longMonthDayYear", "December 21,1997"],
    ["longDate", "Sunday, December 21, 1997"],
    ["shortDateShortTime", "12/21/1997 6:00 PM"],
    ["shortDateLEShortTime", "21/12/1997 6:00 PM"],
    ["shortDateLongTime", "12/21/1997 6:00:00 PM"],
    ["shortDateLELongTime", "21/12/1997 6:00:00 PM"],
    ["shortDateShortTime24", "12/21/1997 18:00"],
    ["shortDateLEShortTime24", "21/12/1997 18:00"],
  ];
}

function dateContent(field, btn) {
  const content = document.createElement("div");
  const fragment = document.createDocumentFragment();
  content.className = "dropdown-contentDate";
  const dateArr = dateArray();
  dateArr.forEach((data) => {
    const a = document.createElement("a");
    const [value, textContent] = data;
    a.dataset.value = value; // value;
    a.title = value; // tooltip
    a.textContent = textContent; // text
    a.addEventListener("click", setAndStyleDate.bind(null, field, data[0], btn));
    fragment.appendChild(a);
  });
  content.appendChild(fragment);
  return content;
}

function dateDropdown(field, elem) {
  // console.log(elem.toggle)
  if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "dateFormat")) {
    if (elem.toggle === 1) {
      field.dropdown.className = "dropdown";

      const anchors = field.dropdown.getElementsByTagName("a");
      const dateType = field.obj.format.dateFormat;
      const index = findAttributeValue(anchors, dateType);
      anchors[index].id = "date_selected";
    } else {
      field.dropdown.className = "hidden";
    }
  }
}

function btnDateStyle(field, elem) {
  const imgNode = elem.firstElementChild;
  const date = ["shortDate", "shortDateLE", "longMonthDayYear", "dayShortMonthYear",
    "longDate", "longMonthYear", "shortMonthYear", "year"];

  const dateTime = ["shortDateLongTime", "shortDateLELongTime", "shortDateShortTime",
    "shortDateLEShortTime", "shortDateShortTime24", "shortDateLEShortTime24",
    "shortDateShortTime24", "shortDateLEShortTime24"];

  if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "dateFormat")) {
    const d = field.obj.format.dateFormat;

    if (dateTime.indexOf(d) > -1) {
      imgNode.src = "images/dateTime.png";
      imgNode.alt = d;
      imgNode.title = d;
    } else if (date.indexOf(d) > -1) {
      imgNode.src = "images/date.png";
      imgNode.alt = d;
      imgNode.title = d;
    }
  } else {
    imgNode.src = "images/date_na.png";
    imgNode.alt = "N/A";
    imgNode.title = "N/A";
    imgNode.className = "notApplicable";
  }
}

function setAndStyleDate(field, dateType, btn) {
  setDate(field, dateType);
  btn.toggle = 0;
  dateDropdown(field, btn);
  btnDateStyle(field, btn);
}

function setAndStyleAllDates(dateType) {
  myApp.fields.filter(field => (field.obj.format != null &&
    Object.prototype.hasOwnProperty.call(field.obj.format, "dateFormat")))
    .forEach(field => (field.obj.format.dateFormat = dateType));
  // TODO
  applyBtnDefaults(myApp.fields);
  // and/or some aleart to say date changed
  // maybe close the dropdown window on click
}

// ======================================================================
//  Digit Button
// ======================================================================

function digitContent(field, parentbtn) {
  const contentDiv = document.createElement("div");
  const pTag = document.createElement("p");
  const fragment = document.createDocumentFragment();
  const input = document.createElement("input");
  const btn = document.createElement("btn");

  contentDiv.className = "dropdown-contentDigit";
  pTag.innerText = "Decimals: ";

  input.type = "number";
  input.className = "smInput";
  input.autofocus = "autofocus";
  input.value = field.obj.format.places;

  btn.innerText = "Set";
  btn.className = "button center";
  btn.addEventListener("click", digitSetBtn.bind(null, field, input, parentbtn));

  fragment.appendChild(pTag);
  fragment.appendChild(input);
  fragment.appendChild(btn);

  contentDiv.appendChild(fragment);
  return contentDiv;
}

function digitDropdown(field, btn) {
  if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "digitSeparator")) {
    if (btn.toggle === 1) {
      field.dropdown.className = "dropdown";
    } else {
      field.dropdown.className += " hidden";
    }
  }
}

function btnDecimStyle(field, elem) {
  const imgNode = elem.firstElementChild;
  if (field.obj.format !== null && Object.prototype.hasOwnProperty.call(field.obj.format, "places")) {
    const decimals = field.obj.format.places;
    imgNode.src = "images/decimal.png";
    imgNode.alt = `Has ${decimals} Decimal(s)`;
    imgNode.title = `Has ${decimals} Decimal(s)`;
  } else {
    imgNode.src = "images/na.png";
    imgNode.alt = "N/A";
    imgNode.title = "N/A";
    imgNode.className = "notApplicable";
  }
}


function digitSetBtn(field, input, parentbtn) {
  setDigit(field.obj, input.value);
  field.dropdown.className += " hidden";
  parentbtn.toggle = 0;
  btnDecimStyle(field, parentbtn);
}

function applyBtnDefaults(fields) {
  fields.forEach((field) => {
    field.btns.forEach(btn => btnTypeSorter(field, btn));
  });
}

function btnTypeSorter(field, btn) {
  switch (btn.elem.className) {
    case "Label":
      btnLabelStyle(btn.elem);
      break;
    case "Visiblity":
      btnVisibilityStyle(field, btn.elem);
      break;
    case "Seperator":
      btnSeparatorStyle(field, btn.elem);
      break;
    case "Date":
      btnDateStyle(field, btn.elem);
      break;
    case "Digit":
      btnDecimStyle(field, btn.elem);
      break;
    // no default
  }
}

// ======================================================================
//  Set Functions
// ======================================================================

function setVisiblity(fieldObj) {
  fieldObj.visible = !fieldObj.visible;
}

function setSeperator(fieldObj) {
  if (fieldObj.format !== null && Object.prototype.hasOwnProperty.call(fieldObj.format, "digitSeparator")) {
    fieldObj.format.digitSeparator = !fieldObj.format.digitSeparator;
  }
}

function setDate(field, dateType) {
  field.obj.format.dateFormat = dateType;
}

function setDigit(fieldObj, value) {
  fieldObj.format.places = value;
}


// ======================================================================
//  Utility Functions
// ======================================================================

function findAttributeValue(collection, attrValue) {
  // Returns the index position of the first element that is a match within parent element
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].dataset.value === attrValue) {
      return i;
    }
  }
  // Return -1 means not found
  return -1;
}

function toTitleCase() {
  myApp.fields.forEach((field) => {
    field.obj.label = field.obj.label.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase()
      + txt.substr(1).toLowerCase());
    field.label.textContent = field.obj.label;
  });
}

function toLower() {
  myApp.fields.forEach((field) => {
    field.obj.label = field.obj.label.toLowerCase();
    field.label.textContent = field.obj.label;
  });
}

function toUpper() {
  myApp.fields.forEach((field) => {
    field.obj.label = field.obj.label.toUpperCase();
    field.label.textContent = field.obj.label;
  });
}

function toFieldname() {
  myApp.fields.forEach((field) => {
    field.obj.label = field.fieldname;
    field.label.textContent = field.obj.label;
  });
}

function toDefault() {
  myApp.fields.forEach((field) => {
    field.obj.label = field.label.default;
    field.label.textContent = field.obj.label;
  });
}

function setAllSeperators(name, boolean) {
  myApp.fields.filter(field => (field.obj.format != null &&
    Object.prototype.hasOwnProperty.call(field.obj.format, "digitSeparator")))
    .forEach(field => (field.obj.format.digitSeparator = boolean));
  applyBtnDefaults(myApp.fields);
}

function setAllVisible(name, boolean) {
  myApp.fields.forEach(field => (field.obj.visible = boolean));
  applyBtnDefaults(myApp.fields);
}

function replaceClassname(propClass) {
  myApp.fields.forEach(i => i.elem.className =
        i.elem.className.replace(propClass, ""));
}

// ======================================================================
//  On-Load Handle
// ======================================================================

function initApplication() {
  Main();
}

// Handler when the DOM is fully loaded
document.onreadystatechange = function onreadystatechange() {
  if (document.readyState === "complete") {
    initApplication(document.readyState);
  } else {
    // Do something during loading [opitional]
  }
};

// ======================================================================
