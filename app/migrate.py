"""
Quick migration to add timestamps to existing jobs table.
Run with: python app/migrate.py
"""
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    try:
        # Add columns if they don't exist
        conn.execute(text("""
            ALTER TABLE jobs 
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
        """))
        print("✓ Added created_at column")
    except Exception as e:
        print(f"created_at: {e}")
    
    try:
        conn.execute(text("""
            ALTER TABLE jobs 
            ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
        """))
        print("✓ Added updated_at column")
    except Exception as e:
        print(f"updated_at: {e}")
    
    conn.commit()
    print("Migration complete")
