class Calc{
    constructor(display,btns,lastOperationDisplay,displayError){

        this.btns = btns;
        this.display = display;
        this.displayError = displayError;
        this._displayContent = [];
        this.addEventClick(this.btns);
        this.lastOperationDisplay = lastOperationDisplay;
        this.lastOperation =[];
        this.regex = [/\,/gm,/\./gm,/\/100\*/gm,/[\/*-+%]/gm];
       
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
                    
                       this.NewSign(this.display.innerHTML,this.displayContent,this.regex);

                        break;

                    case 'percent': // clear all
        
                        this._displayContent.push("/100*");
                        this.setDisplayContent();
                        break;

                    case "sqrt": //eval the values on the display

                        this.sqrt(this.display.innerHTML,this.displayContent,this.regex);   

                    break;

                    case "pow": //eval the values on the display

                    this.pow(this.display.innerHTML,this.displayContent,this.regex);   

                    break;
                
                    
                    case "reciproc": //eval the values on the display

                    this.reciproc(this.display.innerHTML,this.displayContent,this.regex);   

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

        if(this.displayContent.includes("NaN"))this.resetDisplay(),this.displayError.innerHTML = "Operação Invalida!";
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

    //removes the old values, so the new value can now be inserted
    //prevents operators from being removed
    preventsPopOperators(Sub,regex,displayContent,displayValue){
        
        for(let i=0;i < Sub;i++){
            if(regex[3].test(this.LastArrayValue(displayContent))== true){
                displayContent.push(-1*this.LastArrayValue(displayValue));
                this.setDisplayContent();
                return;
            }else{
                displayContent.pop();  
            };  
        }
    }


    LastArrayValue(array){

       return array[array.length -1]

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

   
    // ± Button
    NewSign(display,displayContent,regex){

        //transforms the display value into an array
        let displayValue = display.split(/[\//*-+%]/gm);
        let pushValue = -1*(this.LastArrayValue(displayValue)).replace(regex[0],".");

        this.applyFunction(display,displayContent,regex,pushValue);
              
      
    }

    // √ Button

    sqrt(display,displayContent,regex){
       
       //transforms the display value into an array
       let displayValue = display.split(/[\//*-+%]/gm); 
       let pushValue = Math.sqrt(this.LastArrayValue(displayValue).replace(regex[0],".")).toFixed(2);

       this.applyFunction(display,displayContent,regex,pushValue);

      
                      
                    
    }

    //pow Button

    pow(display,displayContent,regex){
       
        //transforms the display value into an array
        let displayValue = display.split(/[\//*-+%]/gm);
        let pushValue = Math.pow(this.LastArrayValue(displayValue).replace(regex[0],"."),2);

        this.applyFunction(display,displayContent,regex,pushValue);
      
                         
     }

     //¹/x button

    reciproc(display,displayContent,regex){

       //transforms the display value into an array
       let displayValue = display.split(/[\//*-+%]/gm);
       if(this.LastArrayValue(displayValue) == 0){
        
        this.displayError.innerHTML = "Operação Invalida!";
        this.resetDisplay();
        
       }

       let pushValue = 1/(this.LastArrayValue(displayValue).replace(regex[0],"."));

       this.applyFunction(display,displayContent,regex,pushValue);
                   
     }


    
    applyFunction(display,displayContent,regex,pushValue){

        //transforms the display value into an array
        let displayValue = display.split(/[\//*-+%]/gm);
        //checks the size of the last inputted number
        let subArray = this.LastArrayValue(displayValue).length;
 
       
             //check whether a number is positive, negative 
 
                for(let i=0;i < subArray;i++){
 
                    //is the value a operator?
                    if(regex[3].test(this.LastArrayValue(displayContent))== true){
                       
                        //converts a number to positive or negative
                        // replace commas to dots so then can be used by eval() method
                        let withoutComma = (pushValue);
 
                        displayContent.push(String(withoutComma).replace(regex[1],","));
                        this.setDisplayContent();
                        return;
 
                    }else{
                        
                        displayContent.pop();  
                    };  
                }
              
                let withoutComma = (pushValue);
                displayContent.push(String(withoutComma).replace(regex[1],","));
                this.setDisplayContent();    




    }

    
}