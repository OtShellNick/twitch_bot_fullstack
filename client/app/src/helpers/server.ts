import { cookies } from 'next/headers';

type TServerConfig = {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: Object
}
const Server = async ({ url, method = 'GET', data = {} }: TServerConfig) => {
    const fullUri = process.env.SERVER_URI + 'v1/' + url;

    const fetchData = JSON.stringify(data);

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Cookie: `wbautht=${cookies().get('wbautht')?.value}`
        },
        body: method === ('GET' || 'HEAD') ? null : fetchData
    };

    return await fetch(fullUri, options)
        .then(resp => {
            const data = resp.json();
            return data;
        })
        .catch(err => {
            console.error('err', err);
        })
};

export default Server;