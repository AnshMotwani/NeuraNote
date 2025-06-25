from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class TagBase(BaseModel):
    name: str
    color: Optional[str] = None


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None
    parent_id: Optional[int] = None
    is_public: bool = False


class NoteCreate(NoteBase):
    tag_names: Optional[List[str]] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    parent_id: Optional[int] = None
    is_public: Optional[bool] = None
    tag_names: Optional[List[str]] = None


class NoteInDB(NoteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Note(NoteInDB):
    tags: List[Tag] = []
    children: List['Note'] = []
    linked_notes: List['Note'] = []


class NoteWithLinks(Note):
    linked_from: List['Note'] = []
    linked_to: List['Note'] = []


class NoteSearch(BaseModel):
    query: str
    limit: int = 10
    offset: int = 0


class NoteGraph(BaseModel):
    nodes: List[dict]
    edges: List[dict] 