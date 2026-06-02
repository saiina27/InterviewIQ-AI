from streamlit_webrtc import webrtc_streamer

def start_camera():
    webrtc_streamer(
        key="interview-camera",
        media_stream_constraints={
            "video": True,
            "audio": False
        }
    )