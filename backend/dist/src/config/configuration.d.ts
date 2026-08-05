declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        accessSecret: string | undefined;
        refreshSecret: string | undefined;
        accessExpiration: string;
        refreshExpiration: string;
    };
};
export default _default;
