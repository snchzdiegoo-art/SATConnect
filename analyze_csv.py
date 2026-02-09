import csv

csv_path = r'c:\Users\diego\Documents\SAT Connect\DOCUMENTOS BASE\OTAs TOUR & Activities AUDIT - AUDITORIA_MAESTRA_OTAS (1).csv'

with open(csv_path, encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)
    
    print(f"Total rows: {len(rows)}")
    print(f"\nRow 2 (Headers): {len(rows[2])} columns")
    print("First 25 headers:")
    for i, header in enumerate(rows[2][:25]):
        print(f"  Col {i}: {header}")
    
    # Find Holbox row
    for i, row in enumerate(rows):
        if "holbox" in str(row[1]).lower():
            print(f"\n\nHolbox found at Row {i}")
            print(f"First 25 values:")
            for j, val in enumerate(row[:25]):
                print(f"  Col {j} ({rows[2][j] if j < len(rows[2]) else 'N/A'}): {val}")
            break
