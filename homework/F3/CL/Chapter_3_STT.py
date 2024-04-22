import cloudspeech
print("Say something...")
while True:
  text = cloudspeech.recognise()
  if text == None: print("I wasn't able to hear you. Please try again.")
  else:
    print(f"You said:\n{text}")
  break
print("Program exited")