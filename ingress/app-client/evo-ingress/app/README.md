# app

## brief usage

```bash
apt install flock jq
```

###

```bash
# WATCH FOR FILESYSTEM CHANGES
./src/exec-watch.sh ${CONFIG_FILE}

# INGRESS ONE FILE
./src/exec-ingress.sh ${DATA_FILE} ${CONFIG_FILE}

# INGRESS ALL QUEUE'd FILES
./src/ingress-start.sh ${CONFIG_FILE}

# KILL ALL ACTIVE
./src/ingress-stop.sh
```

### payload - ./sample/event.json
```json
{ 
    "weight": 12345, 
    "mode": "Compost", 
    "timestamp": "1617085871",
    "bin": "awd1pi", 
    "units": "kg" 
}
```

### env - configs/default.json

```json
{
	"EVO_INGRESS_WATCH_PATH": "/home/pi/queue",
	"EVO_INGRESS_URL": "https://7unqpxal0k.execute-api.us-east-1.amazonaws.com/dev/ingress",
	"EVO_INGRESS_AUTH": "AWDID, CLUSTERID",
	"EVO_INGRESS_CONN_TIMEOUT": "11",
	"EVO_INGRESS_TOKEN_PATH": "/etc/evo-ingress/private/token",
	"EVO_INGRESS_CRT_PATH": "/etc/evo-ingress/private/client.crt",
	"EVO_INGRESS_KEY_PATH": "/etc/evo-ingress/private/client.key",
	"EVO_INGRESS_HEADERS_PATH": "/etc/evo-ingress/default.headers.json"
}
```

### 