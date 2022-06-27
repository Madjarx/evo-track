export DISPLAY=:0.0
x11vnc -rfbauth ~/.vnc/passwd  -display :0 -forever -bg -repeat -nowf -o ~/.vnc/x11vnc.log
