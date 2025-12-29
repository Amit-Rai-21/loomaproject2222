from typing import Dict, List

from beanie import PydanticObjectId
from fastapi import HTTPException, status
from app.models.school import School
from app.schemas.school import SchoolCreate, SchoolOut, SchoolStatus, SchoolUpdate, SchoolUpdateStatus
from datetime import datetime, timezone

from app.utils.dates import now_utc

def flatten_dict(d: dict, prefix: str = "") -> dict:
    items = []
    for key, value in d.items():
        new_key = f"{prefix}.{key}" if prefix else key

        if isinstance(value, dict) and value:
            items.extend(flatten_dict(value, new_key).items())
        else:
            items.append((new_key, value))

    return dict(items)

async def list_schools(search: str | None = None, province: str | None = None) -> List[SchoolOut]:
    schools: List[School] = []
    school_list: List[SchoolOut] = []

    if search is not None:
        schools = await School.find(
            {"$text": {"$search": search}}
        ).to_list()
    elif province is not None:
        schools = await School.find(School.province == province).to_list()
    else:
        schools = await School.find_all().to_list()


    for school in schools:
        s = SchoolOut(**school.model_dump(), qrScans=[], accessLogs=[])
        school_list.append(s)

    return school_list

async def get_school_stats() -> Dict[str, int]:
    return {
        "total": await School.count(),
        "online": await School.find(School.status == "online").count(),
        "offline": await School.find(School.status == "offline").count(),
        "maintenance": await School.find(School.status == "maintenance").count()
    }

async def add_school(data: SchoolCreate) -> School:
    school_to_create = School(**data.model_dump(), createdAt=datetime.now(timezone.utc), updatedAt=datetime.now(timezone.utc))
    await School.create(school_to_create)
    return school_to_create

async def get_schoool_by_id(id: PydanticObjectId) -> School | None:
    school: School | None
    try:
        school = await School.find(School.id == id).first_or_none()
    except:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal server error occured when retrieving the school.")
    return school

async def delete_school_by_id(id: PydanticObjectId):
    school_to_delete = await School.find_one(School.id == id)
    if not school_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"School with id {id} not found")
    await school_to_delete.delete()

async def update_school_status(id: PydanticObjectId, status_str: SchoolStatus):
    school_to_update = await School.find_one(School.id == id)
    if not school_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"School with id {id} not found")

    await school_to_update.set({School.status: status_str})
    await school_to_update.set({School.updatedAt: now_utc()})
    return school_to_update

async def update_school(id: PydanticObjectId, data: SchoolUpdate) -> School:
    school_to_update = await School.find_one(School.id == id)
    if not school_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"School with id {id} not found")

    update_dict = data.model_dump(exclude_unset=True)
    flat_dict = flatten_dict(update_dict)

    await school_to_update.set(flat_dict)
    await school_to_update.set({School.updatedAt: now_utc()})

    return school_to_update
