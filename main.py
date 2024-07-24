def on_button_pressed_a():
    global show_wetness
    show_wetness = False
    basic.clear_screen()
    basic.show_number(PlantMonitor.read_temp())
    basic.pause(1000)
    show_wetness = True
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global show_wetness
    show_wetness = False
    basic.clear_screen()
    basic.show_number(PlantMonitor.read_humidity())
    basic.pause(1000)
    show_wetness = True
input.on_button_pressed(Button.B, on_button_pressed_b)

show_wetness = False
PlantMonitor.start_mon()
show_wetness = True

def on_every_interval():
    datalogger.log(datalogger.create_cv("Temperature", PlantMonitor.read_temp()),
        datalogger.create_cv("Humidity", PlantMonitor.read_humidity()),
        datalogger.create_cv("Soil Moisture", PlantMonitor.read_wetness()))
loops.every_interval(1000, on_every_interval)

def on_forever():
    serial.write_value("wetness", PlantMonitor.read_wetness_analog())
    basic.pause(1000)
basic.forever(on_forever)

def on_forever2():
    if show_wetness == True:
        led.plot_bar_graph(PlantMonitor.read_wetness(), 100)
basic.forever(on_forever2)
