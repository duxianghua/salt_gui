import os
import re
import time

def ft(file):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(os.path.getmtime(file)))

def list(path, *args, **kwargs):
    data = []
    paths = os.listdir(path)
    paths = [i for i in paths if re.match(r'^[^\.]', i)]
    for i, item in enumerate(paths):
        sub_path = os.path.join(path, item)
        if os.path.isdir(sub_path):
            team = {'name': item, 'type': 'dir',"rights": "drwxr-xr-x","size": "4096","date": ft(sub_path)}
            data.append(team)
        else:
            team = {'name': item, 'type': 'file', "rights": "drwxr-xr-x","size": ft(sub_path)}
            data.append(team)
    return data

def getContent(item, *args, **kwargs):

    try:
        with open(item, 'r') as f:
            ret = f.read()
    except Exception as e:
        ret = {"success": False, "error": '%s' % str(e)}
    return ret

def edit(item, content, *args, **kwargs):
    try:
        with open(item, 'w') as f:
            f.write(content)
        ret = {"success": True, "error": None}
    except Exception as e:
        ret = {"success": False, "error": '%s' % str(e)}
    return ret

def rename(item, newItemPath, *args, **kwargs):
    try:
        os.rename(item, newItemPath)
        ret = { "success": True, "error": None }
    except Exception as e:
        ret = { "success": False, "error": '%s' %str(e) }
    return ret

def createFolder(newPath, *args, **kwargs):
    try:
        os.mkdir(newPath)
        ret = { "success": True, "error": None }
    except Exception as e:
        ret = { "success": False, "error": '%s' %str(e) }
    return ret


def copy(items, newPath, *args, **kwargs):
    '''
    :param items: ['/srv/salt/nagios/base.sls', '/srv/salt/nagios/base1.sls']
    :param newPath: '/srv/salt/apache'
    :param args:
    :param kwargs:
    :return: { "success": True, "error": None }
    '''
    import shutil
    try:
        for item in items:
            file = item.split('/')[-1]
            newFile = os.path.join(newPath, file)
            if os.path.exists(newFile):
                if '.' in file:
                    while True:
                        x = 1
                        file = file.split('.')[0] + str(x) + file.split('.')[1]
                        newFile = os.path.join(newPath, file)
                        if os.path.exists(newFile): continue
                        else: break
                else:
                    while True:
                        x = 1
                        file = file + str(x)
                        newFile = os.path.join(newPath, file)
                        if os.path.exists(newFile): continue
                        else: break
            shutil.copy(item, newFile)
        ret = { "success": True, "error": None }
    except Exception as e:
        ret = { "success": False, "error": '%s' %str(e) }
    return ret


def changePermissions(items, permsCode, *args, **kwargs):
    '''
    :param items:
    :param permsCode:
    :param args:
    :param kwargs:
    :return: { "success": true, "error": null }
    '''
    pass


def upload_file():
    """
    :return:{ "success": true, "error": null }
    """
    pass

def download(path):
    '''
    :param path:
    :return: -File content
    '''
    pass



