from pathlib import Path

import fitz  # PyMuPDF
import pandas as pd
from docx import Document

class FileParser:
    """Extract text from supported document types."""

    SUPPORTED_EXTENSIONS = {
        ".pdf",
        ".docx",
        ".txt",
        ".csv",
        ".xlsx",
    }

    @classmethod
    def extract_text(cls, file_path: str) -> str:
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"{file_path} not found.")

        extension = path.suffix.lower()

        if extension not in cls.SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported file type: {extension}")

        if extension == ".pdf":
            return cls._extract_pdf(path)

        elif extension == ".docx":
            return cls._extract_docx(path)

        elif extension == ".txt":
            return cls._extract_txt(path)

        elif extension == ".csv":
            return cls._extract_csv(path)

        elif extension == ".xlsx":
            return cls._extract_excel(path)


    @staticmethod
    def _extract_pdf(path: Path) -> str:
        text = ""

        with fitz.open(path) as pdf:
            for page in pdf:
                text += page.get_text()

        return text.strip()

    @staticmethod
    def _extract_docx(path: Path) -> str:
        document = Document(path)

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n".join(paragraphs)

    @staticmethod
    def _extract_txt(path: Path) -> str:
        return path.read_text(encoding="utf-8")

    @staticmethod
    def _extract_csv(path: Path) -> str:
        dataframe = pd.read_csv(path)

        return dataframe.to_string(index=False)

    @staticmethod
    def _extract_excel(path: Path) -> str:
        dataframe = pd.read_excel(path)

        return dataframe.to_string(index=False)