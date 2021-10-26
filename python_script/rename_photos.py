import os
import csv

directory = input("Please name this ceremony: ")
thumbDir = directory + "/Thumbnails"
os.mkdir(directory)
os.mkdir(thumbDir)

with open('Photos_List.csv') as f:
    lines = csv.DictReader(f)
    for idx, line in enumerate(lines):
        try:
            newName = './' + directory + '/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] +  '.JPG'
            newThumb = './' + directory + '/Thumbnails/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] + '.JPG'
            compComm = 'magick ' + line['PhotoNum'] + '.JPG -resize 320 -quality 70 ' + '"' +  newThumb + '"'
            os.system(compComm)
            os.rename(line['PhotoNum'] + '.JPG', newName)
            
        except FileNotFoundError:
            print('File not found!')
            pass

os.rename('Photos_List.csv', './' + directory + '/Processed_Photos.csv')