
import sys
import subprocess

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    install("Pillow")
    from PIL import Image

def remove_background(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    newData = []
    
    # Simple White Background Removal (Threshold)
    # Assumes background is white-ish
    for item in datas:
        # Check if pixel is close to white (R>200, G>200, B>200)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item) # Keep original color
            
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    # Use the ORIGINAL file provided by the user (copy that was made to public)
    # Or specifically the one in Documents if needed.
    # We will use the one in public/connectivitybutterfly.png
    input_file = r"c:\Users\diego\Documents\SAT Connect\Antigravity\public\connectivitybutterfly.png"
    output_file = r"c:\Users\diego\Documents\SAT Connect\Antigravity\public\butterfly_v3.png"
    
    remove_background(input_file, output_file)
