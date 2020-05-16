class Calc{
    constructor(display,btns,lastOperationDisplay){

        this.btns = btns;
        this.display = display;
        this._displayContent = [];
        this.addEventClick(this.btns);
        this.lastOperationDisplay = lastOperationDisplay;
        this.lastOperation =[];
        this.regex = [/\,/gm,/\./gm,/\/100\*/gm];
       
    }

    get displayContent(){
        return this._displayContent;

    }
    
    set displayContent(value){
        this._displayContent = value;
    }

    //add "click" event for all buttons
       addEventClick(value){

        value.forEach(element => {

            element.addEventListener("click",event =>{

                this.isAnumber(this.lastOperation,this.displayContent,element.dataset.btn);

                switch (element.dataset.btn) {
                    case "CE": // clear all
                        this._displayContent.pop();
                        this.setDisplayContent();

                        break;
                        
                    case "C": // clear all
                        this.resetDisplay();
                        break;

                    case 'percent': // clear all
        
                        this._displayContent.push("/100*");
                        this.setDisplayContent();


                        break;

                    case "backspace": // deletes the last input
                        this._displayContent.pop();
                        this.setDisplayContent();

                        break;
                    case "=": //eval the values on the display

                        this.equationSolver();
                            
                        break;
                
                    default: //resolves the operation and shown on the display
                        this._displayContent.push(element.innerHTML);
                        this.setDisplayContent();
                        break;
                }

            });
            
        });
        
    }


    // solve the equations
    // convert comma to period
    // convert the percent value
    equationSolver(){

        this.lastOperation.push(this.display.innerHTML);
        let resultado = eval(this.display.innerHTML.replace(this.regex[0],".")
        .replace("%","/100*"));

        this.setDisplayLastOperation(this.lastOperationDisplay,this.lastOperation,resultado);
        this.resetDisplay();
        
        this._displayContent.push(String(resultado).replace(this.regex[1],","));
        this.setDisplayContent();

    }


    //add it to the display without array commas
    setDisplayContent(){

        this.display.innerHTML = this.displayContent.join("").replace(this.regex[2],"%");
        
    }

 
    //add  the last operation to the display 
    setDisplayLastOperation(lastOperationDisplay,lastOperation,resultado){
        lastOperationDisplay.innerHTML = 
        `Resultado: ${lastOperation[lastOperation.length-1]} = ${resultado}`;
    }

    //reset display and set a default value
    resetDisplay(){
        this.display.innerHTML = "0";
        this.displayContent = [];
       
    }

    //checks whether the next input is an operator or a number
    isAnumber(lastOperation,displayContent,buttonsType){

        if(lastOperation.length == 1 && displayContent.length == 1){
            
            switch (buttonsType) {
                case "number":
                     //does not allow join()
                    this._displayContent.shift();
                    this.setDisplayContent();
                    this.lastOperation =[];
                    break;

                case "operador":
                    //allow the join()
                    break;

                default:
                    break;
            }


        }

        
    }

    
}