let MODE = 0;
const $BASETEXT = document.getElementById("baseText");
const $CIPHERTEXT = document.getElementById("cipherText");
const $KEY = document.getElementById("key");
const $CHMODBTN = document.getElementById("chModBtn");

const $INPFILE = document.querySelector('.impr-col-method-inp--container > input');

let $TXTBASE = document.querySelector('.mpr-col-method-beginingText--container > span');
let $TXTCIPHER = document.querySelector('.mpr-col-method-resultText--container > span');

let anotherALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVW';
let baseText = '';
let cipherText = '';
let uncipherText = '';
let vector = [];
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let keyLen;
let matrix;


/////EMPTYNESS CHECK
// checking for empty string
function isBlank(str){
    return (!str || /^\s*$/.test(str));
}


function checkEmpty(){
    if (isBlank($KEY.value) || isBlank($BASETEXT)){
        return true;
    }
    else return false;
}

///// CORRECT KEY
function correctKey(key){
    let resKey = '';
    for(let i = 0; i < key.length; i++){
        if(ALPHABET.includes(key[i])){
            resKey += key[i];
        }
    }
    return resKey;
}



///// CLEAR FUNCTIONS 
function clearMatrix(){
    matrix = null;
}

function clearInpFile(){
    $INPFILE.value = ''
}

function clearTxt(){
    $BASETEXT.value = '';
    $CIPHERTEXT.value = '';
    $KEY.value = '';
}

function clearAll(){
    clearMatrix();
    clearTxt();
    clearInpFile();
}

/////////// READ FILE FROM INPUT

function readFile(input){
    // choose file from input
    let file = input.files[0];

    // constructor for reading files
    let reader = new FileReader();

    // will read files as text files
    reader.readAsText(file);

    // if everything allright and we get text
    // laod means: no mistakes, reading is finished
    reader.onload = function(){
        if(isBlank(reader.result)){
            console.log('empty str, try one more time');
            alert('An empty file');
        } else{
            let res = parseInpStr(reader.result);
            $BASETEXT.value = baseText = res;
        }
    }

    // if some unexpected things will happen
    reader.onerror = function() {
        console.log(reader.error);
    }
    
    
}

/////////WRITE OUTPUT FILE////////////
function saveDynamicCipheredDataToFile() {

    var userInput = $CIPHERTEXT.value;
    
    var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cipherOut.txt");
}


function saveDynamicUncipheredDataToFile() {

    var userInput = $CIPHERTEXT.value;
    
    var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "uncipherOut.txt");
}

/////////delete all characters except a-z
function parseInpStr(str){
    let string = '';
    for (let i = 0; i < str.length; i++){
       
        if (ALPHABET.includes(str[i])){
            
            string += str[i];
        }
        if (anotherALPHABET.includes(str[i])){
            
            string += str[i].toLowerCase();
        }
    }
    return string;
}



///// change mode chiphering <-> unciphering
function changeMod(){
    MODE = !MODE;
    
    let tmp = $TXTBASE.textContent;
    $TXTBASE.textContent = $TXTCIPHER.textContent;
    $TXTCIPHER.textContent = tmp;
    clearAll();
}



//////// fill the key like a vector 
function fillVector(){
    let cnt = 1;

    for(let i in ALPHABET){
        for(let j in $KEY.value){
            if(ALPHABET[i] == $KEY.value[j]){
                vector[j] = cnt++;
            }
        }
    }
    console.log("Vector: ", vector);
}



function createMatrix(size){
    let x = new Array(size);

    for (let i = 0; i < x.length; i++){
        x[i] = new Array(size);
    }
    matrix = x.slice();   
}

function fillMatrix(){
    let anchor = 0;
    for(let i = 1; i <= keyLen; i++){
        for(let j = 0; j < vector.length; j++){
            if( i == vector[j] && anchor < $BASETEXT.value.length){
                for(let k = 0; k <= j; k++){
                    matrix[i - 1][k] = $BASETEXT.value[anchor++];
                }
            }
        }
    }
}

function writeCipherText(){
    for (let i = 0; i < vector.length; i++){
        for(let j = 0; j < vector.length; j++){
            if(i + 1 == vector[j]){
                for(let k = 0; k < keyLen; k++){
                    if (matrix[k][j] != undefined){
                        console.log(matrix[k][j]);
                        cipherText += matrix[k][j];
                    }        
                }
            }
        }
    }
    $CIPHERTEXT.value = cipherText;
}

//////////// prepare decipcher matrix

function fillDecipherMatrix(){
    let anchor = 0;
    for(let i = 0; i < vector.length; i++){
        for(let j = 0; j < vector.length; j++){
            if(i + 1 == vector[j]){
                for(let k = 0; k <= j; k++){
                    if(anchor < $BASETEXT.value.length){
                        matrix[i][k] = 1;
                        console.log("i: ", i, "k: ", k, "anchor", anchor++);     
                    }
                    
                }
            }
        }
    }

    console.table(matrix);

    anchor = 0;
    for (let i = 0; i < vector.length; i++){
        for(let j = 0; j < vector.length; j++){
            if(i + 1 == vector[j]){
                for(k = 0; k < vector.length; k++){
                    if(matrix[k][j]){
                        matrix[k][j] = $BASETEXT.value[anchor++];
                    }
                }
            }
        }
    }


    console.table(matrix);
}

function writeUncipherText(){
    for(let i = 0; i < vector.length; i++){
        for(let j = 0; j < vector.length; j++){
            if(matrix[i][j]){
                uncipherText += matrix[i][j];
            }
        }
    }
    $CIPHERTEXT.value = uncipherText;
}

///////////////// MAIN FUNC
function ciphering(){
    
    if (checkEmpty()){
        alert("There are an empty fields!!!");
    }else {
        $BASETEXT.value = parseInpStr($BASETEXT.value)
        $KEY.value = correctKey($KEY.value);
        if($KEY.value){
            if (MODE == 0){
                keyLen = $KEY.value.length;
                console.log("KeyLen: ", keyLen);
                console.log("BaseText: ",$BASETEXT.value.length);
                
                fillVector();
            
                createMatrix(keyLen);
            
                console.log("Length:",vector.length);
            
                fillMatrix();
                console.table(matrix);
            
                writeCipherText();
    
                saveDynamicCipheredDataToFile();
            } else {
                keyLen = $KEY.value.length;
                
                fillVector();
                createMatrix(keyLen);
                fillDecipherMatrix();
                writeUncipherText();
                saveDynamicUncipheredDataToFile()
            }
        } else{
            alert("Incorrect key value");
        }
        
        
    }
   
}

