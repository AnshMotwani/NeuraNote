from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, MetaData
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base

# Association table for many-to-many relationship between notes and tags
note_tags = Table(
    'note_tags',
    Base.metadata,
    Column('note_id', Integer, ForeignKey('notes.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

# Association table for note linking
note_links = Table(
    'note_links',
    Base.metadata,
    Column('source_note_id', Integer, ForeignKey('notes.id'), primary_key=True),
    Column('target_note_id', Integer, ForeignKey('notes.id'), primary_key=True)
)


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_id = Column(Integer, ForeignKey("notes.id"), nullable=True)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="notes")
    tags = relationship("Tag", secondary=note_tags, back_populates="notes")
    parent = relationship("Note", remote_side=[id], back_populates="children")
    children = relationship("Note", back_populates="parent")
    
    # Linked notes (bidirectional)
    linked_from = relationship(
        "Note",
        secondary=note_links,
        primaryjoin=id==note_links.c.target_note_id,
        secondaryjoin=id==note_links.c.source_note_id,
        back_populates="linked_to"
    )
    linked_to = relationship(
        "Note",
        secondary=note_links,
        primaryjoin=id==note_links.c.source_note_id,
        secondaryjoin=id==note_links.c.target_note_id,
        back_populates="linked_from"
    )


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    color = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="tags")
    notes = relationship("Note", secondary=note_tags, back_populates="tags") 