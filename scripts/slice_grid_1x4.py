import sys
import os
from PIL import Image

def slice_grid_1x4(input_path, output_dir, color_ids):
    """
    Cắt ảnh lưới 1 hàng x 4 cột thành 4 ảnh vuông 1024x1024 độc lập.
    Sử dụng kỹ thuật kéo giãn biên (seamless edge extension) để màu nền studio liền mạch tuyệt đối.
    """
    if not os.path.exists(input_path):
        print(f"Error: {input_path} does not exist")
        return False

    img = Image.open(input_path).convert("RGB")
    W, H = img.size
    print(f"Loaded {input_path}: size {W}x{H}")

    os.makedirs(output_dir, exist_ok=True)

    col_w = W / 4.0

    for i, cid in enumerate(color_ids):
        x1 = int(round(i * col_w))
        x2 = int(round((i + 1) * col_w))
        y1 = 0
        y2 = H

        # Crop the column
        cell = img.crop((x1, y1, x2, y2))
        cw, ch = cell.size

        # Create a square image of size ch x ch
        sq_size = ch
        square_img = Image.new("RGB", (sq_size, sq_size))

        pad_left = (sq_size - cw) // 2
        pad_right = sq_size - cw - pad_left

        if pad_left > 0:
            left_strip = cell.crop((0, 0, 1, ch)).resize((pad_left, ch), Image.Resampling.NEAREST)
            square_img.paste(left_strip, (0, 0))

        square_img.paste(cell, (pad_left, 0))

        if pad_right > 0:
            right_strip = cell.crop((cw - 1, 0, cw, ch)).resize((pad_right, ch), Image.Resampling.NEAREST)
            square_img.paste(right_strip, (pad_left + cw, 0))

        # Resize to final 1024x1024
        final_img = square_img.resize((1024, 1024), Image.Resampling.LANCZOS)
        out_file = os.path.join(output_dir, f"{cid}.jpg")
        final_img.save(out_file, "JPEG", quality=95)
        print(f"  [{i+1}/4] Saved: {out_file} (1024x1024)")

    print("Successfully sliced 1x4 grid seamlessly!")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python slice_grid_1x4.py <input_img> <output_dir> <cid1,cid2,cid3,cid4>")
        sys.exit(1)

    in_img = sys.argv[1]
    out_dir = sys.argv[2]
    cids = sys.argv[3].split(",")
    slice_grid_1x4(in_img, out_dir, cids)
