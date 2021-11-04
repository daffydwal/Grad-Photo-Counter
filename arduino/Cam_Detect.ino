/*
  DigitalReadSerial

  Reads a digital input on pin 2, prints the result to the Serial Monitor

  This example code is in the public domain.

  https://www.arduino.cc/en/Tutorial/BuiltInExamples/DigitalReadSerial
*/

// digital pin 2 has a pushbutton attached to it. Give it a name:
int pushButton = 2;
bool btnPressed = false;
int numberShots = 1;

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // make the pushbutton's pin an input:
  pinMode(pushButton, INPUT_PULLUP);
}

// the loop routine runs over and over again forever:
void loop() {
  // read the input pin:
  bool buttonState = digitalRead(pushButton);

  if (!buttonState && !btnPressed){
      Serial.print(numberShots);
      btnPressed = true;
      numberShots++;
    }

  if (buttonState && btnPressed){
    btnPressed = false;
    //Serial.println("Release!!");
    }
  
  // print out the state of the button:
  delay(1);        // delay in between reads for stability
}
