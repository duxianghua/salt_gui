import salt.config
import saltapi

opts = salt.config.master_config('/etc/salt/master')
api = saltapi.APIClient(opts)

def list_all(*args, **kwargs):
    fun = 'key.list_all'
    return api.wheel(fun)

def accept(minions, **kwargs):
    fun = 'key.accept'
    return api.wheel(fun, arg=minions)

def delete(minions, **kwargs):
    fun = 'key.delete'
    return api.wheel(fun, arg=minions)

def reject(minions, **kwargs):
    fun = 'key.reject'
    return api.wheel(fun, arg=minions)