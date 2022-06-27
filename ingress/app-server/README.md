# Evo-Ingress Server

## Deployment

Use [`./deploy-layer.sh`](./deploy-layer.sh) to deploy both layers (Node Modules), AWS infrastructure (SQS, etc.) and apps (Javascript) when you change the Node Modules or want ***a complete deploy***.

Use `sls deploy` to just deploy the apps and AWS infrastructure. 

## API Docs

### `/` - `GET`

### Headers 

* None

### Body 

* None

### Returns 

* `curl` statment showing how to ingress.

### `/ingress` - `POST`

### Headers

* `auth` - JWT signed with an RSA private key with the following:

   * `iat` - unix timestamp at signing

   * `cluster` - UUID of cluster/bin

   * `site` - UUID of site

   * `org` - UUID of organization

   * `crt` - matching RSA public key to the one that signed the JWT

### Body

* JSON file containing the following:

    * `timestamp` - unix time in seconds: `float` 

    * `weight` - weight: `float`

    * `unit` - weight unit (preferably one of `kg`, `lb`, `oz`):  `string`

    * `mode` - type of waste (one of `compost`, `recycle`, `trash`)

### Returns

* 201 status code OR 4** or 5** status code and reason for failure


