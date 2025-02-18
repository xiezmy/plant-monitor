enum RadioMessage {
    check_light = 55679,
    nighttime = 53104,
    play_music = 42561,
    sad = 2621,
    happy = 4585,
    check_plant_wetness = 9373,
    need_water = 18906,
    check_humidity = 20801,
    message1 = 49434
}
radio.onReceivedMessage(RadioMessage.check_humidity, function () {
    if (PlantMonitor.readHumidity() > 60) {
        radio.sendMessage(RadioMessage.sad)
        basic.pause(1000)
        radio.sendString("" + (PlantMonitor.readHumidity()))
    } else if (PlantMonitor.readHumidity() < 40) {
        radio.sendMessage(RadioMessage.sad)
        basic.pause(1000)
        radio.sendString("" + (PlantMonitor.readHumidity()))
    } else {
        radio.sendMessage(RadioMessage.happy)
        basic.pause(1000)
        radio.sendString("" + (PlantMonitor.readHumidity()))
    }
})
input.onButtonPressed(Button.A, function () {
    show_wetness = false
    basic.clearScreen()
    basic.showNumber(PlantMonitor.readWetness())
    basic.pause(200)
    show_wetness = true
})
radio.onReceivedMessage(RadioMessage.play_music, function () {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Prelude), music.PlaybackMode.InBackground)
})
radio.onReceivedMessage(RadioMessage.check_plant_wetness, function () {
    if (PlantMonitor.readWetness() <= 25) {
        radio.sendMessage(RadioMessage.sad)
        basic.pause(1000)
        radio.sendString("" + (PlantMonitor.readWetness()))
    } else {
        radio.sendMessage(RadioMessage.happy)
        basic.pause(1000)
        radio.sendString("" + (PlantMonitor.readWetness()))
    }
})
radio.onReceivedMessage(RadioMessage.check_light, function () {
    if (daytime == true) {
        if (input.lightLevel() >= 150) {
            radio.sendMessage(RadioMessage.happy)
            basic.pause(1000)
            radio.sendString("" + (input.lightLevel()))
        } else {
            radio.sendMessage(RadioMessage.sad)
            basic.pause(1000)
            radio.sendString("" + (input.lightLevel()))
        }
    } else {
        radio.sendMessage(RadioMessage.nighttime)
        basic.pause(1000)
        if (input.lightLevel() >= 150) {
            radio.sendMessage(RadioMessage.sad)
            basic.pause(1000)
            radio.sendString("" + (input.lightLevel()))
        } else {
            radio.sendMessage(RadioMessage.happy)
            basic.pause(1000)
            radio.sendString("" + (input.lightLevel()))
        }
    }
})
input.onButtonPressed(Button.B, function () {
    show_wetness = false
    basic.clearScreen()
    basic.showNumber(PlantMonitor.readHumidity())
    basic.pause(200)
    show_wetness = true
})
let daytime = false
let show_wetness = false
radio.setGroup(99)
PlantMonitor.startMon()
show_wetness = true
loops.everyInterval(1000, function () {
    datalogger.log(
    datalogger.createCV("Temperature", PlantMonitor.readTemp()),
    datalogger.createCV("Humidity", PlantMonitor.readHumidity()),
    datalogger.createCV("Soil Moisture", PlantMonitor.readWetness())
    )
})
basic.forever(function () {
    if (show_wetness == true) {
        led.plotBarGraph(
        PlantMonitor.readWetness(),
        100
        )
    }
})
basic.forever(function () {
    serial.writeValue("wetness", PlantMonitor.readWetnessAnalog())
    basic.pause(1000)
})
loops.everyInterval(86400000, function () {
    daytime = true
    basic.pause(43200000)
    daytime = false
})
loops.everyInterval(3600000, function () {
    if (PlantMonitor.readWetness() <= 10) {
        radio.sendMessage(RadioMessage.need_water)
    } else {
        basic.pause(100)
    }
})
