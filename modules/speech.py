import speech_recognition as sr

def speech_to_text():

    r = sr.Recognizer()

    try:
        with sr.Microphone() as source:

            print("Listening...")

            r.adjust_for_ambient_noise(source)

            audio = r.listen(source)

            text = r.recognize_google(audio)

            return text

    except Exception as e:
        return str(e)