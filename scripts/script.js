"use strict";

const myApp = {};

// ======================================================================
// MAIN
// ======================================================================

myApp.main = function main(){
  console.log("Main loaded")

  create_widget();
  create_btn();


}
// ======================================================================
// Add Elements
// ======================================================================

function create_widget(){
    myApp.Widget = {
      init: function(){
        this.id = null;
        this.elem = null;
      },
      builder: function(parent){
        parent.appendChild(this.elem);
      },
    }
    //return Widget
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

    Button.build = function(item){
        this.builder(item);
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