"""add chat_id to documents

Revision ID: 0d97bbeec6f7
Revises: 2ee360efd1f0
Create Date: 2026-07-28 08:31:27.679952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d97bbeec6f7'
down_revision: Union[str, Sequence[str], None] = '2ee360efd1f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "documents",
        sa.Column("chat_id", sa.Integer(), nullable=True),
    )

    op.create_foreign_key(
        "fk_documents_chat_id",
        "documents",
        "chats",
        ["chat_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_documents_chat_id",
        "documents",
        type_="foreignkey",
    )

    op.drop_column(
        "documents",
        "chat_id",
    )
