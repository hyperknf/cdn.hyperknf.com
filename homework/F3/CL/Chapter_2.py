import cloudtranslation
while True:
  option = input("Enter the language (type \"EXIT\" to exit, \"LIST\" to list languages): ")
  if option == "LIST":
    cloudtranslation.list_languages()
    continue
  if option == "EXIT":
    break
  print(f"=> Translated:\n{cloudtranslation.translate(input('Enter text: '), lang = option)}")
print("Program exited")