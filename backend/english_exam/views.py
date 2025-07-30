from django.shortcuts import render

# Create your views here.
import json
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
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
        incorrect_details_from_frontend = request.data.get('incorrect_details', [])
        
        if not incorrect_details_from_frontend:
            return Response({"advice": "Bạn đã làm rất tốt! Không có điểm ngữ pháp nào cần củng cố."})

        grammar_points = []
        for detail in incorrect_details_from_frontend:
            if detail.get('grammar'):
                grammar_points.append(f"- Chủ điểm: {detail['grammar']}\n  Giải thích: {detail['explanation']}")
            else:
                grammar_points.append(f"- Câu hỏi: {detail['question_text']}\n  Giải thích: {detail['explanation']}")

        combined_info = "\n\n".join(grammar_points)

        # Điều chỉnh prompt để kết hợp vai trò system vào user
        # Chúng ta sẽ đưa hướng dẫn về vai trò của AI vào ngay đầu prompt của user
        full_prompt = f"""Bạn là một gia sư tiếng Anh chuyên nghiệp và thân thiện, có khả năng phân tích lỗi ngữ pháp và đưa ra lời khuyên học tập hiệu quả.
        
        Tôi đã làm một bài thi tiếng Anh và mắc lỗi trong các câu sau. Dưới đây là các chủ điểm ngữ pháp và giải thích cho từng câu sai:\n\n{combined_info}\n\nDựa vào những thông tin này, hãy tổng hợp và đưa ra một lời khuyên cụ thể, chi tiết về các điểm ngữ pháp hoặc kiến thức mà tôi cần củng cố để cải thiện trình độ tiếng Anh của mình. Hãy đưa ra các ví dụ nếu cần và đề xuất cách học hiệu quả. Chỉ tập trung vào các điểm ngữ pháp được liệt kê. Cung cấp lời khuyên bằng tiếng Việt."""

        try:
            # Gọi API của LM Studio, chỉ với vai trò user
            # completion = lm_studio_client.chat.completions.create(
            #     model="mistralai/Mistral-7B-Instruct-v0.2", # Đảm bảo tên model chính xác
            #     messages=[
            #         {"role": "user", "content": full_prompt} # CHỈ CÓ VAI TRÒ "user"
            #     ],
            #     temperature=0.7,
            #     max_tokens=500
            # )
            response = model.generate_content(full_prompt)
            advice = response.text
            return Response({"advice": advice})
        except Exception as e:
            print(f"Lỗi khi gọi Google Gemini API: {e}")
            return Response({"advice": f"Đã xảy ra lỗi khi tạo lời khuyên từ AI: {e}. Vui lòng kiểm tra Lỗi khi gọi Google Gemini API server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExerciseQuestionsView(APIView):
    def get(self, request, topic):
        # Xây dựng đường dẫn đến thư mục 'cac_thi' trong static
        base_data_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'cac_thi')

        # Xây dựng tên file dựa trên topic (ví dụ: hien_tai -> hien_tai.json)
        file_name = f"{topic}.json"
        file_path = os.path.join(base_data_path, file_name)

        if not os.path.exists(file_path):
            return Response({'error': f'Topic "{topic}" not found or file does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            return Response(questions)
        except Exception as e:
            return Response({'error': f'Failed to load questions for topic "{topic}": {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# (Nếu bạn có thêm các hàm helper nào khác thì giữ lại)