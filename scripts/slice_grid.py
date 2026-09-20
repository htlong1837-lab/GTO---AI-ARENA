import sys
import os
from PIL import Image

def slice_grid(image_path, garment_prefix, output_dir='public/images/viet_phuc'):
    if not os.path.exists(image_path):
        print(f"Error: {image_path} does not exist")
        return False

    img = Image.open(image_path)
    W, H = img.size
    print(f"Image opened: {image_path} ({W}x{H})")

    rows = 2
    cols = 4
    cell_w = W / cols
    cell_h = H / rows

    # 8 color mappings in 2x4 grid order (left-to-right, top-to-bottom)
    color_keys = [
        # Row 1
        'do-son',
        'trang-lua-nga',
        'hong-canh-sen',
        'vang-hoang-cuc',
        # Row 2
        'xanh-ngoc-luc',
        'tim-hue',
        'xanh-cham',
        'den-tuyen'
    ]

    os.makedirs(output_dir, exist_ok=True)
    idx = 0

    for r in range(rows):
        for c in range(cols):
            color_id = color_keys[idx]
            idx += 1

            # Cell bounds
            left = int(c * cell_w)
            top = int(r * cell_h)
            right = int((c + 1) * cell_w)
            bottom = int((r + 1) * cell_h)

            cell = img.crop((left, top, right, bottom))
            cw, ch = cell.size

            # Target 1:1 square crop with seamless horizontal edge extension
            if ch > cw:
                pad_left = (ch - cw) // 2
                pad_right = ch - cw - pad_left

                left_strip = cell.crop((0, 0, 1, ch)).resize((pad_left, ch), Image.Resampling.NEAREST)
                right_strip = cell.crop((cw - 1, 0, cw, ch)).resize((pad_right, ch), Image.Resampling.NEAREST)

                square = Image.new('RGB', (ch, ch))
                square.paste(left_strip, (0, 0))
                square.paste(cell, (pad_left, 0))
                square.paste(right_strip, (pad_left + cw, 0))
            elif cw > ch:
                pad_top = (cw - ch) // 2
                pad_bottom = cw - ch - pad_top

                top_strip = cell.crop((0, 0, cw, 1)).resize((cw, pad_top), Image.Resampling.NEAREST)
                bottom_strip = cell.crop((0, ch - 1, cw, ch)).resize((cw, pad_bottom), Image.Resampling.NEAREST)

                square = Image.new('RGB', (cw, cw))
                square.paste(top_strip, (0, 0))
                square.paste(cell, (0, pad_top))
                square.paste(bottom_strip, (0, pad_top + ch))
            else:
                square = cell

            # Resize to high quality 1024x1024
            final_img = square.resize((1024, 1024), Image.Resampling.LANCZOS)
            out_file = os.path.join(output_dir, f"{garment_prefix}_{color_id}.jpg")
            final_img.save(out_file, quality=95)
            print(f"  [{idx}/8] Saved: {out_file} (1024x1024)")

    print("Successfully sliced all 8 color variants seamlessly!")
    return True

if __name__ == '__main__':
    grid_img = sys.argv[1] if len(sys.argv) > 1 else 'public/images/viet_phuc/ao_dai_grid_2x4.jpg'
    prefix = sys.argv[2] if len(sys.argv) > 2 else 'ao_dai'
    slice_grid(grid_img, prefix)
