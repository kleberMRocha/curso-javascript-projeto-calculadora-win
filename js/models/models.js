class Calc{
    constructor(display,btns){

        this.btns = btns;
        this.display = display;
        this._displayContent = [];
        this.addEventClick(this.btns);
    }

    get displayContent(){
        return this._displayContent;

    }
    
    set displayContent(value){
        this._displayContent = value;
    }

    //remove the commas from an array and add it to the display
    setDisplayContent(){

        this.display.innerHTML = this.displayContent;
        let whithOutComma = this.display.innerHTML.replace(/\,/gm,"");
        this.display.innerHTML = whithOutComma;
        
    }

    //add "click" event for all buttons
    addEventClick(value){

        value.forEach(element => {

            element.addEventListener("click",event =>{

                
                switch (element.dataset.btn) {
                    case "C": // clear all
                        this.resetDisplay();
                        break;

                    case "CE": // clear all
                        this.resetDisplay();
                        break;

                    case "backspace": // deletes the last input

                        this._displayContent.pop();
                        this.setDisplayContent();

                        break;
                    case "=": //eval the values on the display
                        
                       let resultado = eval(this.display.innerHTML);
                       this.resetDisplay();
                       this._displayContent.push(resultado)
                       this.setDisplayContent();
                            
                        break;
                
                    default: //resolves the operation shown on the display
                        this._displayContent.push(element.innerHTML);
                        this.setDisplayContent();
                        break;
                }

            });
            
        });
        
    }

    //reset display and set a default value
    resetDisplay(){
  
        this.display.innerHTML = "0";
        this.displayContent = [];

    }

    
}