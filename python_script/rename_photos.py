import os
import csv

directory = input("Please name this ceremony: ")
sampDir = directory + "/Samples"
os.mkdir(directory)
os.mkdir(sampDir)

with open('Photos_List.csv') as f:
    lines = csv.DictReader(f)

    # totalRows = 0
    # for row in lines:
    #     totalRows += 1
    #     print('Added a row')
    
    # print('Moving on')

    for idx, line in enumerate(lines):
        try:
            newName = './' + directory + '/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] +  '.JPG'
            newSamp = './' + directory + '/Samples/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] + '.JPG'
            compComm = 'magick ' + line['PhotoNum'] + '.JPG -resize 800 -quality 70 compressed.JPG'
            sampComm = 'magick compressed.JPG WATERMARK.png -composite -gravity center ' + '"' + newSamp + '"'
            print('Processing photo ' + str(idx+1))
            os.system(compComm)
            os.system(sampComm)
            os.rename(line['PhotoNum'] + '.JPG', newName)
            os.remove('compressed.JPG')
        except FileNotFoundError:
            print('File not found!')
            pass

# os.rename('Photos_List.csv', './' + directory + '/Processed_Photos.csv')

