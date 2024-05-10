import cv2

source='image.png'
destinition='resized_image.jpg'
scale_percent=60

src=cv2.imread(source,cv2.IMREAD_UNCHANGED)


new_width=int(src.shape[1]*scale_percent/70)
new_height=int(src.shape[0]*scale_percent/70)

output=cv2.resize(src,(new_width,new_height))

cv2.imwrite(destinition,output)
cv2.waitKey(0)