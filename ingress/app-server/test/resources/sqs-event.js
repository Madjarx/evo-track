exports.event = {
    "Records": [
        {
            "messageId": "a86ae4ae-15e5-4ea5-b432-c4141404c804",
            "receiptHandle": "AQEBJqSgOLVn/3EDWQlZ7SfdrenDpo2rgdfdLyIbFwNVIHn+0bZuDDIf8vnKgZLEX7J93bpFx29nmWRZa04erJhUkxzr9p7o72ExFubvSMlCHLeau0gszZBzI6L3Y/ToiJd2jCLfDVD14JkMI0KeH4d4eStOQhtK7sss/sAsqXvfFvzhUnyNXwbrGXGCUmqiErLOTZXvn7Irzq5Hev4rOSkFBmOAg5PEPcH/qLd/cy/y5P6cfTeipO+Iu8UkY1ik/nKrVuXmVIwAetkb3xbcacQKLzEL9mk7y2+aHxfESwVQe6qF0cGaLt+SfT0ai8l0968eFAZXkuNnQRBkHx+7LUJw8OoW7ReakPk/8DkH3Cd9ngKNSW0QOYeJM2ZukFEGoi9LO9PjD59KiI4Njs7DqDQdLg==",
<<<<<<< HEAD
            "body": "{ \n    \"weight\": 30186, \n    \"wasteType\": \"Compost\", \n    \"time\": \"23467246135134\",\n    \"bin\": \"awd423\", \n    \"units\": \"kg\" \n}\n",
=======
            "body": "{ \n    \"weight\": 20186, \n    \"mode\": \"Compost\", \n    \"timestamp\": \"1617085442\",\n    \"bin\": \"awd423\", \n    \"units\": \"kg\" \n}\n",
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1614991071850",
                "SenderId": "AIDASKMBE53IC4KBVKVVL",
                "ApproximateFirstReceiveTimestamp": "1614991071857"
            },
            "messageAttributes": {
                "SheetsRef": {
                    // "stringValue": "1S7wyDxxeffRIpNNKo9LagUf3Z8l_pkPvos221xE5k", // bad url
                    "stringValue": "1S7wyDxxeffRIJbpNNKo9LagUf3Z8l_pkPvos221xE5k", // good url 
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
<<<<<<< HEAD
                "cluster": {
                    "stringValue": "ROOM",
=======
                "ElasticURL": {
                    // "stringValue": "1S7wyDxxeffRIpNNKo9LagUf3Z8l_pkPvos221xE5k", // bad url
                    "stringValue": "http://localhost:9200", // good url 
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "ElasticIndex": {
                    // "stringValue": "1S7wyDxxeffRIpNNKo9LagUf3Z8l_pkPvos221xE5k", // bad url
                    "stringValue": "evo-track-hi3", // good url 
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "cluster": {
                    "stringValue": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
>>>>>>> 98c9bd267c02cbd883e0006e9e08604b07b20a6e
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "site": {
                    "stringValue": "HOUSE",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "TableRef": {
                    "stringValue": "RawData",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "crt": {
                    "stringValue": "Certificate:\n    Data:\n        Version: 3 (0x2)\n        Serial Number:\n            8e:22:a7:06:25:5a:04:a7:ad:17:61:5e:6c:13:96:72\n        Signature Algorithm: sha256WithRSAEncryption\n        Issuer: CN=Evo Ingress CA\n        Validity\n            Not Before: Feb  6 03:37:23 2021 GMT\n            Not After : Jan 22 03:37:23 2024 GMT\n        Subject: CN=moishe1\n        Subject Public Key Info:\n            Public Key Algorithm: rsaEncryption\n                RSA Public-Key: (2048 bit)\n                Modulus:\n                    00:b6:66:d6:a6:f9:c3:49:26:c1:d0:fa:ec:51:8b:\n                    c9:1a:93:bf:0e:cc:0e:33:7d:50:ed:7a:93:1c:00:\n                    53:c4:03:e0:11:59:75:60:60:a8:15:c9:77:d8:75:\n                    f4:43:82:07:c6:64:de:07:ff:20:1b:f4:9f:17:06:\n                    0f:81:b7:d7:9d:fb:75:30:47:7d:ee:be:e5:c5:c8:\n                    06:48:5f:6e:39:95:e0:a7:cf:4e:7d:2f:78:a4:f8:\n                    62:bf:56:da:e8:e0:0a:1f:4b:6f:fc:a5:4b:d2:f2:\n                    6b:3e:9d:3a:9a:d1:13:ab:fa:ac:76:0f:9f:27:bc:\n                    98:ad:19:1d:37:ea:eb:e5:61:b9:a4:85:83:3d:d7:\n                    a6:b2:22:fb:28:67:38:13:e4:4f:97:07:fa:77:a0:\n                    59:2f:d5:b1:c1:e1:56:4c:6a:42:20:9a:ef:bd:3c:\n                    65:32:99:1b:a1:07:9a:5c:d7:65:d3:3a:a3:aa:75:\n                    2b:20:24:f0:f1:77:ff:d2:9c:b9:a3:19:79:fb:18:\n                    40:bf:42:c4:2c:64:fe:91:ef:36:ea:0c:9c:af:0a:\n                    94:22:a6:b8:e1:66:84:fe:38:be:5e:29:41:7e:94:\n                    67:0e:cf:95:7c:4d:9c:b3:b5:22:fa:1e:be:8b:5a:\n                    e1:f6:98:fa:ee:8b:9c:e5:80:a1:5a:7b:f7:a2:6b:\n                    27:73\n                Exponent: 65537 (0x10001)\n        X509v3 extensions:\n            X509v3 Basic Constraints: \n                CA:FALSE\n            X509v3 Subject Key Identifier: \n                F1:98:FE:13:37:45:49:DF:DB:12:7A:D3:65:14:D9:43:40:22:41:D8\n            X509v3 Authority Key Identifier: \n                keyid:01:F8:67:25:3D:18:92:AD:E8:C7:E9:0C:84:67:8E:59:F2:0B:DB:25\n                DirName:/CN=Evo Ingress CA\n                serial:79:50:2D:CD:18:C5:58:9F:B6:26:2F:9A:AD:F3:A4:E5:B4:9A:C6:CF\n\n            X509v3 Extended Key Usage: \n                TLS Web Client Authentication\n            X509v3 Key Usage: \n                Digital Signature\n    Signature Algorithm: sha256WithRSAEncryption\n         99:f1:14:be:2f:b6:20:19:18:ac:3e:9c:4d:d3:93:0e:04:01:\n         d2:76:ad:41:15:98:5a:5c:37:55:d3:91:12:e5:2a:1c:b7:e0:\n         6b:27:94:19:81:8c:1a:72:af:bc:00:89:5c:4c:ac:6c:74:d5:\n         d9:da:9d:0b:4c:7f:7a:14:c9:e7:3b:e2:98:78:a6:05:73:e9:\n         6d:25:53:99:50:9e:8d:54:03:af:18:95:a1:f2:d1:6b:9c:6a:\n         f2:c0:91:89:c7:32:cb:1e:79:10:40:38:52:46:af:b2:97:a5:\n         c0:80:2c:53:0a:7b:53:52:82:27:fd:d9:cc:f7:47:fd:21:37:\n         8b:69:46:5f:32:b0:8c:64:30:79:c3:37:54:d5:b4:25:ec:12:\n         b8:6d:fc:ed:ea:92:f8:bb:fd:03:09:b2:68:03:9e:10:9c:67:\n         30:5d:bf:03:a0:ab:cd:f6:e5:ff:d9:94:7d:8f:f9:80:9f:3c:\n         3a:b9:99:80:53:f4:a9:04:7c:48:df:bc:35:a7:88:2d:96:6e:\n         3f:af:d0:2d:a0:4b:73:29:60:01:da:1b:ef:84:c1:62:08:1f:\n         bb:4e:8c:51:88:a4:1c:cf:03:88:86:f0:12:2b:8f:1a:4c:c4:\n         46:19:eb:8a:54:1f:5b:1e:19:b4:04:25:65:3d:fa:f0:be:ca:\n         0c:f8:de:0d\n-----BEGIN CERTIFICATE-----\nMIIDXDCCAkSgAwIBAgIRAI4ipwYlWgSnrRdhXmwTlnIwDQYJKoZIhvcNAQELBQAw\nGTEXMBUGA1UEAwwORXZvIEluZ3Jlc3MgQ0EwHhcNMjEwMjA2MDMzNzIzWhcNMjQw\nMTIyMDMzNzIzWjASMRAwDgYDVQQDDAdtb2lzaGUxMIIBIjANBgkqhkiG9w0BAQEF\nAAOCAQ8AMIIBCgKCAQEAtmbWpvnDSSbB0PrsUYvJGpO/DswOM31Q7XqTHABTxAPg\nEVl1YGCoFcl32HX0Q4IHxmTeB/8gG/SfFwYPgbfXnft1MEd97r7lxcgGSF9uOZXg\np89OfS94pPhiv1ba6OAKH0tv/KVL0vJrPp06mtETq/qsdg+fJ7yYrRkdN+rr5WG5\npIWDPdemsiL7KGc4E+RPlwf6d6BZL9WxweFWTGpCIJrvvTxlMpkboQeaXNdl0zqj\nqnUrICTw8Xf/0py5oxl5+xhAv0LELGT+ke826gycrwqUIqa44WaE/ji+XilBfpRn\nDs+VfE2cs7Ui+h6+i1rh9pj67ouc5YChWnv3omsncwIDAQABo4GlMIGiMAkGA1Ud\nEwQCMAAwHQYDVR0OBBYEFPGY/hM3RUnf2xJ602UU2UNAIkHYMFQGA1UdIwRNMEuA\nFAH4ZyU9GJKt6MfpDIRnjlnyC9sloR2kGzAZMRcwFQYDVQQDDA5Fdm8gSW5ncmVz\ncyBDQYIUeVAtzRjFWJ+2Ji+arfOk5bSaxs8wEwYDVR0lBAwwCgYIKwYBBQUHAwIw\nCwYDVR0PBAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQCZ8RS+L7YgGRisPpxN05MO\nBAHSdq1BFZhaXDdV05ES5Soct+BrJ5QZgYwacq+8AIlcTKxsdNXZ2p0LTH96FMnn\nO+KYeKYFc+ltJVOZUJ6NVAOvGJWh8tFrnGrywJGJxzLLHnkQQDhSRq+yl6XAgCxT\nCntTUoIn/dnM90f9ITeLaUZfMrCMZDB5wzdU1bQl7BK4bfzt6pL4u/0DCbJoA54Q\nnGcwXb8DoKvN9uX/2ZR9j/mAnzw6uZmAU/SpBHxI37w1p4gtlm4/r9AtoEtzKWAB\n2hvvhMFiCB+7ToxRiKQczwOIhvASK48aTMRGGeuKVB9bHhm0BCVlPfrwvsoM+N4N\n-----END CERTIFICATE-----",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                },
                "org": {
                    "stringValue": "MOISHECO",
                    "stringListValues": [],
                    "binaryListValues": [],
                    "dataType": "String"
                }
            },
            "md5OfBody": "c2c1da987a2e6d76df52aa5e030af0f5",
            "md5OfMessageAttributes": "a90b6d606522b2596be49b3e7e92ade2",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:us-east-1:159721516752:GoogleSheetsQueue",
            "awsRegion": "us-east-1"
        }
    ]
}