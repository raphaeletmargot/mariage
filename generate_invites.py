import csv
import json
from pathlib import Path

ROOT = Path(__file__).parent
CSV_PATH = ROOT / "MARIAGE - Invités.csv"
OUTPUT_PATH = ROOT / "invites.js"

SURPRISE_GUESTS = [
    ("Adrien", "Dahan"),
    ("Léopold", "Delaverge"),
    ("Arno", "Rubinstein"),
]


def main():
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    guests = [
        {"firstName": row["Prenom"].strip(), "lastName": row["Nom"].strip(), "site": int(row["Groupe invité"].strip())}
        for row in rows
        # "X" is a placeholder first name (e.g. unnamed baby).
        if row["Prenom"].strip() not in ("", "X") and row["Nom"].strip()
    ]
    guests += [
        {"firstName": first, "lastName": last, "site": "surprise"}
        for first, last in SURPRISE_GUESTS
    ]

    content = "window.guestInvitations = " + json.dumps(guests, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT_PATH.write_text(content, encoding="utf-8")
    print(f"{len(guests)} invités écrits dans {OUTPUT_PATH.name}")


if __name__ == "__main__":
    main()
