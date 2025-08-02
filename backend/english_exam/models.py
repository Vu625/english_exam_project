from django.db import models

# backend/english_exam/models.py
from django.db import models
# Đảm bảo bạn đã có model User nếu đang sử dụng Django's built-in User
# Nếu chỉ dùng Firebase UID, bạn có thể bỏ qua ForeignKey và chỉ dùng CharField

class ChatSession(models.Model):
    # Sử dụng Firebase UID để liên kết với người dùng
    # db_index=True giúp tăng tốc độ tìm kiếm theo UID
    firebase_uid = models.CharField(max_length=128, unique=True, db_index=True)
    # conversations sẽ lưu trữ toàn bộ lịch sử chat dưới dạng JSON string
    # Django's JSONField có thể phù hợp hơn cho các phiên bản Django mới hơn (>3.1)
    # Nếu dùng Text, bạn cần tự serialize/deserialize JSON
    conversations = models.TextField(default="[]") # Mảng JSON string của các message objects
    last_updated = models.DateTimeField(auto_now=True) # Tự động cập nhật khi session thay đổi

    def __str__(self):
        return f"Chat Session for {self.firebase_uid}"

# Model cho UserExerciseProgress sẽ được thêm sau
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
        # Thêm index cho các trường thường xuyên truy vấn để tối ưu hiệu suất
        indexes = [
            models.Index(fields=['firebase_uid']),
            models.Index(fields=['exercise_type', 'topic']),
        ]