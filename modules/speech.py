import speech_recognition as sr

def speech_to_text():

    print("FUNCTION CALLED")

    recognizer = sr.Recognizer()

    try:

        with sr.Microphone() as source:

            print("Listening...")

            recognizer.adjust_for_ambient_noise(
                source,
                duration=1
            )

            audio = recognizer.listen(
                source,
                timeout=10,
                phrase_time_limit=20
            )

            print("Audio Captured")

            text = recognizer.recognize_google(
                audio,
                language="en-IN"
            )

            print("Recognized Text:", text)

            return text

    except sr.UnknownValueError:

        print("Could not understand audio")

        return "Error: Could not understand audio"

    except sr.RequestError as e:

        print("Google API Error:", e)

        return f"Error: {e}"

    except Exception as e:

        print("General Error:", e)

        return f"Error: {e}"