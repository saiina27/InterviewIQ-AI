import cv2

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades +
    "haarcascade_frontalface_default.xml"
)


def detect_cheating(frame):

    gray = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )

    result = {
        "status": "OK",
        "face_count": len(faces),
        "warning": None
    }

    if len(faces) == 0:
        result["status"] = "CHEATING"
        result["warning"] = "NO_FACE"
        return result

    if len(faces) > 1:
        result["status"] = "CHEATING"
        result["warning"] = "MULTIPLE_FACES"
        return result

    x, y, w, h = faces[0]

    h_img, w_img = frame.shape[:2]

    center_x = x + w / 2
    center_y = y + h / 2

    if (
        center_x < w_img * 0.25
        or center_x > w_img * 0.75
        or center_y < h_img * 0.25
        or center_y > h_img * 0.75
    ):
        result["status"] = "WARNING"
        result["warning"] = "FACE_NOT_CENTER"

    return result