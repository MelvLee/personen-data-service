const { createLogger, format, transports } = require('winston');

function setContextProperties(parameters, context) {
    for(const key in parameters) {
        if(!parameters.hasOwnProperty(key)) continue;
        if(key === "__proto__" || key === "constructor") continue;

        if(typeof(parameters[key]) === 'object') {
            if(context[key] === undefined) {
                context[key] = {};
            }
            setContextProperties(parameters[key], context[key]);
        }
        else {
            context[key] = parameters[key];
        }
    }
}

function configureSqlSettings(context) {
    context.sql = {
        useDb: true,
        cleanup: true,
        deleteIndividualRecords: true,
        poolConfig: {
            user: 'root',
            host: 'localhost',
            database: 'rvig_haalcentraal_testdata',
            password: 'root',
            port: 5432,
            allowExitOnIdle: true
        }
    };
}

function configureOAuthSettings(context) {
    context.oAuth = {
        enable: false,
        accessTokenUrl: 'http://identityserver:6000/connect/token',
        clients:[
            {
                afnemerID: '000008',
                gemeenteCode: '0800',
                clientId: 'client met gemeentecode (eigen gemeente)',
                clientSecret: 'secret',
                scopes: [ '000000099000000080000' ],
                resourceServer: 'ResourceServer02'
            },
            {
                afnemerID: '000008',
                gemeenteCode: '0599',
                clientId: 'client met gemeentecode (ander gemeente)',
                clientSecret: 'secret',
                scopes: [ '000000099000000080000' ],
                resourceServer: 'ResourceServer02'
            },
            {
                afnemerID: '000008',
                clientId: 'client zonder gemeentecode',
                clientSecret: 'secret',
                scopes: [ '000000099000000080000' ],
                resourceServer: 'ResourceServer02'
            }
        ]
    }
}

function configureLogger(context) {
    context.logger = createLogger({
        level: 'warn',
        transports: [
            new transports.Console({ format: format.prettyPrint() })
        ]
    });
}

class World {
    constructor(parameters) {
        this.context = parameters;

        this.context.autzUrl = 'http://localhost:8080/haalcentraal/api'
        this.context.apiUrl = 'http://localhost:8000/haalcentraal/api'
        this.context.proxyUrl = 'http://localhost:5002/haalcentraal/api'

        this.context.gezagDataPath = './test-data/GezagMock/test-data.json';
        this.context.logFileToAssert = './test-data/logs/brp-proxy.json';
        this.context.downstreamApiDataPath = './test-data/DownstreamApi';

        configureSqlSettings(this.context);
        configureOAuthSettings(this.context);
        configureLogger(this.context);

        setContextProperties(parameters.parameters, this.context);
    }
}

// set this environment variable to bypass DEPTH_ZERO_SELF_SIGNED_CERT error when using self-signed certificates
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = { World }

