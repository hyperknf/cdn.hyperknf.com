import cloudspeech, display

time = str()
while not time.isdecimal(): time = input("Enter recording time: ")
time = int(time)

print("Started recording")
cloudspeech.record(time)
print("Stopped recording")
display.showWaveform()