import os
import csv
import time
import glob

cereName = ""

# def checkPng():
#     wtmkPng = glob.glob("./WATERMARK.png")

#     if len(wtmkPng) < 1:
#         print('Watermark image is missing')
#         print('Please ensure the watermark file is present, and is titled "WATERMARK.png" (case sensitive)')
#         time.sleep(4)
#         quit()
#     else:
#         print('Found watermark PNG, continuing...')
#         time.sleep(1)

def getCeremony():
    global cereDir
    global selectedCSV
    cereList = glob.glob("./*.csv")
    cleanCereList = []

    if len(cereList) < 1:
        print("Couldn't find any CSV files... quitting")
        time.sleep(4)
        quit()
    
    for cere in cereList:
        cleanName = cere.replace(".\\", "")
        cleanName = cleanName.replace(" Photos.csv", "")
        cleanCereList.append(cleanName)

    if len(cereList) < 2:
        cereDir = cleanCereList[0]
        print("Found 1 ceremony file called " + cleanCereList[0] +  ". Continuing...")
        time.sleep(1)
        selectedCSV = cereList[0]
    else:
        print("Found multiple ceremony files, please choose...")
        print("")

        for idx, name in enumerate(cleanCereList):
            print(str(idx+1) + ". " + str(name))
        
        print("")
        print ("Type a number, and press Enter...")

        usrSelection = int(input(""))

        if usrSelection > len(cereList) or usrSelection == 0:
            print("That's not in the list, please start again. Quitting...")
            time.sleep(4)
            quit()
        else:
            print("Okay, naming this ceremony " + cleanCereList[usrSelection-1])
            cereDir = cleanCereList[usrSelection-1]
            selectedCSV = cereList[usrSelection-1]
            print("Let's go!")
            print("")
            time.sleep(1)

def hirOes():
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

def welcome():
    print(" _|_|_|  _|      _|    _|_|_|  _|_|_|_|_|    _|_|      _|_|_|  _|_|_|      _|_|    _|_|_|  ")
    print("   _|    _|_|    _|  _|            _|      _|    _|  _|        _|    _|  _|    _|  _|    _|")
    print("   _|    _|  _|  _|    _|_|        _|      _|_|_|_|  _|  _|_|  _|_|_|    _|_|_|_|  _|    _|")
    print("   _|    _|    _|_|        _|      _|      _|    _|  _|    _|  _|    _|  _|    _|  _|    _|")
    print(" _|_|_|  _|      _|  _|_|_|        _|      _|    _|    _|_|_|  _|    _|  _|    _|  _|_|_|  ")
    print("")
    print("'Unlicence' David Wale, 2021")
    print("")

welcome()

print("Welcome!")
time.sleep(1)
print("")

# checkPng()
getCeremony()

# sampDir = cereDir + "/Samples"
os.mkdir(cereDir)
# os.mkdir(sampDir)

with open(selectedCSV) as f:
    lines = csv.DictReader(f)


    for idx, line in enumerate(lines):
        try:
            newName = './' + cereDir + '/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] +  '.JPG'
            # newSamp = './' + cereDir + '/Samples/' + line['PhotoNum'] + ' - ' + line['StudNum'] + ' - ' + line['Name'] + '.JPG'
            # compComm = 'magick ' + line['PhotoNum'] + '.JPG -resize 800 -quality 70 compressed.JPG'
            # sampComm = 'magick compressed.JPG WATERMARK.png -composite -gravity center ' + '"' + newSamp + '"'
            print('Processing photo ' + str(idx+1))
            # os.system(compComm)
            # os.system(sampComm)
            os.rename(line['PhotoNum'] + '.JPG', newName)
            # os.remove('compressed.JPG')
        except FileNotFoundError:
            print('File not found!')
            pass

os.rename(selectedCSV, './' + cereDir + '/Processed_Photos.csv')



hirOes()