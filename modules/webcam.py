from streamlit_webrtc import webrtc_streamer, RTCConfiguration

RTC_CONFIGURATION = RTCConfiguration(
    {
        "iceServers": [
            {"urls": ["stun:stun.l.google.com:19302"]}
        ]
    }
)

def start_camera():
    webrtc_streamer(
        key="camera_v2",
        rtc_configuration=RTC_CONFIGURATION,
        media_stream_constraints={
            "video": True,
            "audio": False,
        },
    )