class Calc{
    constructor(display,btns,lastOperationDisplay,displayError){

        this.btns = btns;
        this.display = display;
        this.displayError = displayError;
        this._displayContent = [];
        this.addEventClick(this.btns);
        this.lastOperationDisplay = lastOperationDisplay;
        this.lastOperation =[];
        this.regex = [/\,/gm,/\./gm,/\/100\*/gm,/[\/*-+]/gm];
       
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
                this.maxLengthDisplay(this.display.textContent,this.displayError);

                switch (element.dataset.btn) {
                    case "CE": // clear all
                        this.ceFun(this.displayContent,this.display);
                        break;
                        
                    case "C": // clear all
                        this.resetDisplay();
                        this.resetLastOperation();
                        break;

                    case "sign": // clear all
                    
                       this.NewSign(this.display.innerHTML,this.displayContent,this.regex[3]);

                        break;

                    case 'percent': // clear all
        
                        this._displayContent.push("/100*");
                        this.setDisplayContent();
                        break;

                    case "backspace": // deletes the last input

                         this.ceFun(this.displayContent,this.display);

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

        if(this.lastOperation.length > 0){
            this.lastOperation.shift();
        }

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
    //reset display Last Operation and set a default value
    resetLastOperation(){
        this.lastOperationDisplay.innerHTML = "-" ;
        this.lastOperation =[];
    }

    //checks whether the next input is an operator or a number
    isAnumber(lastOperation,displayContent,buttonsType){
        

        if(lastOperation.length == 1 && displayContent.length == 1){
            
            switch (buttonsType) {
                case "number":
                     //does not allow join()
                    this._displayContent.shift();
                    this.lastOperation.shift();
                    this.setDisplayContent();
                    
                    break;

                case "operador":
                    //allow the join()
                    break;

                default:
                    break;
            }

        }

        
    }

    //check max display length
    maxLengthDisplay(value,displayError){
    
       if(value.length > 41){
        displayError.innerHTML = "Numero maximo de caracteres excedido!"
        this.resetDisplay();
        this.resetLastOperation();
        setTimeout(()=>{
            this.resetDisplay();
        },30);
      
       }else{
        displayError.innerHTML = "";
       }

    }

 
    //CE Button
    ceFun(displayContent){

        displayContent.pop();
        this.resetLastOperation();
        this.setDisplayContent();

        if(display.innerHTML.length == 0){
         display.innerHTML = 0;
        }


    }


    NewSign(display,displayContent,regex){

        //transforms the display value into an array
        let displayValue = display.split(/[\//*-+%]/gm);
        //checks the size of the last inputted number
        let subArray = displayValue[displayValue.length -1].length;

             //check whether a number is positive, negative or zero
            switch ((Math.sign(displayValue[displayValue.length -1]))) {
                case 1:
                    //removes the old values, so the new value can now be inserted
                    for(let i=0;i < subArray;i++){

                        if(regex.test(displayContent[displayContent.length-1])== true){
                            displayContent.push(`-${displayValue[displayValue.length -1]}`);
                            this.setDisplayContent();
                            return;
                        }else{
                            
                            displayContent.pop();  
                        };  
                    }

                    displayContent.push(`-${displayValue[displayValue.length -1]}`);
                    this.setDisplayContent();
                    
                    break;
                case -1:

                    displayContent.pop();
                    displayContent.push(`${displayValue[displayValue.length -1].replace(/[-()]/gm,"")}`);
                    this.setDisplayContent();
                
                break;
                case 0:
                    
                break;
            
                default:
                    break;
            }        
 
    }

    
}