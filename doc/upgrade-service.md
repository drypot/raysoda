# Upgrade Service

서버 코드 업데이트.

    $ ssh aws1
    
    $ cd /data/service/raysoda
    $ git pull
    
    $ pm2 status
    $ pm2 restart all
