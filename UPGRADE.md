# Upgrade

## 코드 업데이트

    git pull
    
    npm install
    bower install

    sudo systemctl restart raysoda
    sudo systemctl restart rapixel
    sudo systemctl restart osoky
    sudo systemctl restart drypot

## OS 업데이트

### 서비스 중지

    sudo systemctl stop raysoda
    sudo systemctl stop rapixel
    sudo systemctl stop osoky
    sudo systemctl stop drypot

혹시 systemd 설정 변경했으면

    sudo systemctl daemon-reload

### 디비 백업

    sudo systemctl stop mongodb
    cp ...

### Arch Linux 업데이트

    sudo pacman -S archlinux-keyring
    sudo pacman -Syu

### 전역 툴 업데이트

    sudo npm install -g mocha
    sudo npm install -g bower

### 설정 업데이트

    config/...

### 재부팅

    reboot

### 서비스 오류 확인

    sudo systemctl --failed

Arch 서비스 Fail 나면

    pacman -Rs ... 로 패키지 삭제했다가
    pacman -S ... 로 재설치 시도.

### 테스트 런

    $ node server/main/main.js -c config/raysoda-live.json

이상 없으면

    sudo systemctl start raysoda
    sudo systemctl start rapixel
    sudo systemctl start osoky
    sudo systemctl start drypot
