import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.user import User
from ...models.note import Note, Tag
from ...schemas.note import NoteCreate, NoteUpdate, Note as NoteSchema, Tag as TagSchema
from ...api.deps import get_current_active_user

router = APIRouter()


def extract_linked_notes(content: str) -> List[str]:
    """Extract note names from [[note-name]] pattern in content"""
    pattern = r'\[\[([^\]]+)\]\]'
    return re.findall(pattern, content)


def create_or_get_tags(db: Session, tag_names: List[str], user_id: int) -> List[Tag]:
    """Create tags if they don't exist and return them"""
    tags = []
    for tag_name in tag_names:
        tag = db.query(Tag).filter(Tag.name == tag_name, Tag.user_id == user_id).first()
        if not tag:
            tag = Tag(name=tag_name, user_id=user_id)
            db.add(tag)
            db.flush()
        tags.append(tag)
    return tags


@router.post("/", response_model=NoteSchema)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Create the note
    db_note = Note(
        title=note.title,
        content=note.content,
        user_id=current_user.id,
        parent_id=note.parent_id
    )
    db.add(db_note)
    db.flush()
    
    # Add tags if provided
    if note.tag_names:
        tags = create_or_get_tags(db, note.tag_names, current_user.id)
        db_note.tags = tags
    
    db.commit()
    db.refresh(db_note)
    return db_note


@router.get("/", response_model=List[NoteSchema])
def get_notes(
    skip: int = 0,
    limit: int = 100,
    parent_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Note).filter(Note.user_id == current_user.id)
    if parent_id is not None:
        query = query.filter(Note.parent_id == parent_id)
    else:
        query = query.filter(Note.parent_id.is_(None))
    
    notes = query.offset(skip).limit(limit).all()
    return notes


@router.get("/{note_id}", response_model=NoteSchema)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=NoteSchema)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Update fields
    update_data = note_update.dict(exclude_unset=True)
    tag_names = update_data.pop("tag_names", None)
    
    for field, value in update_data.items():
        setattr(db_note, field, value)
    
    # Update tags if provided
    if tag_names is not None:
        tags = create_or_get_tags(db, tag_names, current_user.id)
        db_note.tags = tags
    
    db.commit()
    db.refresh(db_note)
    return db_note


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}


@router.get("/search/", response_model=List[NoteSchema])
def search_notes(
    q: str,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    notes = db.query(Note).filter(
        Note.user_id == current_user.id,
        (Note.title.ilike(f"%{q}%") | Note.content.ilike(f"%{q}%"))
    ).limit(limit).all()
    return notes


@router.get("/tags/", response_model=List[TagSchema])
def get_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    tags = db.query(Tag).filter(Tag.user_id == current_user.id).all()
    return tags 