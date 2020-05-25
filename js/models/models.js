class Calc{
    constructor(display,btns,lastOperationDisplay,displayError,audio,sideMenu){
        //keyBoardEventListener
        this.keyboard();
        this.btns = btns;
        this.display = display;
        this.displayError = displayError;
        this._displayContent = [];
        this.addEventClick(this.btns);
        this.lastOperationDisplay = lastOperationDisplay;
        this.lastOperation =[];
        this.audio = audio;
        this.sideMenu = sideMenu;
        this.sideMenuFunctions(sideMenu);
        this.regex = [/\,/gm,/\./gm,/\/100\*/gm,/[\/*-+%]/gm,/.+[Infinity,NaN,undefined].+/gmi];
     
    }


    get displayContent(){
        return this._displayContent;

    }
    
    set displayContent(value){
        this._displayContent = value;
    }

    //Bonus Functions
    sideMenuFunctions(value){
        value.forEach(element =>{
            element.addEventListener("click",()=>{
                switch (element.dataset.others){
                    case "menu":
                            if(element.children[0].classList == "fas fa-bars"){
                            element.children[0].classList ="fas fa-window-close";

                            value.forEach(element =>{  

                                    if(element.dataset.others == "menu" || 
                                       element.dataset.others == "content"){return;}
                                    else{  
                                       setTimeout(()=>{
                                            element.classList.add('slideDown');
                                            element.classList.remove('slideUp');
                                        },200);
                                        }
                                    });
                                }
                            else{

                                element.children[0].classList ="fas fa-bars";

                                value.forEach(element =>{
                                    if(element.dataset.others == "menu" || 
                                    element.dataset.others ==  "content"){return;}
                                    else{
                                        setTimeout(()=>{
                                            element.classList.remove('slideDown');
                                            },200);

                                            element.classList.add('slideUp');                       
                                        }
                                });
                            }
                        
                        break;

                    case "sound":
                        if(element.children[0].classList == "fas fa-volume-up"){
                            this.audio.muted = true;
                            element.children[0].classList = "fas fa-volume-mute";
                            this.setMsg("Som Mutado!");
                        }else{
                            element.children[0].classList = "fas fa-volume-up";
                            this.audio.muted = false;
                            this.setMsg("Som Habilitado!");
                        }
  
                        break;
                    case "viewMode":  
                    if(element.children[0].classList == "far fa-lightbulb"){
                            element.children[0].classList = "fas fa-lightbulb";
                            document.body.style ="background-color:#fcfcfc;"

                    }else{
                            element.children[0].classList = "far fa-lightbulb";
                            document.body.style ="";
                    }
                        break;
                
                    default:
                        break;
                }
            });

        });

    }

    //add "click" event for all buttons
       addEventClick(value){

        value.forEach(element => {

            element.addEventListener("click",event =>{
                this.audio.play();
                this.audio.currentTime=0;
                
                this.isAnumber(this.lastOperation,this.displayContent,element.dataset.btn);
                this.maxLengthDisplay(this.display);
              

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
                    this.audio.play();
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
        
        try {

            this.lastOperation.push(this.display.innerHTML);

            let resultado = eval(this.display.innerHTML.replace(this.regex[0],".")
            .replace("%","/100*"));
    
            this.setDisplayLastOperation(this.lastOperationDisplay,this.lastOperation,resultado);
            this.resetDisplay();
            
            this._displayContent.push(String(resultado).replace(this.regex[1],","));
    
            this.setDisplayContent();
            
        } catch (error) {

           this.setMsg("Operação invalida!");
           
        }


    }

    //add it to the display without array commas
    setDisplayContent(){
        if(this.displayContent.includes("NaN"))this.setMsg("Operação Invalida!");
        this.display.innerHTML = this.displayContent.join("").replace(this.regex[2],"%");
        
    }

    //add  the last operation to the display 
    setDisplayLastOperation(lastOperationDisplay,lastOperation,resultado){
        lastOperationDisplay.innerHTML = 
        ` ${lastOperation[lastOperation.length-1]} = ${resultado}`;
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
    maxLengthDisplay(value){
    
       if(value.textContent.length > 42){

            let fontSize = 30 - value.textContent.length/15;
           
        for(let i =value.textContent.length -1; i < value.textContent.length; i++){

            value.style =`font-size:${fontSize}px;`;

        }

        }else{
            value.style ="";
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
        
        this.setMsg("Operação Invalida!");

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

    setMsg(msg){
        this.displayError.innerHTML = msg;
        this.display.innerHTML = 0;
        setTimeout(()=>{ this.displayError.innerHTML =""},1000);
        setTimeout(()=>{ this.resetDisplay();},1);

    }

    keyboard(){
        document.addEventListener('keypress', (event)=>{
        
            if((/[-+*\/%\,\.\d+]/gm.test(event.key)== true)){
                /[-+*\/%\,\.]/.test(event.key) ? 
                this.isAnumber(this.lastOperation,this.displayContent,"operador"):
                this.isAnumber(this.lastOperation,this.displayContent,"number");

                this.maxLengthDisplay(this.display);
                this.displayContent.push(event.key);
                this.audio.play();
                this.audio.currentTime=0;
                this.setDisplayContent();

            }else if(event.key =="Enter"){
                this.equationSolver();
                this.audio.play();
                this.audio.currentTime=0;

            }else if(event.key =="Delete"){
                this.ceFun(this.displayContent,this.display);
                this.audio.play();
                this.audio.currentTime=0;
            }   
            else{
                return;
            }
               
        });
    }

    
}