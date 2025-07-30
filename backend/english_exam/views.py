from django.shortcuts import render

# Create your views here.
import json
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold 
# from openai import OpenAI # Sử dụng thư viện OpenAI để kết nối LM Studio

        # Khởi tạo OpenAI client để kết nối tới LM Studio
        # LM Studio mặc định chạy trên localhost:1234
# lm_studio_client = OpenAI(
#             base_url="http://192.168.1.22:1234/v1", # Đây là endpoint của LM Studio
# api_key="lm-studio" # API Key không quan trọng với LM Studio, có thể đặt bất kỳ
#         )

GEMINI_API_KEY = "AIzaSyC1pwsa7LbW0CBO4MfiV8E11g69plkEVZs" # <--- THAY THẾ DÒNG NÀY !!!
genai.configure(api_key=GEMINI_API_KEY)

# Khởi tạo mô hình Gemini
# Sử dụng 'gemini-pro' cho các tác vụ văn bản
model = genai.GenerativeModel('gemini-2.5-flash') # <-- THÊM 'models/' vào đây

safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}

class ExamQuestionsView(APIView):
            def get(self, request):
                json_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'De_1.json')
                try:
                    with open(json_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    # Chúng ta chỉ gửi câu hỏi và các lựa chọn, không gửi đáp án
                    questions_for_frontend = []
                    for q in data:
                        questions_for_frontend.append({
                            'id': q['ID'], # Thêm ID để frontend dễ quản lý
                            'question': q['Question'],
                            'A': q['A'],
                            'B': q['B'],
                            'C': q['C'],
                            'D': q['D'],
                            # Không bao gồm 'Answer', 'Explain', 'Grammar'
                        })
                    return Response(questions_for_frontend)
                except FileNotFoundError:
                    return Response({"error": "Exam data not found."}, status=status.HTTP_404_NOT_FOUND)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubmitExamView(APIView):
            def post(self, request):
                user_answers = request.data.get('answers', {})
                
                json_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'De_1.json')
                try:
                    with open(json_path, 'r', encoding='utf-8') as f:
                        exam_data = json.load(f)
                except FileNotFoundError:
                    return Response({"error": "Exam data not found."}, status=status.HTTP_404_NOT_FOUND)

                score = 0
                incorrect_details = []

                for q_data in exam_data:
                    q_id = str(q_data['ID']) # Đảm bảo ID là string để so sánh
                    correct_answer_letter = q_data['Answer']
                    actual_correct_value = q_data[correct_answer_letter]
                    user_ans_value = user_answers.get(q_id) # Lấy đáp án của người dùng theo ID

                    if user_ans_value == actual_correct_value:
                        score += 1
                    else:
                        incorrect_details.append({
                            "question_id": q_id,
                            "question_text": q_data['Question'],
                            "user_answer": user_ans_value,
                            "correct_answer_value": actual_correct_value,
                            "explanation": q_data['Explain'],"grammar": q_data['Grammar'],
                        })
                
                total_questions = len(exam_data)
                
                response_data = {
                    "score": score,
                    "total_questions": total_questions,
                    "incorrect_details": incorrect_details
                }
                return Response(response_data)

