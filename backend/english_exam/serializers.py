from rest_framework import serializers
from english_exam.models import VocabularyQuestion# Đảm bảo import đúng model của bạn

class VocabularyQuestionSerializer(serializers.ModelSerializer):
    # Đổi tên các trường để khớp với frontend của bạn (Question, A, B, C, D, Answer, Explain)
    Question = serializers.CharField(source='question_text')
    A = serializers.CharField(source='option_a')
    B = serializers.CharField(source='option_b')
    C = serializers.CharField(source='option_c')
    D = serializers.CharField(source='option_d')
    Answer = serializers.CharField(source='correct_answer')
    Explain = serializers.CharField(source='explanation')
    # Thêm ID nếu bạn muốn frontend nhận ID
    ID = serializers.IntegerField(source='id')

    class Meta:
        model = VocabularyQuestion
        fields = ['ID', 'Question', 'A', 'B', 'C', 'D', 'Answer', 'Explain']
        # Hoặc nếu bạn muốn tất cả các trường: fields = '__all__'