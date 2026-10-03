import os
import shutil
from PIL import Image

ARTIFACTS_DIR = r"C:\Users\Do Anh Tu\.gemini\antigravity\brain\bf942277-5195-423b-82fc-8d02fdc83a41"
OUTPUT_DIR = r"d:\Work_Dev\area-ai\GTO---AI-ARENA\public\images\viet_phuc"

GRIDS = [
    {
        "garment_id": "ao-tac",
        "prefix": "ao_tac",
        "source": os.path.join(ARTIFACTS_DIR, "ao_tac_grid_2x2_1790991467362.jpg"),
        # Top-left, Top-right, Bottom-left, Bottom-right
        "cells": [
            ("xanh-cham", (0, 0)),
            ("do-son", (0, 1)),
            ("tim-hue", (1, 0)),
            ("den-tuyen", (1, 1)),
        ],
        "default_color": "xanh-cham"
    },
    {
        "garment_id": "ao-giao-linh",
        "prefix": "ao_giao_linh",
        "source": os.path.join(ARTIFACTS_DIR, "ao_giao_linh_grid_2x2_1790991508801.jpg"),
        "cells": [
            ("trang-lua-nga", (0, 0)),
            ("xanh-cham", (0, 1)),
            ("nau-gu", (1, 0)),
            ("do-son", (1, 1)),
        ],
        "default_color": "trang-lua-nga"
    },
    {
        "garment_id": "ao-vien-linh",
        "prefix": "ao_vien_linh",
        "source": os.path.join(ARTIFACTS_DIR, "ao_vien_linh_grid_2x2_1790991555707.jpg"),
        "cells": [
            ("xanh-ngoc-luc", (0, 0)),
            ("do-son", (0, 1)),
            ("xanh-cham", (1, 0)),
            ("vang-hoang-cuc", (1, 1)),
        ],
        "default_color": "xanh-ngoc-luc"
    },
    {
        "garment_id": "ao-dai-cuoi",
        "prefix": "ao_dai_cuoi",
        "source": os.path.join(ARTIFACTS_DIR, "ao_dai_cuoi_grid_2x2_1790991594894.jpg"),
        "cells": [
            ("do-son", (0, 0)),
            ("vang-hoang-cuc", (0, 1)),
            ("hong-canh-sen", (1, 0)),
            ("trang-lua-nga", (1, 1)),
        ],
        "default_color": "do-son"
    },
    {
        "garment_id": "ao-mo-ba",
        "prefix": "ao_mo_ba",
        "source": os.path.join(ARTIFACTS_DIR, "ao_mo_ba_grid_2x2_1790991652426.jpg"),
        "cells": [
            ("nau-gu", (0, 0)),
            ("xanh-cham", (0, 1)),
            ("den-tuyen", (1, 0)),
            ("do-son", (1, 1)),
        ],
        "default_color": "nau-gu"
    },
    {
        "garment_id": "ao-com-thai",
        "prefix": "ao_com_thai",
        "source": os.path.join(ARTIFACTS_DIR, "ao_com_thai_grid_2x2_1790991723857.jpg"),
        "cells": [
            ("hong-canh-sen", (0, 0)),
            ("xanh-ngoc-luc", (0, 1)),
            ("trang-lua-nga", (1, 0)),
            ("tim-hue", (1, 1)),
        ],
        "default_color": "hong-canh-sen"
    }
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for item in GRIDS:
        src = item["source"]
        prefix = item["prefix"]
        print(f"\nProcessing {prefix} from {src}...")
        
        if not os.path.exists(src):
            print(f"ERROR: Source file not found: {src}")
            continue
            
        img = Image.open(src)
        W, H = img.size
        print(f"  Dimensions: {W}x{H}")
        
        # Save 2x2 grid image
        grid_dest = os.path.join(OUTPUT_DIR, f"{prefix}_grid_2x2.jpg")
        shutil.copy2(src, grid_dest)
        print(f"  Saved grid: {grid_dest}")
        
        half_w = W // 2
        half_h = H // 2
        
        for color_id, (row, col) in item["cells"]:
            # Crop each quadrant
            # Add a slight margin (e.g. 2px) to exclude grid dividing lines if any
            margin = 3
            left = col * half_w + (margin if col > 0 else 0)
            top = row * half_h + (margin if row > 0 else 0)
            right = (col + 1) * half_w - (margin if col == 0 else 0)
            bottom = (row + 1) * half_h - (margin if row == 0 else 0)
            
            cell = img.crop((left, top, right, bottom))
            
            # Save cell image
            cell_filename = f"{prefix}_{color_id}.jpg"
            cell_dest = os.path.join(OUTPUT_DIR, cell_filename)
            cell.save(cell_dest, "JPEG", quality=95)
            print(f"  Saved variant ({row},{col}): {cell_filename}")
            
            # If this is the default color, also save as prefix.jpg
            if color_id == item["default_color"]:
                main_dest = os.path.join(OUTPUT_DIR, f"{prefix}.jpg")
                cell.save(main_dest, "JPEG", quality=95)
                print(f"  Saved main thumbnail: {prefix}.jpg")

    print("\nAll 6 garments processed successfully!")

if __name__ == "__main__":
    main()
