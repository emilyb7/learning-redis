function request(url, method, payload) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open((method || 'GET'), url);

    req.onload = function() {
      if (req.status == 200) { resolve(req.response); }
      else { reject(Error(req.statusText)); }
    };

    req.onerror = function() { reject(Error("Network Error")); };

    req.send(payload);
  });
}

request('/items').then(function(response) {
  var data = JSON.parse(response);
  var items = data.items;
  var scores = data.scores;
  var itemList = items.filter(function(item) {
    return !!item;
  }).map(function(item, index){
    var listItem = document.createElement('li');
    listItem.textContent = item;
    listItem.id = scores[index];
    listItem.addEventListener("click", remove);
    return listItem;
  })
  itemList.forEach(function(item) { document.querySelector('ul').appendChild(item); });
}, function(error) {
  console.error("Failed!", error);
});

function removeRequest(payload) {
  request('/remove', 'POST', payload).then(function(response) {
    console.log(response);
    var data = JSON.parse(response);
    var items = data.items;
    var scores = data.scores;
    var itemList = items.filter(function(item) {
      return !!item;
    }).map(function(item, index){
      var listItem = document.createElement('li');
      listItem.textContent = item;
      listItem.id = scores[index];
      listItem.addEventListener("click", remove);
      return listItem;
    })
    itemList.forEach(function(item) { document.querySelector('ul').appendChild(item); });
  })
}

function remove () {
  var item = this.id;
  var list =  document.querySelector('ul');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  var payload = JSON.stringify({ item: item, });
  console.log(payload);
  removeRequest(payload);
}