class GetAdviceView(APIView):
    def post(self, request):
        data = request.data
        
        # --- LOGIC MỚI: Xử lý prompt từ Chatbot ---
        if 'chatbot_prompt' in data:
            user_prompt = data.get('chatbot_prompt')
            if not user_prompt:
                return Response({'error': 'No chatbot_prompt provided.'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                # Gọi Gemini với prompt từ chatbot
                response = model.generate_content(
                    user_prompt,
                    safety_settings=safety_settings
                )
                return Response({'advice': response.text})
            except Exception as e:
                # Log lỗi để debug
                print(f"Lỗi khi gọi Google Gemini API cho chatbot: {e}")
                return Response({'error': 'Failed to get advice from AI for chatbot. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- LOGIC CŨ: Xử lý lời khuyên bài thi ---
        wrong_questions = data.get('question_infos', [])

        if not wrong_questions:
            # Nếu không có câu sai, trả về lời động viên
            return Response({'advice': 'Bạn đã làm rất tốt! Không có điểm ngữ pháp nào cần củng cố.'})

        combined_info = "Các câu sau đây bạn đã làm sai hoặc chưa làm:\n\n"
        grammar_points = set() # Sử dụng set để tránh trùng lặp
        
        for q_info in wrong_questions:
            question_text = q_info.get('question', 'N/A')
            selected_answer = q_info.get('selected_answer', 'N/A')
            correct_answer = q_info.get('correct_answer', 'N/A')
            explanation = q_info.get('explanation', 'N/A')
            grammar_topic = q_info.get('grammar', 'Chưa xác định') # Lấy trường 'Grammar'

            combined_info += f"Câu hỏi: {question_text}\n"
            combined_info += f"Bạn đã chọn: {selected_answer}\n"
            combined_info += f"Đáp án đúng: {correct_answer}\n"
            combined_info += f"Giải thích ngắn gọn: {explanation}\n"
            combined_info += f"Điểm ngữ pháp liên quan: {grammar_topic}\n\n"
            
            if grammar_topic != 'Chưa xác định':
                grammar_points.add(grammar_topic)

        # Xây dựng prompt cho AI
        full_prompt = (
            f"Tôi đã làm một bài kiểm tra tiếng Anh và làm sai các câu sau. "
            f"Bạn hãy phân tích các lỗi sai dựa trên các điểm ngữ pháp liên quan và đưa ra lời khuyên cụ thể, "
            f"dễ hiểu để tôi có thể cải thiện. "
            f"Đặc biệt chú ý đến các điểm ngữ pháp sau: {', '.join(grammar_points) if grammar_points else 'không có điểm ngữ pháp cụ thể nào được cung cấp'}.\n\n"
            f"Thông tin các câu sai:\n{combined_info}"
        )

        try:
            response = model.generate_content(
                full_prompt,
                safety_settings=safety_settings
            )
            return Response({'advice': response.text})
        except Exception as e:
            print(f"Lỗi khi gọi Google Gemini API: {e}")
            return Response({'error': 'Failed to get advice from AI. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExerciseQuestionsView(APIView):
    def get(self, request, topic):
        # Chuyển đổi topic từ gạch ngang sang gạch dưới để khớp với tên file JSON
        # (Nếu bạn đã đổi tên file JSON thành hien-tai.json và qua-khu.json, thì bỏ qua dòng này)
        #actual_topic_name = topic.replace('-', '_') # GIỮ LẠI DÒNG NÀY NẾU FILE VẪN LÀ hien_tai.json, XÓA NẾU ĐÃ ĐỔI TÊN

        # Xây dựng đường dẫn đến thư mục 'cac_thi' trong static
        # Đảm bảo đường dẫn này khớp với vị trí thư mục của bạn
        base_data_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'cac_thi')
        
        # Sử dụng actual_topic_name để xây dựng tên file
        # (Nếu bạn đã đổi tên file JSON thành hien-tai.json và qua-khu.json, thì đổi lại thành topic.json)
        # file_name = f"{actual_topic_name}.json" # SỬ DỤNG actual_topic_name NẾU FILE LÀ hien_tai.json, SỬ DỤNG topic NẾU FILE LÀ hien-tai.json
        file_name = f"{topic}.json"
        file_path = os.path.join(base_data_path, file_name)

        # DEBUG: In đường dẫn để kiểm tra
        print(f"Attempting to load file from: {file_path}")

        if not os.path.exists(file_path):
            # Cung cấp gợi ý lỗi rõ ràng hơn
            return Response({'error': f'Topic "{topic}" not found or file "{file_name}" does not exist at "{file_path}". Please check file name and path.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            return Response(questions)
        except Exception as e:
            # Log lỗi chi tiết để debug
            print(f"Lỗi khi đọc file JSON cho topic '{topic}': {e}")
            return Response({'error': f'Failed to load questions for topic "{topic}": {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)