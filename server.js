/* modules */
const Http = require('http');
const fs = require("fs");
const querystring = require("querystring");
const Redis  = require("redis");
const qs = require('querystring');

const client = Redis.createClient();

const handler = (request, response) => {
  const endpoint = request.url;
  const method = request.method;

  if (endpoint === "/") {
    if (method === "GET") {
      response.writeHead(200, { "Content-Type": "text/html" });
      fs.readFile(__dirname + "/public/index.html", (error, file) => {
        if (error) {
          console.log(error);
          return;
        } else {
          console.log("displaying");
          response.end(file);
        }
      });
    } else if (method === "POST") {
      let input = "";
      request.on("data", (data) => {
        input += data;
      });
      request.on("end", () => {
        const payload = qs.parse(input);
        let items = [];
        client.zrange("favouritesSet", 0, -1, (err, data) => {
          if (err) { console.log(err); }
          else {
            items = items.concat(data);
            const index = items.length;
            client.zadd("favouritesSet", index, payload.item, (err, reply) => {
              if (err) {
                console.log(err);
              } else {
                fs.readFile(__dirname + "/public/index.html", (error, file) => {
                  if (error) {
                    console.log(error);
                    return;
                  } else {
                    response.end(file);
                  }
                });
              }
            })
          }
        })
      })
    }
  } else if (endpoint === "/items") {
    client.zrange("favouritesSet", 0, -1, "WITHSCORES", (err, data) => {
      if(err) { console.log(err); }
      else {
        const items = data.filter((item, index) => index % 2 === 0);
        const scores = data.filter((item, index) => index % 2 > 0);
        var data = {
          items: items,
          scores: scores,
         };
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data));
      }
    })
  } else if (endpoint === "/remove") {
    let input = '';
    request.on("data", (data) => {
      input += data;
    });
    request.on("end", () => {
      const item = JSON.parse(input).item;
+     client.zremrangebyscore("favouritesSet", item, item, (err, reply) => {
        if (err) { console.log(err); }
        else {
          client.zadd("favouritesSet", item, "", (err, reply) => {
            if (err) { console.log(err); }
            else {
              client.zrange("favouritesSet", 0, -1, "WITHSCORES", (err, data) => {
                if (err) { console.log(err); }
                else {
                  const items = data.filter((item, index) => index % 2 === 0);
                  const scores = data.filter((item, index) => index % 2 > 0);
                  var data = {
                    items: items,
                    scores: scores,
                   };
                  response.writeHead(200, { "Content-Type": "application/json" });
                  response.end(JSON.stringify(data));
                }
              })
            }
          })
        }
     });

    });
  } else {
    const fileName = request.url;
    const fileType = fileName.split(".")[1];
    response.writeHead(200, { "Content-Type": "text/" + fileType });
    fs.readFile(__dirname + "/public" + fileName, (err, file) => {
      if (err) {
        console.log(err);
        return;
      } else {
        response.end(file)
      }
    });
  }
};

  const server = Http.createServer(handler);

  server.listen(8080, () => {
    console.log(`server running`);
  });
