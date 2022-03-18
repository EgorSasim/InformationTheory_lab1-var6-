const $INPFILE = document.querySelector('.vizner-inp--container > input');
const $KEY = document.getElementById('key');
const $BASETEXT = document.getElementById('baseText');
const $CIPHERTEXT = document.getElementById('cipherText');


let $TXTBASE = document.querySelector('.vizner-beginingText--container > span');
let $TXTCIPHER = document.querySelector('.vizner-resultText--container > span');

let anotherALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
let MODE = 0;
const ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
let baseText = '';
let cipherText = '';
let uncipherText = '';
let matrix;
let vector;



///// change mode chiphering <-> unciphering
function changeMod(){
    MODE = !MODE;
    
    let tmp = $TXTBASE.textContent;
    $TXTBASE.textContent = $TXTCIPHER.textContent;
    $TXTCIPHER.textContent = tmp;
    clearAll();
}



///// CLEAR FUNCTIONS 
function clearInpFile(){
    $INPFILE.value = ''
}


function clearVector(){
    vector = null;
}

function clearMatrix(){
    matrix = null;
}
function clearTxt(){
    $BASETEXT.value = '';
    $CIPHERTEXT.value = '';
    $KEY.value = '';
}

function clearAll(){
    clearTxt();
    clearInpFile();
    clearVector();
    clearMatrix();
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



//////////PARSING INPUT FILE CONTENT//////////
function parseInpStr(str){
    let string = '';
    for (let i = 0; i < str.length; i++){
        if (ALPHABET.includes(str[i]) || str[i] == ' ' || str[i] == '-' || str[i] == '_' ){
            string += str[i];
        }
        if (anotherALPHABET.includes(str[i])){
            
            string += str[i].toLowerCase();
        }
    }
    return string;
}



//////////////CREATE MATRIX DISPLAYING HOW TO CIPHER LETTERS


function createMatrix(keySize){
    let x = new Array(keySize + 1); 

    for (let i = 0; i < x.length; i++){
        x[i] = new Array(33);
    }
    matrix = x.slice();   
}


function fillMatrix(){
    for (let i = 0; i < ALPHABET.length; i++){
        matrix[0][i] = ALPHABET[i];
    }
    
    for (let i = 1; i <= $KEY.value.length; i++){
        matrix[i][0] = $KEY.value[i-1];
    }

    for (let i = 0; i < $KEY.value.length; i++){
        let letterPos = ALPHABET.indexOf($KEY.value[i]);
        for(let j = 1; j < ALPHABET.length; j++){
            if(letterPos == 32) {
                letterPos = 0;
            }
            else{
                ++letterPos;
            }
            matrix[i+1][j] = ALPHABET[letterPos];
        }
    }

    console.table(matrix);
}


///// CREATE VECTOR OF INTERCONNECTION KEY AND INPUT SYMBOLS
function createVector(){
    let x = new Array(2); 

    for (let i = 0; i < x.length; i++){
        x[i] = new Array($BASETEXT.value.length);
    }
    vector = x.slice();   
}

function fillVector(){
    for(let i = 0; i < $BASETEXT.value.length; i++){
        vector[0][i] = $BASETEXT.value[i];
    }

    let counter = 0;
    for (let i = 0; i < $BASETEXT.value.length; i++){
        if (ALPHABET.includes(vector[0][i])){
            vector[1][i] = $KEY.value[counter++ % $KEY.value.length];
        } else {
            vector[1][i] = 0;
        }
    }

    console.table(vector);
}



//////// CREATING A CIPHER

function createCipherText(){
    let inpTextLetter;
    let keyLetter;
    let resCipher = '';

    for (let i = 0; i < $BASETEXT.value.length; i++){
        inpTextLetter = vector[0][i];
        keyLetter = vector[1][i];

        if (ALPHABET.includes(inpTextLetter)){
            resCipher += //ALPHABET[(ALPHABET.indexOf($BASETEXT.value[i]) + ALPHABET.indexOf($KEY.value[i % $KEY.value.length])) % ALPHABET.length]
            findAppropriateCipherLetter(keyLetter, inpTextLetter);
        } else{
            resCipher += vector[0][i];
        }
    }
    cipherText = resCipher;
}

function findAppropriateCipherLetter(keyLetter, inpTextLetter){
    let keyLetterPos;
    let inpTextLetterPos;

    // find out a column index
    for (let i = 0; i < ALPHABET.length; i++){
        if (inpTextLetter == matrix[0][i]){
            inpTextLetterPos = i;
            break;
        }
    }

    // find out a row index
    for (let i = 1; i <= $KEY.value.length; i++){
        if (keyLetter == matrix[i][0]){
            keyLetterPos = i;
            break;
        }
    }

    return matrix[keyLetterPos][inpTextLetterPos];
    
}


////////////////CREATING UNCIPHER
function createUncipherText(){
    let resUncipherText = '';
    let anchor = 0;
    for(let i = 0; i < $BASETEXT.value.length; i++){
        if(ALPHABET.includes(vector[0][i])){
            resUncipherText += //ALPHABET[(ALPHABET.indexOf($BASETEXT.value[i]) + ALPHABET.length - ALPHABET.indexOf($KEY.value[i % $KEY.value.length])) % ALPHABET.length]
            
            matrix[0][findAppropriateUncipherLetter(vector[0][i],vector[1][i])];
        } else{
            resUncipherText += vector[0][i];
        }
    }

    uncipherText = resUncipherText;
}

function findAppropriateUncipherLetter(cipheredLetter, keyLetter){
    
    for(let i = 0; i < $KEY.value.length; i++){
        if($KEY.value[i] == keyLetter){
            for(let j = 1; j < ALPHABET.length; j++){
                if(matrix[i + 1][j] == cipheredLetter){
                    return j;  
                }  
            }
        }
    }
    return 0;
}

function ciphering(){
    if (checkEmpty()){
        alert("There are an empty fields!!!");
    }
    else {
        $KEY.value = parseInpStr($KEY.value);
        $KEY.value = correctKey($KEY.value);
        
        $BASETEXT.value = parseInpStr($BASETEXT.value)
        if($KEY.value){
            if(MODE == 0){
                createMatrix($KEY.value.length);
                fillMatrix();
                createVector();
                fillVector();
                createCipherText();
    
                $CIPHERTEXT.value = cipherText;
    
                saveDynamicCipheredDataToFile();
            
            }else{
    
                createMatrix($KEY.value.length);
                fillMatrix();
    
                createVector();
                fillVector();
                createUncipherText();
    
                $CIPHERTEXT.value = uncipherText;
                saveDynamicUncipheredDataToFile();
            }
        }else{
            alert("Incorrect key value")
        }
        
    }
    
}

