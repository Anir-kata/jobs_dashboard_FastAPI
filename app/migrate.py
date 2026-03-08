"""
Migration rapide pour ajouter les horodatages a la table jobs existante.
Execution: python -m app.migrate
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    try:
        # Ajoute les colonnes si elles n'existent pas.
        conn.execute(text("""
            ALTER TABLE jobs 
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
        """))
        print("[OK] Colonne created_at ajoutee")
    except Exception as e:
        print(f"created_at: {e}")
    
    try:
        conn.execute(text("""
            ALTER TABLE jobs 
            ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
        """))
        print("[OK] Colonne updated_at ajoutee")
    except Exception as e:
        print(f"updated_at: {e}")
    
    conn.commit()
    print("Migration terminee")
