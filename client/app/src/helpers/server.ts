console.log(process.env)
const { NEXT_PUBLIC_SERVER_URI } = process.env;

type TServerConfig = {
    url: string,
    method: string,
    data: Object
}
const Server = async ({ url, method = 'GET', data = {} }: TServerConfig) => {
    const fullUri = NEXT_PUBLIC_SERVER_URI + 'v1/' + url;

    const fetchData = JSON.stringify(data);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        data: fetchData
    };

    return await fetch(fullUri, options)
};

export default Server;