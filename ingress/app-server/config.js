module.exports.config = {
    
    server_debugging: false,
    db_debugging: true,
    
    headers:{
        authorization: "TODO",
        maxDelay: 10,
    },
    actor:{ // everything the actor must have
        org: 'org',
        site: 'site',
        cluster: 'cluster',
        crt: 'crt',
        time: 'iat',
        GoogleSheetsRef: 'SheetsRef',
        GoogleTableRef: 'TableRef',
        // ElasticSearchURL: 'ElasticURL',
        ElasticSearchIndex: 'ElasticIndex',
    },
    event: {
        timestamp: 'timestamp',
        weight: 'weight',
        weightUnits: 'units',
        wasteType: 'mode',
    },
    server: {
        port : 3000,
        routes: {
            post: '/ingress'
        },
        uploads_dir: './uploads/',
    },
    es: { // outgoing
        url: 'http://10.128.1.6:9200',
        username: 'elastic',
        password: 'elastic123',
    },
    pg: { // postgres
        // host: '54.208.225.174',
        host: '10.128.1.6',
        port: '5432',
        user: 'postgres',
        password: ')*(&^87hjg0*^Jh)876yh)8<MBUYY*9hv97',
        database: 'evo-ingress',

        dataTable: 'bin_weights',
        clustersTable: 'clusters',
        orgsTable: 'orgs',
        sitesTable: 'sites',

        modes: {
            unknown: 0,
            compost: 1,
            trash: 2,
            recycle: 3,
        }
    },
    influx: {
        org: 'evoeco',
        bucket: 'evo-ingress-1',
        url: 'http://10.128.1.6:8086',
        // url: 'http://54.208.225.174:8086',
        tokenFile: './influx-token.txt',
    },
    sqs: {
        urls: [
            'https://sqs.us-east-1.amazonaws.com/159721516752/GoogleSheetsQueue',
            'https://sqs.us-east-1.amazonaws.com/159721516752/ElasticSearchQueue',
            'https://sqs.us-east-1.amazonaws.com/159721516752/PostgresDBQueue',
            'https://sqs.us-east-1.amazonaws.com/159721516752/InfluxDBQueue',
        ]
    },
    sns: {
        arns: [
            'arn:aws:sns:us-east-1:159721516752:FanoutTopic'
        ]
    },
}










// sample payloads
const payload = {
    weight: 0,
    change: 0,
    total: 0, /// number of times they clicked "again"/"more"
    units: 'lbs',
    wasteType: '',
    
}

const envelope = {
    actor: {
        id: '',
    },
    payload,
    metaData: {
// arbitrarmy, treat it as black box
    }
}