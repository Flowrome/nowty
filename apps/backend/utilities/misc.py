from datetime import datetime

def global_strftime(str_time):
    return datetime.strptime(str_time, '%Y-%m-%dT%H:%M:%S.%fZ')