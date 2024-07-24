enum RadioMessage {
    message1 = 49434,
    check_plant_wetness = 9373,
    need_water = 18906,
    happy = 4585,
    sad = 2621
}
input.onButtonPressed(Button.A, function () {
    show_wetness = false
    basic.clearScreen()
    basic.showNumber(PlantMonitor.readTemp())
    basic.pause(200)
    show_wetness = true
})
radio.onReceivedMessage(RadioMessage.check_plant_wetness, function () {
    if (PlantMonitor.readWetness() <= 25) {
        radio.sendMessage(RadioMessage.sad)
    } else {
        radio.sendMessage(RadioMessage.happy)
    }
})
input.onButtonPressed(Button.B, function () {
    show_wetness = false
    basic.clearScreen()
    basic.showNumber(PlantMonitor.readHumidity())
    basic.pause(200)
    show_wetness = true
})
let show_wetness = false
radio.setGroup(94107)
PlantMonitor.startMon()
show_wetness = true
loops.everyInterval(1000, function () {
    datalogger.log(
    datalogger.createCV("Temperature", PlantMonitor.readTemp()),
    datalogger.createCV("Humidity", PlantMonitor.readHumidity()),
    datalogger.createCV("Soil Moisture", PlantMonitor.readWetness())
    )
})
loops.everyInterval(60000, function () {
    if (PlantMonitor.readWetness() <= 10) {
        radio.sendMessage(RadioMessage.need_water)
    } else {
        basic.pause(100)
    }
})
basic.forever(function () {
    serial.writeValue("wetness", PlantMonitor.readWetnessAnalog())
    basic.pause(1000)
})
basic.forever(function () {
    if (show_wetness == true) {
        led.plotBarGraph(
        PlantMonitor.readWetness(),
        100
        )
    }
})
