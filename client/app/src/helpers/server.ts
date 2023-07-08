
const { SERVER_URI } = process.env;

type TServerConfig = {
    url: string,
    method: string,
    data: Object
}
const Server = async ({ url, method = 'GET', data = {} }: TServerConfig) => {
    const fullUri = 'http://localhost:8082/' + 'v1/' + url;

    const fetchData = JSON.stringify(data);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: fetchData
    };

    return await fetch(fullUri, options)
        .then(resp => resp.json())
        .catch(console.log)
};

export default Server;