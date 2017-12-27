import salt.config
import saltapi

opts = salt.config.master_config('/etc/salt/master')
api = saltapi.APIClient(opts)

def list_all(*args, **kwargs):
    fun = 'key.list_all'
    return api.wheel(fun)

def accept(minions, **kwargs):
    fun = 'key.accept'
    if not isinstance(minions, list):
        raise ValueError('minions must be formatted as a list')
    return api.wheel(fun, arg=minions)

def delete(minions, **kwargs):
    fun = 'key.delete'
    if not isinstance(minions, list):
        raise ValueError('minions must be formatted as a list')
    return api.wheel(fun, arg=minions)

def reject(minions, **kwargs):
    fun = 'key.reject'
    if not isinstance(minions, list):
        raise ValueError('minions must be formatted as a list')
    return api.wheel(fun, arg=minions)