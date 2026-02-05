
from PIL import Image
import collections

def analyze_and_clean(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    # Count colors to identify checkerboard pattern
    colors = collections.Counter(datas)
    print("Most common colors:", colors.most_common(10))
    
    newData = []
    
    # Heuristic: The checkerboard is usually clean white (255,255,255) and light gray (e.g. 204,204,204 or 240,240,240)
    # The Neon Butterfly is likely Cyan/Teal/Blue.
    
    # Let's count "Background-like" pixels
    bg_pixels = 0
    
    for item in datas:
        r, g, b, a = item
        
        # Checkerboard detection logic
        # 1. White-ish
        is_white = r > 240 and g > 240 and b > 240
        # 2. Gray-ish (Checkerboard gray squares)
        # Usually R=G=B and > 150
        is_gray = (abs(r - g) < 10 and abs(r - b) < 10 and r > 150 and r < 240)
        
        # 3. Specific Checkerboard gray (often #cdcdcd or #efefef)
        
        # If it's a background color, make it transparent
        if is_white or is_gray:
             newData.append((255, 255, 255, 0))
             bg_pixels += 1
        else:
             # Keep the pixel (it's likely part of the neon butterfly)
             newData.append(item)
    
    print(f"Removed background from {bg_pixels} pixels.")
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved cleaned image to {output_path}")

if __name__ == "__main__":
    input_file = r"c:\Users\diego\Documents\SAT Connect\Antigravity\public\connectivitybutterfly.png"
    output_file = r"c:\Users\diego\Documents\SAT Connect\Antigravity\public\butterfly_v4_cleaned.png"
    analyze_and_clean(input_file, output_file)
