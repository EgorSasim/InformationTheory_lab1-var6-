const $INPFILE = document.querySelector('.decimation-inp--container > input');
const $KEY = document.getElementById('key');
const $BASETEXT = document.getElementById('baseText');
const $CIPHERTEXT = document.getElementById('cipherText');


let $TXTBASE = document.querySelector('.decimation-beginingText--container > span');
let $TXTCIPHER = document.querySelector('.decimation-resultText--container > span');

let anotherALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVW';
let MODE = 0;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let baseText = '';
let cipherText = '';
let uncipherText = '';

let table = {
    3 : 9,
    5 : 21,
    7 : 15,
    9 : 3,
    11 : 19,
    15 : 7,
    17 : 23,
    19 : 11,
    21 : 5,
    23 : 17,
    25 : 25
}

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


function clearTxt(){
    $BASETEXT.value = '';
    $CIPHERTEXT.value = '';
    $KEY.value = '';
}

function clearAll(){
    clearTxt();
    clearInpFile();
}


///// CORRECT KEY
function correctKey(key){
    return Math.abs(key);
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

/////// find appropriate key number via Evklid algorythm
function isCoprime(a, b){
   
    let num;
    while( b ) {
        num = a % b;
        a = b;
        b = num;
    }
    if (Math.abs(a) == 1){
        return true;
    }
    return false;
}



function createCipherText(key){
    let resCipherText = '';
    for(let i = 0; i < $BASETEXT.value.length; i++){
        if(ALPHABET.includes($BASETEXT.value[i])){
            resCipherText += ALPHABET[ALPHABET.indexOf($BASETEXT.value[i]) * key % 26];
        }else{
            resCipherText += $BASETEXT.value[i];
        }
    }
    cipherText = resCipherText;
}


function findCorrectNum(num){
    for(let i = 2; i < ALPHABET.length; i++){
        if(num * i % ALPHABET.length == 1){
            return i;
        }
    }
}

function createUncipherText(key) {
    let resUncipherText = '';
    let decipNum = findCorrectNum(key);
    for(let i = 0; i < $BASETEXT.value.length; i++){
        if(ALPHABET.includes($BASETEXT.value[i])){
            resUncipherText += ALPHABET[ALPHABET.indexOf($BASETEXT.value[i]) * decipNum % ALPHABET.length];
        }
        else{
            resUncipherText += $BASETEXT.value[i];
        }
    }
    uncipherText = resUncipherText;
}

//////////////MAIN FUNCTION

function ciphering(){

    if ($KEY.value){
       $KEY.value = correctKey($KEY.value);
       $BASETEXT.value = parseInpStr($BASETEXT.value)
    }
    if (checkEmpty()){
        alert("There are an empty fields!!!");
    }
    else if(!isCoprime(ALPHABET.length, $KEY.value) || $KEY.value == 1 || $KEY.value == 0){
        alert("As minimum incorrect key");
    }
    else{

        if(MODE == 0){
            createCipherText($KEY.value);
            console.log($BASETEXT.value);
            console.log(cipherText);
            $CIPHERTEXT.value = cipherText;
            saveDynamicCipheredDataToFile();
        }else{
            createUncipherText($KEY.value);
            console.log($BASETEXT.value);
            console.log(uncipherText);
            $CIPHERTEXT.value = uncipherText;
            saveDynamicUncipheredDataToFile();
        }
    }
}


