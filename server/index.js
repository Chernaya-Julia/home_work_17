const { join } = require('path');
const { readJSON, writeJSON } = require('./utils');
const http = require('http');
const { defaultMaxListeners } = require('events');

const userAddr = join(__dirname,'users.json');
const levels = join(__dirname, 'levels.json');

const get = (req, res) => {
    res.writeHead(200, {
        ['Content-Type']: 'application/json',
    })
    readJSON(userAddr, (_, data) => {
        res.end(JSON.stringify(data));
    })
}

const add = (req, res, body) => {
    res.writeHead(200, {
        ['Content-Type']: 'application/json',
    })
    readJSON(userAddr, (_, data) => {
        const lastUser = data[data.length-1];
        const newData = [
            ...data, 
            {
                ...body,
                id: ((lastUser && lastUser.id) || 0) + 1,
            }
        ];
        writeJSON(userAddr, 
            newData,
            () => {
                res.end(JSON.stringify(newData));
            }
        );
    });
}

// На входе - JSON с ИД пользователя, который мы хотим удалить
const del = (req, res, body) => {
    res.writeHead(200, {
        ['Content-Type']: 'application/json',
    })
    readJSON(userAddr, (_, data) => {
        const newData = data.filter((usr) => {
            return (usr.id != body.id);
        });
        writeJSON(userAddr, 
            newData,
            () => {
                res.end(JSON.stringify(newData));
            }
        );
    });
}

// На входе - JSON с заполненными полями (ИД должно быть). По ИД матчится с исходным JSON и, если нашли пользователя с этим ИД - его поля заменяются на полученные из JSON
const upd = (req, res, body) => {
    res.writeHead(200, {
        ['Content-Type']: 'application/json',
    })
    readJSON(userAddr, (_, data) => {
        const newData = data.map((usr) => {
            if (usr.id == body.id) {
                usr.name = body.name;
                usr.level = body.level;
            } 
            return usr;
        });
        writeJSON(userAddr, 
            newData,
            () => {
                res.end(JSON.stringify(newData));
            }
        );
    });
}

const route = (req, res, data) => {
    const parseUrl = req.url.split('/').filter((part)=>part);

    switch (parseUrl[0]) {
        case 'get':
            get(req,res);
            break;
            case 'add':
                add(req, res, data);
                break;
            case 'del':
                del(req, res, data);
                break;
            case 'upd':
                upd(req, res, data);
                break;            
            default: 
               res.end('Hi there');
    }
 
} 

const server = http.createServer((req, res) => {
    let body = [];
    req 
        .on('data', (chunk) => {
            body.push(chunk);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();
            route(req, res, body ? JSON.parse(body) : undefined);
        });
    
});

server.listen(8080, () => {
    console.log('You can listen server on 8080');
})