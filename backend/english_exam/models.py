from django.db import models
from django.db import models

class ChatSession(models.Model):
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    conversations = models.TextField(default="[]")
    last_updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Chat Session for {self.firebase_uid}"
class UserExerciseProgress(models.Model):
    firebase_uid = models.CharField(max_length=128, db_index=True) # ID từ Firebase
    exercise_type = models.CharField(max_length=50) # 'grammar' hoặc 'reading'
    topic = models.CharField(max_length=100) # 'hien-tai', 'doan-van'
    total_questions = models.IntegerField()
    correct_answers = models.IntegerField()
    score = models.FloatField(null=True, blank=True) # correct_answers / total_questions
    completed_at = models.DateTimeField(auto_now_add=True) # Tự động thêm timestamp khi tạo
    def __str__(self):
        return f"{self.firebase_uid} - {self.exercise_type} - {self.topic} - {self.score*100:.2f}%"
    class Meta:
        verbose_name_plural = "User Exercise Progress"
        indexes = [
            models.Index(fields=['firebase_uid']),
            models.Index(fields=['exercise_type', 'topic']),
        ]

class VocabularyQuestion(models.Model):
    # ID sẽ tự động tạo bởi Django
    topic = models.CharField(max_length=100, help_text="Chủ đề từ vựng (ví dụ: 'gia-dinh', 'dong-vat')")
    question_text = models.TextField(help_text="Nội dung câu hỏi từ vựng")
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])
    explanation = models.TextField(blank=True, null=True, help_text="Giải thích đáp án (tùy chọn)")

    def __str__(self):
        return f"Vocab Q {self.id} ({self.topic}): {self.question_text[:50]}..."

    class Meta:
        verbose_name = "Câu hỏi từ vựng"
        verbose_name_plural = "Câu hỏi từ vựng"