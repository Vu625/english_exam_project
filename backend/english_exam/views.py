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
from .models import ChatSession 
from english_exam.models import VocabularyQuestion # <--- Đảm bảo là english_exam.models
from english_exam.serializers import VocabularyQuestionSerializer # <--- Đảm bảo là english_exam.serializers
from rest_framework import generics

GEMINI_API_KEY = "AIzaSyC1pwsa7LbW0CBO4MfiV8E11g69plkEVZs" 
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash') 

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
                print(f"Lỗi khi gọi Google Gemini API cho chatbot: {e}")
                return Response({'error': 'Failed to get advice from AI for chatbot. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # --- LOGIC CŨ: Xử lý lời khuyên bài thi ---
        wrong_questions = data.get('incorrect_details', [])

        if not wrong_questions:
            # Nếu không có câu sai, trả về lời động viên và không có đề xuất bài tập
            return Response({'advice': 'Bạn đã làm rất tốt! Không có điểm ngữ pháp nào cần củng cố.', 'recommended_topics': []})

        combined_info = "Các câu sau đây bạn đã làm sai hoặc chưa làm:\n\n"
        grammar_points = set() 
        
        # Danh sách các chủ đề ngữ pháp mà website của bạn đang có (thêm hoặc xóa nếu cần)
        # Tên trong list này phải khớp với tên file JSON (ví dụ: hien-tai.json -> 'hien-tai')
        available_grammar_topics = [
            'hien-tai', 
            'qua-khu', 
            'tuong-lai', 
            'bi-dong', 
            'so-sanh',
            'dieu-kien',
            'dong-tu-khuyet-thieu',
            'gia-dinh',
            'gian-tiep',
            'tu-loai',
            'menh-de-quan-he'
        ]
        
        # Chuyển đổi sang định dạng thân thiện hơn để in ra prompt
        available_grammar_topics_vietnamese = {
            'hien-tai': 'Các thì hiện tại',
            'qua-khu': 'Các thì quá khứ',
            'tuong-lai': 'Các thì tương lai',
            'bi-dong': 'Câu bị động',
            'so-sanh': 'Cấu trúc so sánh',
            'dieu-kien': 'Câu Điều Kiện',
            'dong-tu-khuyet-thieu': 'Đông từ khuyết thiếu',
            'gia-dinh':'Câu giả định',
            'gian-tiep': 'Câu gián tiếp',
            'tu-loai': 'Từ Loại',
            'menh-de-quan-he':'Mệnh Đề Quan hệ'
        }

        for q_info in wrong_questions:
            question_text = q_info.get('question_text', 'N/A') # Đổi 'question' thành 'question_text' để khớp với SubmitExamView
            selected_answer = q_info.get('user_answer', 'N/A') # Đổi 'selected_answer' thành 'user_answer'
            correct_answer = q_info.get('correct_answer_value', 'N/A') # Đổi 'correct_answer' thành 'correct_answer_value'
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
            f"Bạn là một Chatbot hỗ trợ tiếng anh thông minh của một website ôn tiếng anh,người dùng đã làm một bài kiểm tra tiếng Anh và làm sai các câu sau. "
            f"Bạn hãy phân tích các lỗi sai dựa trên các điểm ngữ pháp liên quan và đưa ra lời khuyên cụ thể, "
            f"dễ hiểu để người dùng có thể cải thiện. "
            f"Đặc biệt chú ý đến các điểm ngữ pháp sau: {', '.join(grammar_points) if grammar_points else 'không có điểm ngữ pháp cụ thể nào được cung cấp'}.\n\n"
            f"Thông tin các câu sai:\n{combined_info}\n\n"
            f"Dưới đây là danh sách các chủ đề ngữ pháp mà website có, được định dạng theo slug (tên file json): "
            f"{', '.join([f'{k} ({v})' for k, v in available_grammar_topics_vietnamese.items()])}. "
            f"Dựa trên các lỗi sai của người dùng, hãy đề xuất TỐI ĐA 3 bài tập ngữ pháp cần thiết nhất từ danh sách trên để người dùng ôn luyện, "
            f"đặt mỗi đề xuất trong cặp ký hiệu '@@@' (ví dụ: @@@hien-tai@@@, @@@bi-dong@@@, @@@tuong-lai@@@) ở CUỐI CÙNG của lời khuyên của bạn. "
            f"Nếu không có đề xuất nào phù hợp hoặc đủ quan trọng, KHÔNG cần thêm các cặp '@@@'."
        )

        try:
            response = model.generate_content(
                full_prompt,
                safety_settings=safety_settings
            )
            raw_advice_text = response.text

            # Trích xuất các đề xuất từ phản hồi của AI
            recommended_topics_slugs = []
            import re
            # Sử dụng regex để tìm tất cả các chuỗi trong '@@@...@@@'
            matches = re.findall(r'@@@(.*?)@@@', raw_advice_text)
            for match in matches:
                # Chỉ thêm vào nếu topic này có trong danh sách cho phép của bạn
                if match in available_grammar_topics:
                    recommended_topics_slugs.append(match)
            
            # Xóa các tag @@@ khỏi nội dung lời khuyên chính
            cleaned_advice = re.sub(r'@@@.*?@@@', '', raw_advice_text).strip()

            return Response({
                'advice': cleaned_advice,
                'recommended_topics': recommended_topics_slugs
            })
        except Exception as e:
            print(f"Lỗi khi gọi Google Gemini API: {e}")
            return Response({'error': 'Failed to get advice from AI. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExerciseQuestionsView(APIView):
    def get(self, request, topic):
        base_data_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'cac_thi')
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

class ReadingQuestionsView(APIView):
    def get(self, request, topic):
        base_data_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'reading')

        file_name = f"{topic}.json" # Sẽ là "doan-van.json"
        file_path = os.path.join(base_data_path, file_name)

        print(f"Attempting to load reading file from: {file_path}") # Dòng debug

        if not os.path.exists(file_path):
            return Response({'error': f'Reading topic "{topic}" not found or file "{file_name}" does not exist at "{file_path}". Please check file name and path.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            return Response(questions)
        except Exception as e:
            print(f"Lỗi khi đọc file JSON cho chủ đề đọc hiểu '{topic}': {e}")
            return Response({'error': f'Failed to load reading questions for topic "{topic}": {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ... (các imports và classes hiện có của bạn)

class VocabularyExerciseView(generics.ListAPIView):
    serializer_class = VocabularyQuestionSerializer

    def get_queryset(self):
        topic = self.kwargs['topic'] # Lấy 'topic' từ URL
        # Lọc các câu hỏi dựa trên chủ đề
        return VocabularyQuestion.objects.filter(topic=topic)

class VocabularyQuestionsView(APIView):
    def get(self, request, topic):
        # Đường dẫn đến thư mục 'vocabulary' trong static
        base_data_path = os.path.join(settings.BASE_DIR, 'english_exam', 'static', 'vocabulary')
        
        file_name = f"{topic}.json" 
        file_path = os.path.join(base_data_path, file_name)

        print(f"Attempting to load vocabulary file from: {file_path}") # Dòng debug

        if not os.path.exists(file_path):
            return Response({'error': f'Vocabulary topic "{topic}" not found or file "{file_name}" does not exist at "{file_path}". Please check file name and path.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)
            return Response(questions)
        except Exception as e:
            print(f"Lỗi khi đọc file JSON cho chủ đề từ vựng '{topic}': {e}")
            return Response({'error': f'Failed to load vocabulary questions for topic "{topic}": {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatView(APIView):
    def post(self, request):
        firebase_uid = request.data.get('user_id')
        user_message = request.data.get('message')
        # NHẬN DỮ LIỆU NGỮ CẢNH MỚI
        current_question_data = request.data.get('current_question_data', None)
        grammar_topic = request.data.get('grammar_topic', None)

        if not firebase_uid or not user_message:
            return Response({'error': 'Missing user_id or message'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_session, created = ChatSession.objects.get_or_create(firebase_uid=firebase_uid)
            
            history = json.loads(chat_session.conversations)
            limited_history = history[-20:] # Giới hạn 20 tin nhắn gần nhất

            # Xây dựng prompt cho Gemini, bao gồm ngữ cảnh
            full_user_message = user_message
            if current_question_data:
                # Thêm thông tin câu hỏi vào prompt nếu có
                question_text = current_question_data.get('Question', '')
                options = []
                if current_question_data.get('A'): options.append(f"A: {current_question_data['A']}")
                if current_question_data.get('B'): options.append(f"B: {current_question_data['B']}")
                if current_question_data.get('C'): options.append(f"C: {current_question_data['C']}")
                if current_question_data.get('D'): options.append(f"D: {current_question_data['D']}")
                
                question_options_str = "\n".join(options)
                
                context_prefix = f"Bạn là một chatbot thông minh và đang hỗ trợ người dùng học tập. Hãy dựa vào các thông tin dưới đây để trả lời người dùng, tuyệt đối không được tiếc lộ đáp án. Người dùng đang làm bài tập. Câu hỏi hiện tại là: '{question_text}'"
                if question_options_str:
                    context_prefix += f"\nCác lựa chọn: {question_options_str}"
                if current_question_data.get('Answer'):
                    context_prefix += f"\nĐáp án đúng là: '{current_question_data['Answer']}'."
                if current_question_data.get('Explain'):
                    context_prefix += f"\nGiải thích có sẵn: '{current_question_data['Explain']}'."
                
                if grammar_topic:
                    context_prefix += f"\nChủ đề ngữ pháp liên quan: '{grammar_topic}'."
                
                context_prefix += f"\n\nCâu hỏi của người dùng: "
                full_user_message = context_prefix + user_message
            elif grammar_topic:
                full_user_message = f"Người dùng đang làm bài tập với chủ đề ngữ pháp: '{grammar_topic}'.\n\nCâu hỏi của người dùng: {user_message}"

            # Thêm tin nhắn của người dùng (đã có ngữ cảnh) vào lịch sử
            limited_history.append({"role": "user", "parts": [{"text": full_user_message}]})

            # Chuyển đổi định dạng để gửi cho Gemini
            gemini_history = [{"role": msg['role'], "parts": msg['parts']} for msg in limited_history]

            chat = model.start_chat(history=gemini_history)
            response = chat.send_message(full_user_message, safety_settings=safety_settings) # <--- Gửi full_user_message
            model_message = response.text

            # Thêm tin nhắn của model vào lịch sử
            limited_history.append({"role": "model", "parts": [{"text": model_message}]})

            chat_session.conversations = json.dumps(limited_history)
            chat_session.save()

            return Response({'response': model_message})

        except Exception as e:
            print(f"Lỗi khi xử lý chat: {e}")
            return Response({'error': f'Không thể xử lý tin nhắn: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def get(self, request):
        firebase_uid = request.query_params.get('user_id')

        if not firebase_uid:
            return Response({'error': 'Missing user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_session = ChatSession.objects.get(firebase_uid=firebase_uid)
            history = json.loads(chat_session.conversations)
            return Response({'history': history})
        except ChatSession.DoesNotExist:
            return Response({'history': []}) # Trả về mảng rỗng nếu chưa có session
        except Exception as e:
            print(f"Lỗi khi tải lịch sử chat: {e}")
            return Response({'error': f'Không thể tải lịch sử chat: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)