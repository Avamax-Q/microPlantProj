#include <DHT.h>

// Sensor pins
#define R0581_ANALOG_PIN A0
#define RO313_PIN 2
DHT dht(RO313_PIN, DHT11);

const long SEND_INTERVAL = 15000;  // 45 seconds
unsigned long previousSend = 0;

void setup() {
  Serial.begin(9600);  // Initialize Serial Monitor
  dht.begin();
  pinMode(R0581_ANALOG_PIN, INPUT);
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousSend >= SEND_INTERVAL) {
    previousSend = currentMillis;

    // Read sensor data
    float soilMoisture = analogRead(R0581_ANALOG_PIN); 
    soilMoisture = soilMoisture ;
    float humidity = dht.readHumidity() - 10;
    float temperature = dht.readTemperature();

    // Print data to Serial Monitor
Serial.print(soilMoisture);
Serial.print(", ");
Serial.print(temperature);
Serial.print(", ");
Serial.println(humidity);
    

    delay(1000);  // Small delay before the next reading
  }
}
