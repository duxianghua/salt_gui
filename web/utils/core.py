import salt.config
import salt.client

master_opts = salt.config.client_config('/etc/salt/master')

class keys:
    c = salt.client.LocalClient()
    c.cmd()

