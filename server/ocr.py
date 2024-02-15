import cv2
import numpy as np
import sys

def process_image(image_path):
    input_image = cv2.imread(image_path, 0)
    templates = [cv2.imread(f'./template/template{i}.jpg', 0) for i in range(10)]
    threshold = 0.95
    matches = []

    for idx, template in enumerate(templates):
        res = cv2.matchTemplate(input_image, template, cv2.TM_CCOEFF_NORMED)
        loc = np.where(res >= threshold)
        for pt in zip(*loc[::-1]):
            matches.append((idx, pt))

    matches.sort(key=lambda x: x[1][1])
    lines = []
    current_line = []
    last_y = 0
    line_height = 15

    for match in matches:
        _, (x, y) = match
        if y - last_y > line_height or not current_line:
            lines.append(current_line)
            current_line = []
        current_line.append(match)
        last_y = y
    lines.append(current_line)

    if lines[0] == []:
        lines = lines[1:]

    number_lines = []
    for line in lines:
        line.sort(key=lambda x: x[1][0])
        number_line = ''.join(str(num) for num, _ in line)
        number_lines.append(number_line)

    return number_lines

if __name__ == "__main__":
    for image_path in sys.argv[1:]:  # 첫 번째 인자부터 모든 이미지 파일 경로 처리
        ocr_results = process_image(image_path)
        print(f'{ocr_results}')
