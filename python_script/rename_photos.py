import os
import csv
import time

directory = input("Please name this ceremony: ")
sampDir = directory + "/Samples"
os.mkdir(directory)
os.mkdir(sampDir)

with open('Photos_List.csv') as f:
    lines = csv.DictReader(f)


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

os.rename('Photos_List.csv', './' + directory + '/Processed_Photos.csv')

print(' _   _ ___ ____ ')
print('| | | |_ _|  _ \\ ')
print('| |_| || || |_) |')
print('|  _  || ||  _ < ')
print('|_| |_|___|_| \\_\\')

time.sleep(0.5)

print('  ___  _____ ____ ')
print(' / _ \\| ____/ ___|')
print('| | | |  _| \\___ \\ ')
print('| |_| | |___ ___) |')
print(' \\___/|_____|____/ ')

time.sleep(0.557)

print(' ___ _ ____  ')
print('|_ _( )  _ \\ ')
print(' | ||/| |_) |')
print(' | |  |  _ < ')
print('|___| |_| \\_\\')

time.sleep(0.3)

print(' ____  ____  ___ _______   ______   ____  ___  _   ')
print('|  _ \\|  _ \|_ _|  ___\\ \\ / / ___| / ___|/ _ \\| |  ')
print('| |_) | |_) || || |_   \\ V /\\___ \\| |  _| | | | | ')
print('|  __/|  _ < | ||  _|   | |  ___) | |_| | |_| | |___ ')
print('|_|   |_| \\_\\___|_|     |_| |____/ \\____|\\___/|_____|')

time.sleep(2)

print('See?')

time.sleep(0.5)