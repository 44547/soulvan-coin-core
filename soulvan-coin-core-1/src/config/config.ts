export interface Config {
    network: {
        host: string;
        port: number;
        protocol: string;
    };
    database: {
        uri: string;
        options: {
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
        };
    };
    wallet: {
        defaultBalance: number;
        transactionFee: number;
    };
}

const config: Config = {
    network: {
        host: 'localhost',
        port: 3000,
        protocol: 'http',
    },
    database: {
        uri: 'mongodb://localhost:27017/soulvan-coin',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    wallet: {
        defaultBalance: 1000,
        transactionFee: 0.01,
    },
};

export default config;