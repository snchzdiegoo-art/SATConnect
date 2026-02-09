import csv
import requests
import json
import re

csv_path = r'c:\Users\diego\Documents\SAT Connect\DOCUMENTOS BASE\OTAs TOUR & Activities AUDIT - AUDITORIA_MAESTRA_OTAS (1).csv'
api_url = 'http://localhost:3000/api/tours'

def parse_currency(value):
    """Parse currency like US$85,00 to 85.00"""
    if not value:
        return 0
    # Remove currency symbols
    cleaned = re.sub(r'US\$|[$€£¥]', '', str(value)).strip()
    # Replace comma with dot for decimal
    cleaned = re.sub(r'\.(?=\d{3})', '', cleaned).replace(',', '.')
    try:
        return float(cleaned)
    except:
        return 0

def parse_number(value):
    """Extract number from strings like -US$4,00 -> -4"""
    if not value:
        return ""
    match = re.search(r'(-?\d+)', str(value))
    return match.group(1) if match else ""

def parse_images(value):
    """Parse multiple image URLs"""
    if not value:
        return []
    urls = re.split(r'[,\n]', str(value))
    return [url.strip() for url in urls if url.strip()]

print("Starting CSV import...")
print(f"Reading: {csv_path}\n")

with open(csv_path, encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)
    
    # Skip first 3 rows (headers)
    data_rows = rows[3:]
    
    created = 0
    failed = 0
    
    for i, row in enumerate(data_rows, 1):
        if len(row) < 20:
            continue
            
        tour_id = row[0].strip() if row[0] else None
        if not tour_id:
            continue
        
        tour_data = {
            "id": tour_id,
            "name": row[1].strip() if row[1] else f"Tour {tour_id}",
            "provider": row[2].strip() if row[2] else "Por Definir",
            "location": row[3].strip() if row[3] else "",
            
            # Economics - Shared Adult
            "netRate": parse_currency(row[8]),
            "factorShared": float(row[9].replace(',', '.')) if row[9] else 0,
            "publicPrice": parse_currency(row[10]),
            
            # Child rates
            "netChild": parse_currency(row[11]),
            "publicChild": parse_currency(row[12]),
            
            # Operational
            "infantAge": parse_number(row[13]),
            "minPaxShared": int(row[14]) if row[14] and row[14].replace('.','').replace(',','').isdigit() else 1,
            "minPaxPrivate": int(float(row[15])) if row[15] and row[15].replace('.','').replace(',','').isdigit() else 1,
            
            # Private rates
            "netPrivate": parse_currency(row[16]),
            "factorPrivate": float(row[17].replace(',', '.')) if row[17] and row[17].replace('US$','').strip() else 0,
            "publicPrivate": parse_currency(row[18]),
            
            # Metadata
            "lastUpdate": row[19].strip() if len(row) > 19 and row[19] else "",
            
            # Technical
            "images": parse_images(row[20]) if len(row) > 20 else [],
            "duration": row[21].strip() if len(row) > 21 and row[21] else "",
            "opsDays": row[22].strip() if len(row) > 22 and row[22] else "",
            "cxlPolicy": row[23].strip() if len(row) > 23 and row[23] else "",
            "landingPageUrl": row[24].strip() if len(row) > 24 and row[24] else "",
            "storytelling": row[25].strip() if len(row) > 25 and row[25] else "",
            "meetingPoint": row[26].strip() if len(row) > 26 and row[26] else "",
            
            # Extras
            "extraFees": row[27].strip() if len(row) > 27 and row[27] else "",
            
            # Channels
            "channels": {
                "expedia": "Active" if len(row) > 31 and row[31].strip().lower() == "active" else "Inactive",
                "viator": "Active" if len(row) > 34 and row[34].strip().lower() == "active" else "Inactive",
                "gyg": "Inactive",
                "civitatis": "Active" if len(row) > 36 and row[36].strip().lower() == "active" else "Inactive"
            },
            
            # Audit notes
            "auditNotes": row[37].strip() if len(row) > 37 and row[37] else ""
        }
        
        # Debug for Holbox
        if "holbox" in tour_data["name"].lower():
            print(f"\nHolbox Tour Preview:")
            print(f"  Net Rate: ${tour_data['netRate']}")
            print(f"  Public Price: ${tour_data['publicPrice']}")
            print(f"  Factor: {tour_data['factorShared']}")
            print(f"  Infant Age: {tour_data['infantAge']}")
            print(f"  Net Private: ${tour_data['netPrivate']}")
        
        try:
            response = requests.post(api_url, json=tour_data, timeout=30)
            if response.status_code in [200, 201]:
                created += 1
                print(f"[OK] {i}/{len(data_rows)}: {tour_data['name'][:50]}...")
            else:
                failed += 1
                print(f"[FAIL] {i}/{len(data_rows)}: Failed - {response.status_code}")
        except Exception as e:
            failed += 1
            print(f"[ERROR] {i}/{len(data_rows)}: Error - {str(e)[:50]}")

print(f"\n\n{'='*60}")
print(f"Import Complete!")
print(f"Created: {created}")
print(f"Failed: {failed}")
print(f"{'='*60}\n")
