from PIL import Image


color_map = {
    "red": (255, 0, 0),
    "green": (0, 200, 0),
    "blue": (0, 0, 255),
    "yellow": (240, 240, 30)
}


for image_name in color_map.keys():
    # Import an image from directory: 
    input_image = Image.open("image_generator\\resource\\word\\" + image_name + ".png") 
    
    for color in color_map.keys():
        image1 = Image.new("RGBA", input_image.size)
        image1.paste(input_image) 
        
        # Extracting pixel map: 
        pixel_map = image1.load() 
        
        # Extracting the width and height  
        # of the image: 
        width, height = image1.size 

        for i in range(width): 
            for j in range(height): 
                
                # getting the RGB pixel value. 
                r, g, b, p = image1.getpixel((i, j)) 
                ave = (r + g + b)//3
                    
                # setting the pixel value.
                if (ave <= 230): 
                    pixel_map[i, j] = color_map[color]
    
        # Saving the final output 
        image1.save("image_generator\\output\\word\\" + image_name + "_" + color + ".png", format="png") 
    
        # image1.show()
        
    
