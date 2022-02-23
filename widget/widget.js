
// globale variabelen
var aantalKnikkersBoven = 0;    // aantal knikkers dat bovenin is binnengekomen
var wachttijd = 15;             // wachttijd voor het poortje in seconden
const UPDATE_INTERVAL = 5000;   // tijd in milliseconden tussen het door widget opvragen van gegevens
var teller;
var wachtijdInput;
var sensor;
var rad;
var scherm;
var led;
var poortje;
var snelheidsmeter;

/**
 * setup
 * de code in deze functie wordt eenmaal uitgevoerd,
 * als p5js wordt gestart
 */
function setup() {
  // Maak het canvas van je widget
  createCanvas(300, 600);

  teller = new Teller (150, 50);

  // maak een button en stel deze in
  button = createButton('Verander');
  button.position(155, 375);
  button.mouseClicked(stuurNieuweInstellingen);

  wachtijdInput = createInput ();
  wachtijdInput.position = (225, 70);
  wachtijdInput.size(50); 

  // om de ... milliseconden wordt 'vraagSensorData' uitgevoerd
  setInterval(vraagSensorData, UPDATE_INTERVAL);
}


/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  // schrijf hieronder de code van je widget
  // hieronder wordt schematisch een knikkerbaan getekend

  background(71, 71, 70);

  // twee dikke strepen als 'opvangbak'
  stroke(0, 0, 0);
  strokeWeight(10);
  line(50, 20, 135, 60);
  line(250, 20, 165, 60);
  

  // strepen naar trechter 
  line(45, 140, 145, 100);
  line(10, 140, 50, 180); 

  // strepen naar rad
  line(235, 135, 145, 100); // lange streep 
  line(275, 140, 240, 160);
  line(205, 160, 230, 180); // onderste streep direct naar rad
  line(285, 100, 285, 135); 

  // strepen bij rad
  line(90, 385, 280, 300); // streep onder het rad
  line(280, 300, 280, 200); // streep naast het rad

  // strepen bij trechter 
  line(25, 375, 125, 435); // streep direct onder
  line(180, 445, 75, 500); 
  line(15, 505, 130, 580); 

  // scherm 
  fill(237, 185, 198);
  rect(165, 485, 120, 50);

  // trechter 

  stroke(227, 227, 209);
  strokeWeight(2);
  line(15, 215, 115, 235); // stukjes erdoorheen 
  line(15, 255, 115, 245);
  line(15, 265, 115, 295);

  stroke(0, 0, 0);
  strokeWeight(10);
  line(25, 200, 25, 300); // wanden
  line(100, 200, 100, 300); 
  line(25, 300, 50, 325); // inlopende delen
  line(100, 300, 75, 325); 
  line(50, 325, 50, 350);
  line(75, 325, 75, 350);

  // rad 
  stroke(0,0,0); 
  strokeWeight(7);
  line(220, 250, 270, 240); // rechts
  line(220, 250, 220, 200); // top
  line(220, 250, 170, 240); // links
  line(220, 250, 255, 300); // rechts onder
  line(220, 250, 185, 300); // links onder

  // led's 
  stroke('blue');
  fill('blue');
  circle(50, 85, 5);
  stroke('red');
  fill('red');
  circle(250, 85, 5);

  // poortje
  stroke(141, 72, 171);
  line(145, 315, 145, 355);

  // Snelheidsmeter - sensor
  stroke('yellow');
  fill('yellow');
  circle (160, 320, 5);
  circle (160, 350, 5);

  // sensor trechter
  circle (40, 350, 5);
  circle (85, 350, 5);

  // sensor LED BLUE
  circle (80, 130, 5);
  circle (120, 150, 5);

   // sensor LED RED
   circle (210, 130, 5);
   circle (170, 150, 5);

  // arduino elementen
  teller.show();
  
}


// stuurt een verzoek aan de server dat alle
// sensordata opvraagt
function vraagSensorData() {
  var request = new XMLHttpRequest();

  // maak een http-verzoek
  request.open('GET', '/api/get/sensordata', true)

  // wat uitvoeren als het antwoord teruggegeven wordt?
  request.onload = function () {
    var data = JSON.parse(request.response);

    if (request.status == 200) {
      console.log("Dit geeft de server terug:" + data);
      teller.aantal = data.aantalKnikkers;
    }
    else {
      console.log("server reageert niet zoals gehoopt");
      console.log(request.response);
    }
  }

  // verstuur het request
  request.send()
}


// stuurt een http-verzoek aan de server met de
// nieuwe instellingen
function stuurNieuweInstellingen() {
  var request = new XMLHttpRequest();

  // maak een http-verzoek
  request.open('GET', '/api/set/instellingen?wachttijd=' + wachtijdInput.value(), true)

  // wat uitvoeren als het antwoord teruggegeven wordt?
  request.onload = function () {
    if (request.status == 200) {
      // geeft positieve feedback in widget ofzo
      console.log("Server accepteerde instellingen.")
    }
    else {
      console.log("server reageert niet zoals gehoopt.");
      console.log(request.response);
    }
  }

  // verstuur het request
  request.send()
}