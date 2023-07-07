
const { SERVER_URI } = process.env;

type TServerConfig = {
    url: string,
    method: string,
    data: Object
}
const Server = async ({ url, method = 'GET', data = {} }: TServerConfig) => {
    const fullUri = 'https://lastwitch.ru/' + 'v2/' + url;

    const fetchData = JSON.stringify(data);

    console.log('data', data)

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: fetchData
    };

    return await fetch(fullUri, options)
};

export default Server;