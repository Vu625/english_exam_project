import google.generativeai as genai

# THAY THẾ BẰNG API KEY CỦA BẠN
GEMINI_API_KEY = "AIzaSyC1pwsa7LbW0CBO4MfiV8E11g69plkEVZs"
genai.configure(api_key=GEMINI_API_KEY)

try:
    # Hãy thử gọi cả hai cách để kiểm tra
    # model = genai.GenerativeModel('gemini-pro') # Cách bạn đã thử ban đầu
    model = genai.GenerativeModel('models/gemini-pro') # Cách bạn đã đổi

    print(f"Sử dụng mô hình: {model.model_name}")

    prompt = "Explain in one sentence why is the sky blue?"
    response = model.generate_content(prompt)

    print("Lời giải thích từ Gemini:")
    print(response.text)

except Exception as e:
    print(f"Lỗi khi gọi Gemini API: {e}")