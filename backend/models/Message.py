from dataclasses import asdict, dataclass
import json


@dataclass
class Message:
    username: str
    content: str
    timestamp: str
    encrypted: bool

    def to_dict(self):
        return asdict(self)

    def to_json(self):
        return json.dumps(self.to_dict())

    @staticmethod
    def serialize_list(messages):
        """Convert a list of Message objects to a list of dictionaries"""
        return [msg.to_dict() for msg in messages]
