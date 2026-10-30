from datetime import datetime
from uuid import uuid4

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, ForeignKey, Index, Integer, String, Text, DateTime, Boolean, JSON, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

db = SQLAlchemy()


def uuid_string():
    return str(uuid4())


class Company(db.Model):
    __tablename__ = "Company"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    name = db.Column(String, nullable=False)
    slug = db.Column(String, nullable=False, unique=True)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column("updatedAt", DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    universities = relationship("University", back_populates="company", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="company", cascade="all, delete-orphan")


class University(db.Model):
    __tablename__ = "University"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    company_id = db.Column("companyId", Uuid(as_uuid=False), ForeignKey('Company.id', ondelete='CASCADE'), nullable=False, index=True)
    name = db.Column(String, nullable=False)
    slug = db.Column(String, nullable=False)
    company = relationship("Company", back_populates="universities")
    courses = relationship("Course", back_populates="university", cascade="all, delete-orphan", order_by="Course.title")
    materials = relationship("StudyMaterial", back_populates="university")
    __table_args__ = (db.UniqueConstraint("companyId", "slug", name="University_companyId_slug_key"),)


class Course(db.Model):
    __tablename__ = "Course"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    university_id = db.Column("universityId", Uuid(as_uuid=False), ForeignKey('University.id', ondelete='CASCADE'), nullable=False, index=True)
    title = db.Column(String, nullable=False)
    slug = db.Column(String, nullable=False)
    university = relationship("University", back_populates="courses")
    materials = relationship("StudyMaterial", back_populates="course")
    __table_args__ = (db.UniqueConstraint("universityId", "slug", name="Course_universityId_slug_key"),)


class StudyMaterial(db.Model):
    __tablename__ = "StudyMaterial"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    company_id = db.Column("companyId", Uuid(as_uuid=False), ForeignKey('Company.id', ondelete='CASCADE'), nullable=False)
    university_id = db.Column("universityId", Uuid(as_uuid=False), ForeignKey('University.id', ondelete='CASCADE'), nullable=False)
    course_id = db.Column("courseId", Uuid(as_uuid=False), ForeignKey('Course.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(String, nullable=False)
    type = db.Column(Enum('QUESTION_BANK', 'SHORT_NOTE', 'FULL_BOOK', name='MaterialType'), nullable=False)
    is_published = db.Column("isPublished", Boolean, nullable=False, default=False)
    file_path = db.Column("filePath", String)
    file_name = db.Column("fileName", String)
    file_size = db.Column("fileSize", Integer)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column("updatedAt", DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    company = relationship("Company")
    university = relationship("University", back_populates="materials")
    course = relationship("Course", back_populates="materials")
    chunks = relationship("StudyChunk", back_populates="material", cascade="all, delete-orphan", order_by="StudyChunk.created_at")
    __table_args__ = (Index('StudyMaterial_companyId_universityId_courseId_isPublished_idx', 'companyId', 'universityId', 'courseId', 'isPublished'),)


class StudyChunk(db.Model):
    __tablename__ = "StudyChunk"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    material_id = db.Column("materialId", Uuid(as_uuid=False), ForeignKey('StudyMaterial.id', ondelete='CASCADE'), nullable=False, index=True)
    content = db.Column(Text, nullable=False)
    page_number = db.Column("pageNumber", Integer)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    material = relationship("StudyMaterial", back_populates="chunks")


class Student(db.Model):
    __tablename__ = "Student"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    company_id = db.Column("companyId", Uuid(as_uuid=False), ForeignKey('Company.id', ondelete='CASCADE'), nullable=False, index=True)
    phone = db.Column(String, nullable=False)
    display_name = db.Column("displayName", String)
    is_phone_verified = db.Column("isPhoneVerified", Boolean, nullable=False, default=False)
    password_hash = db.Column("passwordHash", String)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    company = relationship("Company", back_populates="students")
    subscriptions = relationship("Subscription", back_populates="student", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="student", cascade="all, delete-orphan")
    __table_args__ = (db.UniqueConstraint("companyId", "phone", name="Student_companyId_phone_key"),)


class PhoneVerificationChallenge(db.Model):
    __tablename__ = "PhoneVerificationChallenge"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    company_id = db.Column("companyId", Uuid(as_uuid=False), nullable=False)
    phone = db.Column(String, nullable=False)
    code_hash = db.Column("codeHash", String, nullable=False)
    purpose = db.Column(Enum('REGISTER', 'LOGIN', name='VerificationPurpose'), nullable=False)
    display_name = db.Column("displayName", String)
    password_hash = db.Column("passwordHash", String)
    expires_at = db.Column("expiresAt", DateTime, nullable=False)
    attempts = db.Column(Integer, nullable=False, default=0)
    consumed_at = db.Column("consumedAt", DateTime)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)


class Subscription(db.Model):
    __tablename__ = "Subscription"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    student_id = db.Column("studentId", Uuid(as_uuid=False), ForeignKey('Student.id', ondelete='CASCADE'), nullable=False, index=True)
    status = db.Column(Enum('ACTIVE', 'EXPIRED', 'CANCELED', 'PENDING', name='SubscriptionStatus'), nullable=False, default='PENDING')
    starts_at = db.Column("startsAt", DateTime)
    ends_at = db.Column("endsAt", DateTime)
    provider = db.Column(String)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    student = relationship("Student", back_populates="subscriptions")


class ChatSession(db.Model):
    __tablename__ = "ChatSession"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    student_id = db.Column("studentId", Uuid(as_uuid=False), ForeignKey('Student.id', ondelete='CASCADE'), nullable=False, index=True)
    university_id = db.Column("universityId", Uuid(as_uuid=False), ForeignKey('University.id'), nullable=False)
    course_id = db.Column("courseId", Uuid(as_uuid=False), ForeignKey('Course.id'), nullable=False)
    title = db.Column(String)
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column("updatedAt", DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    student = relationship("Student", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(db.Model):
    __tablename__ = "ChatMessage"
    id = db.Column(Uuid(as_uuid=False), primary_key=True, default=uuid_string)
    session_id = db.Column("sessionId", Uuid(as_uuid=False), ForeignKey('ChatSession.id', ondelete='CASCADE'), nullable=False, index=True)
    role = db.Column(Enum('USER', 'ASSISTANT', name='MessageRole'), nullable=False)
    content = db.Column(Text, nullable=False)
    sources = db.Column(JSON().with_variant(JSONB, 'postgresql'))
    created_at = db.Column("createdAt", DateTime, nullable=False, default=datetime.utcnow)
    session = relationship("ChatSession", back_populates="messages")
