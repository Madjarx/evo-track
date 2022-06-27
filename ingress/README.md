# INGRESS

 - `evo-track/ingress` is a data pipeline that's designed to be mostly compatible with the existing (at time of writing) `EvoEco_AWD_GUI` (`evo-bin`)
   - once verified as superior, the intention is to backport the solution to `evo-bin`.
   - `evo-bin` leverages `Kafka` which has been a source of failure / difficult for the code to implement, requiring `kafka-queue-service` (sockets, service, sqlite).
 
 - the implementation is different in key ways:
   * detecting which events are "queued" is as easy as checking a folder (no more servers/maintenance)
 - the data payload is mostly the same, though slightly different.


## Comparisons


  | project   | queue                   | transport               | server                  | Handler                 |  Storage                                                |
  | --------- | ----------------------- | ----------------------- | ----------------------- | ----------------------- | ------------------------------------------------------- |
  | evo-bin   | local sqlite            | Kafka                   | Kafka/ZooKeeper/Ubuntu  | kafka_pg.py             | Postgres                                                |
  | evo-track | fs trigger <br>  retry cron | HTTP POST               | Lambda/SQS              | serverless.py           | SQS Fanout <br> (InfluxDB, ElasticSearch, Postgres, Sheets)  | 

 ---

 ## Topology

## client

 - installed on the `evo-track` (pi) via `dpkg -i evo-ingress-${VERSION}.deb`

```
./app-client
├── evo-ingress
│   └── pyproject.toml
│   └── setup.py
│   └── exec-test.sh
|   |
│   └── debian
│       └── cookiecutter.json
│   └── debtools
│       └── aliases
│   └── app
│       └── configs
│           └── test.env.sh
│           └── test.json
│       └── sample
│           └── event.json
│       └── src
│           └── exec-ingress.sh
│           └── exec-watch.sh
│           └── gen-jwt.py
│           └── ingress-start.sh
│           └── ingress-stop.sh

```

## deploy-lambda
v - [aws lambda functions](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions)

## resources

## server