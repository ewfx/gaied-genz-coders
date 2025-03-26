from pydantic import BaseModel

class EmailClassificationResponse(BaseModel):
    from_email: str
    subject: str
    body: str
    attachments_text: str
    routed_to: str