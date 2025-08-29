import os
from pathlib import Path
import json
files = {"files":[], 'count':0}
path = str(Path(__file__).parent.absolute())+"/gpx"
for file in os.listdir(path):
    files['files'].append('./files/gpx/'+file)
    files['count'] = files['count'] + 1

path = str(Path(__file__).parent.absolute())+"/tcx"
for file in os.listdir(path):
    if len(file)>25:
        new_name,index = file[0:19]+"_1.tcx",1
        while os.path.exists(os.path.join(path, new_name)):
            index+=1
            new_name = file[0:19]+'_'+str(index)+".tcx"
        os.rename(os.path.join(path, file), os.path.join(path, new_name))
        files['files'].append('./files/tcx/'+new_name)
    else:
        files['files'].append('./files/tcx/'+file)
    files['count'] = files['count'] + 1

path = str(Path(__file__).parent.absolute())+"/fit"
for file in os.listdir(path):
    files['files'].append('./files/fit/'+file)
    files['count'] = files['count'] + 1

path = str(Path(__file__).parent.absolute())+"/jpg"
for file in os.listdir(path):
    files['files'].append('./files/jpg/'+file)
    files['count'] = files['count'] + 1

obj = open('files.json', 'w')
obj.write(json.dumps(files))
obj.close

